const mongodb = require('mongodb')
const qs = require('qs')

const queue = []

const database = {
  handler: null,
  use: (fn) => {
    if (database.handler) {
      return fn(database.handler)
    } else {
      queue.push(fn)
    }
  }
}

function flush () {
  queue.forEach((fn) => {
    fn(database.handler)
  })
}

function data (conf) {
  const auth = conf.username && conf.password ? `${conf.username}:${conf.password}@` : ''
  const query = {
    replicaSet: conf.replicaSet
  }
  if (conf.username && conf.password) {
    // query.ssl = true
    // query.authSource = 'admin'
  }

  const url = `mongodb://${auth}${conf.hosts}/${conf.databaseName}?${qs.stringify(query)}`
  const client = new mongodb.MongoClient(url)
  client.connect((err) => {
    if (err) {
      const msg = 'Error connecting to MongoDB'
      err.details = {
        msg,
        url
      }
      throw err
    }
    database.handler = client.db(conf.databaseName)
    flush()
  }, { useNewUrlParser: true })
  // In the meantime
  return database
}

module.exports = exports = data
