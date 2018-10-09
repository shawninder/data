const spawn = require('vigour-spawn')

const ports = [
  27017,
  27018,
  27019
]

const commands = ports.map((port, idx) => {
  return `mongod --port ${port} --dbpath /srv/mongodb/rs0-${idx} --replSet rs0 --smallfiles --oplogSize 128`
})

Promise.all(commands.map((command) => {
  return spawn(command, { verbose: true, getOutput: true })
    .then((output) => {
      console.log(command)
      console.log(output)
    })
    .catch((ex) => {
      console.error('ex', ex)
    })
}))
