"use strict";
const express = require("express");
const bodyParser = require("body-parser");

module.exports = {
  name: "gateway",
  settings: {
    port: process.env.PORT || 3000,
  },
  methods: {
    initRoutes(app) {
      app.get("/", this.ping);
      app.post("/register", this.register);
      app.put("/update", this.update);
      app.get("/list", this.list);
      app.delete("/delete", this.delete);
      app.post("/ip", this.ip);
    },
    ping(req, res) {
      return Promise.resolve()
        .then(() => {
          return this.broker.call("webhooks.testing").then((data) => {
            res.send(data);
          });
        })
        .catch(this.handleErr(res));
    },
    register(req, res) {
      const targetUrl = req.body.targetUrl;
      return Promise.resolve()
        .then(() => {
          return this.broker
            .call("webhooks.register", { targetUrl })
            .then((data) => {
              res.send(data);
            });
        })
        .catch(this.handleErr(res));
    },
    update(req, res) {
      const payload = req.body;
      return Promise.resolve()
        .then(() => {
          return this.broker
            .call("webhooks.update", { payload })
            .then((data) => {
              res.send(data);
            });
        })
        .catch(this.handleErr(res));
    },
    list(req, res) {
      return Promise.resolve()
        .then(() => {
          return this.broker.call("webhooks.list").then((data) => {
            res.send(data);
          });
        })
        .catch(this.handleErr(res));
    },
    delete(req, res) {
      const { Id } = req.body;
      return Promise.resolve()
        .then(() => {
          return this.broker.call("webhooks.delete", { Id }).then((data) => {
            res.send(data);
          });
        })
        .catch(this.handleErr(res));
    },
    ip(req, res) {
      const ipAddress = req.connection.remoteAddress;
      return Promise.resolve()
        .then(() => {
          return this.broker.call("webhooks.trigger", { ipAddress }).then((data) => {
            res.send(data);
          });
        })
        .catch(this.handleErr(res));
    },
    handleErr(res) {
      return (err) => {
        res.status(err.code || 500).send(err.message);
      };
    },
  },
  created() {
    const app = express();
    app.use(bodyParser());
    this.initRoutes(app);
    this.app = app;
  },
  started() {
    this.app.listen(Number(this.settings.port), (err) => {
      if (err) return this.broker.fatal(err);
      this.logger.info(`Server started on port ${this.settings.port}`);
    });
  },
  stopped() {
    if (this.app.listening) {
      this.app.close((err) => {
        if (err) return this.logger.error("Server closed", err);
        this.logger.info("Server stopped!");
      });
    }
  },
};
