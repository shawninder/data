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
  console.log('flush', database.handler)
  queue.forEach((fn) => {
    console.log('fn', fn)
    fn(database.handler)
    console.log('BOOM')
  })
}

function data (conf) {
  const auth = conf.username && conf.password ? `${conf.username}:${conf.password}@` : ''
  const query = {
    replicaSet: conf.replicaSet
  }
  // if (conf.username && conf.password) {
  //   query.ssl = true
  //   query.authSource = 'admin'
  // }

  const url = `mongodb://${auth}${conf.hosts}/${conf.databaseName}?${qs.stringify(query)}`
  console.log('url', url)
  const client = new mongodb.MongoClient(url)
  client.connect((err) => {
    console.log('err', err)
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
  })
  // In the meantime
  return database
}

module.exports = exports = data
