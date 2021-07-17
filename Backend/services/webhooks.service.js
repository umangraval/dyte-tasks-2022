/* eslint-disable no-underscore-dangle */
const { MoleculerClientError } = require('moleculer').Errors;
const api = require('../util/API');
const DbService = require('../mixins/db.mixin');
const Webhook = require('../models/webhook.model');

module.exports = {
  name: 'webhooks',
  mixins: [DbService(Webhook)],
  settings: {
    /** Public fields */
    fields: ['_id', 'targetUrl'],
  },
  actions: {
    testing() {
      return Promise.resolve({ msg: 'Pong' });
    },
    register: {
      params: {
        targetUrl: { type: 'string' },
      },
      async handler(ctx) {
        const { targetUrl } = ctx.params;
        try {
          if (!(await this.webhookExistByUrl(targetUrl))) {
            const doc = await this.adapter.insert({ targetUrl });
            return Promise.resolve({ Id: doc._id, msg: 'Registered webhook' });
          }
          return Promise.reject(
            new MoleculerClientError({ msg: 'Url exists!' }, 409),
          );
        } catch (err) {
          return Promise.reject(
            new MoleculerClientError({ msg: 'Server Error' }, 500),
          );
        }
      },
    },
    list: {
      async handler() {
        try {
          const data = this.transform(await this.adapter.find({}));
          return Promise.resolve({ data, msg: 'list webhooks' });
        } catch (err) {
          return Promise.reject(
            new MoleculerClientError({ msg: 'Server Error' }, 500),
          );
        }
      },
    },
    update: {
      params: {
        Id: { type: 'string' },
        newTargetUrl: { type: 'string' },
      },
      async handler(ctx) {
        const { Id, newTargetUrl } = ctx.params;
        try {
          if (await this.webhookExistById(Id)) {
            await this.adapter.updateById(Id, {
              $set: {
                targetUrl: newTargetUrl,
              },
            });
            return Promise.resolve({ msg: 'Updated webhook' });
          }
          return Promise.reject(
            new MoleculerClientError({ msg: 'Webhook Does not exists!' }, 404),
          );
        } catch (err) {
          return Promise.reject(
            new MoleculerClientError({ msg: 'Server Error' }, 500),
          );
        }
      },
    },
    delete: {
      params: {
        Id: { type: 'string' },
      },
      async handler(ctx) {
        const { Id } = ctx.params;
        try {
          if (await this.webhookExistById(Id)) {
            await this.adapter.removeById(Id);
            return Promise.resolve({ msg: 'Deleted webhook' });
          }
          return Promise.reject(
            new MoleculerClientError({ msg: 'Webhook Does not exists!' }, 404),
          );
        } catch (err) {
          return Promise.reject(
            new MoleculerClientError({ msg: 'Server Error' }, 500),
          );
        }
      },
    },
    trigger: {
      params: {
        ipAddress: { type: 'string' },
      },
      async handler(ctx) {
        const { ipAddress } = ctx.params;
        try {
          const data = {
            ipAddress,
            timestamp: Math.round(new Date().getTime() / 1000),
          };

          const urls = this.transform(await this.adapter.find({}));

          for (let i = 0; i < urls.length; i += 1) {
            urls[i] = api.post(urls[i].targetUrl, data, {
              headers: { 'Content-Type': 'application/json' },
            });
          }

          const results = await Promise.all(urls.map((p) => p.catch((e) => e)));
          const validResults = results.filter(
            (result) => !(result instanceof Error),
          );
          return Promise.resolve({
            success_requests: validResults.length,
            total_urls: urls.length,
            msg: 'Trigger webhook',
          });
        } catch (err) {
          return Promise.reject(
            new MoleculerClientError({ msg: 'Server Error' }, 500),
          );
        }
      },
    },
  },
  methods: {
    transform(arr) {
      return arr.map(({ _id, targetUrl }) => ({ _id, targetUrl }));
    },
    async webhookExistById(Id) {
      const found = await this.adapter.findOne({ _id: Id });
      return found;
    },
    async webhookExistByUrl(targetUrl) {
      const found = await this.adapter.findOne({ targetUrl });
      return found;
    },
  },
};
