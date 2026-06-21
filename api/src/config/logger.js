const log4js = require("log4js");

log4js.addLayout("json", () => {
  return (logEvent) => {
    const data = logEvent.data[0];

    if (typeof data === "object") {
      return JSON.stringify(data);
    }

    return JSON.stringify({
      timestamp: new Date().toISOString(),
      message: data,
    });
  };
});

log4js.configure({
  appenders: {
    out: {
      type: "stdout",
      layout: {
        type: "json",
      },
    },
  },
  categories: {
    default: {
      appenders: ["out"],
      level: "info",
    },
  },
});

module.exports = log4js.getLogger("api");