"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let WebhookSchema = new Schema({
	targetUrl: {
		type: String,
		trim: true,
		required: "Url is required"
	},
}, {
	timestamps: true
});

module.exports = mongoose.model("Webhook", WebhookSchema);