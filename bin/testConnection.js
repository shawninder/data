const Data = require('../')

const [, , cluster, hosts, databaseName, replicaSet, username, password] = process.argv

console.log('config', {
  username,
  // password,
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

;(async () => {
  await data.use(async ({ db }) => {
    try {
      await db.collection('events').insertOne({ name: 'test' })
      const cursor = db.collection('events').find().limit(2)
      cursor.forEach((event) => {
        console.log('event', event)
      })
    } catch (ex) {
      console.error(ex)
    }
  })
})()
