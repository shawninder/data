const MongoClient = require('mongodb').MongoClient
const qs = require('qs')

class Data {
  constructor (conf) {
    const auth = conf.username && conf.password ? `${conf.username}:${conf.password}@` : ''
    const query = {
      retryWrites: true
      // replicaSet: conf.replicaSet
    }
    const cluster = (conf.cluster ? `${conf.cluster}-` : '')
    if (conf.username && conf.password) {
      // query.ssl = true
      // query.authSource = 'admin'
    }
    this.conf = {
      ...conf,
      connectionString: `mongodb+srv://${auth}${cluster}${conf.hosts}/${conf.databaseName}?${qs.stringify(query)}`
    }
    this.queue = [] // Remembers calls made while offlinet to playback later
    this.db = null // This will be the database handler once created and a not-ready flag until then

    this.use = this.use.bind(this)
    this.connect = this.connect.bind(this)
    this.flush = this.flush.bind(this)

    this.connect().then(this.flush)
  }

  connect () {
    return new Promise((resolve, reject) => {
      try {
        MongoClient.connect(this.conf.connectionString,
          { useNewUrlParser: true },
          (err, client) => {
            if (err) {
              const msg = 'Error connecting to MongoDB'
              err.details = {
                msg,
                url: this.conf.connectionString
              }
              reject(err)
            } else {
              this.db = client.db(this.conf.databaseName)
              resolve(this.db)
            }
          })
      } catch (ex) {
        reject(ex)
      }
    })
  }

  flush (db) {
    this.queue.forEach((fn) => {
      fn({ db: this.db })
    })
  }

  use (fn) {
    if (this.db) {
      fn({ db: this.db })
    } else {
      this.queue.push(fn)
    }
  }
}

module.exports = exports = Data
