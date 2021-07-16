"use strict";
const express = require("express");
const bodyParser = require('body-parser');

module.exports = {
    name: "gateway",
    settings: {
        port: process.env.PORT || 3000,
    },
    methods: {
        initRoutes(app) {
            app.get("/", this.ping);
        },
        ping(req, res) {
            return Promise.resolve()
                .then(() => {
                    return this.broker.call("webhooks.testing").then(movies => {
                        res.send(movies);
                    });
                })
                .catch(this.handleErr(res));
        },
        handleErr(res) {
            return err => {
                res.status(err.code || 500).send(err.message);
            };
        }
    },
    created() {
        const app = express();
        app.use(bodyParser());
        this.initRoutes(app);
        this.app = app;
    },
    started() {
		this.app.listen(Number(this.settings.port), err => {
			if (err) return this.broker.fatal(err);
			this.logger.info(`Server started on port ${this.settings.port}`);
		});

	},
	stopped() {
		if (this.app.listening) {
			this.app.close(err => {
				if (err) return this.logger.error("Server closed", err);
				this.logger.info("Server stopped!");
			});
		}
	}
};