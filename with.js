const mongodb = require('mongodb')
const qs = require('qs')

const client = mongodb.MongoClient

module.exports = exports = (conf, fn) => {
  const auth = conf.user && conf.pass ? `${conf.user}:${conf.pass}@` : ''
  const query = {
    replicaSet: conf.replicaSet
  }
  if (conf.user && conf.pass) {
    query.ssl = true
    query.authSource = 'admin'
  }

  const url = `mongodb://${auth}${conf.hosts}/${conf.database}?${qs.stringify(query)}`

  return client.connect(url)
    .catch((reason) => {
      const msg = 'Error connecting to MongoDB'
      reason.details = {
        msg,
        url
      }
      throw reason
    })
    .then((db) => {
      return fn(db)
        .then((results) => {
          db.close()
          return results
        }, (reason) => {
          db.close()
          throw reason
        })
    })
}
