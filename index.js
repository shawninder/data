const Mongo = require('mongodb')
const MongoClient = Mongo.MongoClient
const qs = require('qs')

// exit codes
const MONGO_FAIL = 1

class Data {
  constructor (conf) {
    const auth = conf.username && conf.password ? `${conf.username}:${conf.password}@` : ''
    const query = {
      // retryWrites: true,
      replicaSet: conf.replicaSet
    }
    const cluster = (conf.cluster ? `${conf.cluster}-` : '')
    if (conf.username && conf.password) {
      // query.ssl = true
      // query.authSource = 'admin'
    }
    const protocol = cluster ? 'mongodb+srv://' : 'mongodb://'
    const queryString = cluster ? '' : `?${qs.stringify(query)}`
    this.conf = {
      ...conf,
      connectionString: `${protocol}${auth}${cluster}${conf.hosts}/${conf.databaseName}${queryString}`,
      censoredConnectionString: `${protocol}$\{auth}${cluster}${conf.hosts}/${conf.databaseName}${queryString}`
    }
    this.queue = [] // Remembers calls made while offlinet to playback later
    this.db = null // This will be the database handler once created and a not-ready flag until then

    this.queueFn = this.queueFn.bind(this)
    this.use = this.use.bind(this)
    this.connect = this.connect.bind(this)
    this.flush = this.flush.bind(this)

    this.connect()
  }

  connect () {
    const abort = (ex) => {
      console.error(`Can't connect to ${this.conf.censoredConnectionString}`, ex)
      process.exit(MONGO_FAIL)
    }
    try {
      console.log(`Connecting to ${this.conf.censoredConnectionString}`)
      MongoClient.connect(this.conf.connectionString,
        { useNewUrlParser: true },
        (err, client) => {
          if (err) {
            abort(err)
          } else {
            console.log(`Connected to ${this.conf.censoredConnectionString}`)
            this.db = client.db(this.conf.databaseName)
            this.flush()
          }
        })
    } catch (ex) {
      abort(ex)
    }
  }

  flush () {
    this.queue.forEach((fn) => {
      fn()
    })
  }

  queueFn (fn) {
    // Promise that the function
    return new Promise((resolve, reject) => {
      // will be added to the queue
      this.queue.push(() => {
        // and will resolve its return value (or reject something)
        resolve(this.use(fn))
      })
    })
  }

  use (fn) {
    // Promise that the function
    return new Promise((resolve, reject) => {
      // if database is connected
      if (this.db) {
        // is called immediately
        return resolve(fn({ db: this.db }))
      }
      // or called upon reconnection
      return resolve(this.queueFn(fn))
    })
  }
}

Data.ObjectId = Mongo.ObjectId

module.exports = exports = Data
