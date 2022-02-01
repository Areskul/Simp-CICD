'use strict';

var simpcicd = require('simpcicd');

const { trigger } = simpcicd.useTrigger();
const { exec } = simpcicd.useExec();

exec("touch itsworking");
trigger("default");
