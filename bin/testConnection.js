const Data = require('../')

const [, , cluster, hosts, databaseName, replicaSet, username, password] = process.argv

console.log('config', {
  username,
  password,
  cluster,
  hosts,
  databaseName,
  replicaSet
})
const data = new Data({
  username,
  password,
  cluster,
  hosts,
  databaseName,
  replicaSet
})

data.use(({ db }) => {
  return db.collection('events').insertOne({
    name: 'test'
  })
    .then(() => {
      return db.collection('events').find()
    })
    .then((cursor) => {
      cursor.forEach((event) => {
        console.log('event', event)
      })
    })
    .catch(console.error)
})
