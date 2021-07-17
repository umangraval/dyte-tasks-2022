"use strict";
const path = require("path");
const mkdir = require("mkdirp").sync;
const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");
const { MONGO_URI } = require("../config/config");

module.exports = function (collection) {
  if (MONGO_URI) {
    return {
      mixins: [DbService],
      adapter: new MongooseAdapter(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
      model: collection,
    };
  }
  // Create data folder
  mkdir(path.resolve("./data"));
  return {
    mixins: [DbService],
    adapter: new DbService.MemoryAdapter({
      filename: `./data/${collection.collection.modelName}.db`,
    }),
    methods: {
      entityChanged(type, json, ctx) {
        return this.clearCache().then(() => {
          const eventName = `${this.name}.entity.${type}`;
          this.broker.emit(eventName, { meta: ctx.meta, entity: json });
        });
      },
    },
  };
};
