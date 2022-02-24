import debug = require("debug");

const log = debug("aws-cdk-assert");

export function noop() {
  log("noop");
}