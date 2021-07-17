"use strict";

const {} = require("axios");
const { MoleculerClientError } = require("moleculer").Errors;
const api = require("../util/API");
const DbService = require("../mixins/db.mixin");
const Webhook = require("../models/webhook.model");

module.exports = {
  name: "webhooks",
  mixins: [DbService(Webhook)],
  settings: {
    /** Public fields */
    fields: ["_id", "targetUrl"],
  },
  actions: {
    testing(ctx) {
      return Promise.resolve({ msg: "Pong" });
    },
    register: {
      params: {
        targetUrl: { type: "string" },
      },
      async handler(ctx) {
        const { targetUrl } = ctx.params;
        if (!(await this.webhookExistByUrl(targetUrl))) {
          const doc = await this.adapter.insert({ targetUrl });
          return Promise.resolve({ Id: doc._id, msg: "Registered webhook" });
        }
        return Promise.reject(
          new MoleculerClientError({ msg: "Url exists!" }, 409)
        );
      },
    },
    list: {
      async handler(ctx) {
        const data = this.transform(await this.adapter.find({}));
        return Promise.resolve({ data, msg: "list webhooks" });
      },
    },
    update: {
      params: {
        Id: { type: "string" },
        newTargetUrl: { type: "string" },
      },
      async handler(ctx) {
        const { Id, newTargetUrl } = ctx.params;
        if (await this.webhookExistById(Id)) {
          await this.adapter.updateById(Id, {
            $set: {
              targetUrl: newTargetUrl,
            },
          });
          return Promise.resolve({ msg: "Updated webhook" });
        }
        return Promise.reject(
          new MoleculerClientError({ msg: "Webhook Does not exists!" }, 404)
        );
      },
    },
    delete: {
      params: {
        Id: { type: "string" },
      },
      async handler(ctx) {
        const { Id } = ctx.params;
        if (await this.webhookExistById(Id)) {
          await this.adapter.removeById(Id);
          return Promise.resolve({ msg: "Deleted webhook" });
        }
        return Promise.reject(
          new MoleculerClientError({ msg: "Webhook Does not exists!" }, 404)
        );
      },
    },
    trigger: {
      params: {
        ipAddress: { type: "string" },
      },
      async handler(ctx) {
        const { ipAddress } = ctx.params;
        const data = {
          ipAddress,
          timestamp: Math.round(new Date().getTime() / 1000),
        };

        // sample
        const urls = [
          api.get("https://api.github.com/users/MaksymRudnyi"),
          api.get("https://api.github.com/users/*"),
          api.get("https://api.github.com/users/taylorotwell"),
        ];
        const results = await Promise.all(urls.map((p) => p.catch((e) => e)));
        const validResults = results.filter(
          (result) => !(result instanceof Error)
        );
        console.log(validResults);
        return Promise.resolve({ msg: "Trigger webhook" });
      },
    },
  },
  methods: {
    transform(arr) {
      return arr.map(({ _id, targetUrl }) => ({ _id, targetUrl }));
    },
    async webhookExistById(Id) {
      return await this.adapter.findOne({ _id: Id });
    },
    async webhookExistByUrl(targetUrl) {
      return await this.adapter.findOne({ targetUrl });
    },
  },
};
