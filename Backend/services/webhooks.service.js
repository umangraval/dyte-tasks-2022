"use strict"; 

module.exports = {
    name: "webhooks",
    actions: {
        testing(ctx) {
           return Promise.resolve({ msg: "Pong" });
        },
    },
};