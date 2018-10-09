/*
  Create a user with dbAdmin role
  Set the username and password when calling the script:
  ```sh
  mongo --host replicaSet/host:port,host:port,host:port --eval \"const username = '$MONGO_BOT_USERNAME', password = '$MONGO_BOT_PASSWORD';\" ./mongoScripts/createBot.js
  ```
*/
db.createUser({ // eslint-disable-line no-undef
  user: username, // eslint-disable-line no-undef
  pwd: password, // eslint-disable-line no-undef
  roles: ['dbAdmin']
})
