#!/usr/bin/node
'use strict';

var tslog = require('tslog');
require('child_process');
require('picocolors');
require('lilconfig');
require('@sliphua/lilconfig-ts-loader');

new tslog.Logger({
    displayFilePath: "displayAll"
});
