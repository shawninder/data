# Data

This repo acts as a guide to set up a MongoDB database locally (and on Atlas for production use) for the [Crowdsplay app](https://github.com/shawninder/music).

## Useful environment variables
Keep reading to see how they are used:

- MONGO_REPLICA_SET
- MONGO_DATABASE
- MONGO_BOT_USERNAME
- MONGO_BOT_PASSWORD
- ATLAS_REPLICA_SET
- ATLAS_DATABASE
- ATLAS_BOT_USERNAME
- ATLAS_BOT_PASSWORD
- ATLAS_ADMIN_USERNAME
- ATLAS_ADMIN_PASSWORD

## Local setup
1. Install MongoDB
2. (dev) Prepare the directories required by MongoDB for local operation:
(here <user> is the OS user that will be running `mongod` via `npm run db`)
```sh
sudo mkdir -p /data/db
sudo chown <user> /data/db
sudo mkdir -p /srv/mongodb/rs0-0  /srv/mongodb/rs0-1 /srv/mongodb/rs0-2
sudo chown -R <user> /srv/mongodb
```
Note that these must match what's in *startMongoDB.js*
3. Launch MongoDB
```sh
npm run start
```
4. Create the first MongoDB user's username and password and store them in ~/.bash_profile with
```sh
export MONGO_BOT_USERNAME=""
export MONGO_BOT_PASSWORD=""
```
5. Create the bot user (make sure you restart the terminal or `source ~/.bash_profile`)
```sh
npm run create-bot-user
```
6. Continue with [Common setup](#common-setup)

## Cloud setup with MongoDB Atlas
1. Log in
2. Create a new Organization
3. Create a new Cluster
4. Add a new MongoDB admin user (Atlas Admin) and store its name and password in ~/.bash_profile with
```sh
export ATLAS_ADMIN_USERNAME=""
export ATLAS_ADMIN_PASSWORD=""
```
5. Add a new MongoDB bot user (dbAdminAnyDatabase) and store its name and password in ~/.bash_profile with
```sh
export ATLAS_BOT_USERNAME=""
export ATLAS_BOT_PASSWORD=""
```
6. Add a new MongoDB hub user (readWrite@crowdsplay.events) and store its name and password in ~/.bash_profile with
```sh
export ATLAS_HUB_USERNAME=""
export ATLAS_HUB_PASSWORD=""
```
7. On the new Cluster, use the *connect* button to get the *Add current IP address* button
8. Add all other IPs which may want to connect
9. Continue with [Common setup](#common-setup)

## Common setup
1. Choose a database name and store it in ~/.bash_profile with
```sh
export MONGO_DATABASE=""
export ATLAS_DATABASE=""
```
2. Create the collections
```sh
npm run create-collections
npm run create-collections-remote
```
