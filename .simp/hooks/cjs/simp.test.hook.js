'use strict';

var simpcicd = require('simpcicd');

const { trigger } = simpcicd.useTrigger();
simpcicd.useExec();

const start = async () => {
  await trigger("default");
  await process.exit();
};

start();
