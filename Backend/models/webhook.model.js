"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WebhookSchema = new Schema({
	targetUrl: {
		type: String,
		trim: true,
		required: "Url is required"
	},
}, {
	timestamps: true
});

module.exports = mongoose.model("Webhook", WebhookSchema);