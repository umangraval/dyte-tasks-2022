const os = require('os');

module.exports = {
  nodeID: (process.env.NODEID ? `${process.env.NODEID}-` : '') + os.hostname().toLowerCase(),
  // metrics: true,
  // cacher: true,
  tracing: {
    enabled: true,
    exporter: {
      type: 'Console', // Console exporter is only for development!
      options: {
        // Custom logger
        logger: null,
        // Using colors
        colors: true,
        // Width of row
        width: 100,
        // Gauge width in the row
        gaugeWidth: 40,
      },
    },
  },
};
