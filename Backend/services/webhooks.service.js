"use strict";
const crypto = require("crypto");
// const axios = require("axios");
const api = require("../util/API");

module.exports = {
  name: "webhooks",
  actions: {
    testing(ctx) {
      return Promise.resolve({ msg: "Pong" });
    },
    register(ctx) {
      const Id = crypto.randomBytes(20).toString("hex").substr(0, 7);
      const data = {
        Id: Id,
        targetUrl: ctx.params.url,
      };
      return Promise.resolve({ Id, msg: "Registered webhook" });
    },
    list(ctx) {
      return Promise.resolve({ msg: "list webhooks" });
    },
    update(ctx) {
      const { Id, newTargetUrl } = ctx.params;
      const data = {
        Id: Id,
        targetUrl: newTargetUrl,
      };
      return Promise.resolve({ msg: "Updated webhook" });
    },
    delete(ctx) {
      const { Id } = ctx.params;
      return Promise.resolve({ msg: "Deleted webhook" });
    },
    async trigger(ctx) {
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
};
