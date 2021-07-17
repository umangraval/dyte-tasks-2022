const DbService = require('moleculer-db');
const MongooseAdapter = require('moleculer-db-adapter-mongoose');
const { MONGO_URI } = require('../config/config');

module.exports = function (collection) {
  return {
    mixins: [DbService],
    adapter: new MongooseAdapter(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
    model: collection,
  };
};
