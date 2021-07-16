"use strict";
const crypto = require("crypto");

module.exports = {
  name: "webhooks",
  actions: {
    testing(ctx) {
      return Promise.resolve({ msg: "Pong" });
    },
    register(ctx) {
      const Id = crypto
        .randomBytes(20)
        .toString("hex")
        .substr(0, 7);
      const data = {
        Id: Id,
        targetUrl: ctx.params.url
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
        targetUrl: newTargetUrl
      };
      return Promise.resolve({ msg: "Updated webhook" });
    },
    delete(ctx) {
      const { Id } = ctx.params;
      return Promise.resolve({ msg: "Deleted webhook" });
    },
    trigger(ctx) {
      const { ipAddress } = ctx.params;
      const data = {
        ipAddress,
        timestamp: Math.round((new Date()).getTime() / 1000)
      };
      return Promise.resolve({ msg: "Trigger webhook" });
    }
  }
};
