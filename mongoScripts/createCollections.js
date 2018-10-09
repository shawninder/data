// Creates the collections needed for Crowdsplay
db.createCollection('events', { // eslint-disable-line no-undef
  capped: true,
  size: 256000000 // 256MB
})
