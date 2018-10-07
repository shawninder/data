# Data

The Database backing Crowdsplay

## Usage
1. Install MongoDB
2. (dev) Prepare the directories required by MongoDB for local operation:
(here <user> is the OS user that will be running `mongod` via `npm run db`)
```
sudo mkdir -p /data/db
sudo chown <user> /data/db
sudo mkdir -p /srv/mongodb/rs0-0  /srv/mongodb/rs0-1 /srv/mongodb/rs0-2
sudo chown -R <user> /srv/mongodb
```

Note that these must match what's in *startMongoDB.js*

3. Launch MongoDB
```
npm run start
```

4.
```
npm run seed-users
```

- users
- permissions
- schema
