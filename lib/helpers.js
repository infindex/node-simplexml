/*
 * node-simplexml
 * http://github.com
 *
 * Copyright (c) 2013 Manjunath Govindaswamy
 * Licensed under the MIT license.
 */

'use strict';

exports.mergeOptions = function(defaults, options){
  // prepare the options for Object.create
  var opts = {};
  for(var i in options){
    opts[i] = { 
      value: options[i], 
      enumerable: true, 
      writeable: true, 
      configurable: true
    };
  }

  // let Object.create merge the options with the defaults
  return Object.create(defaults, opts);
};

var trim = exports.trim = function(string) {
  return string.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
};

exports.singular = function(string) { //from inflector
  var s = trim(string);
  if(s.length > 3){
    var end = s.substr(-3).toLowerCase();
    if(end === 'ies') {
      s = s.substr(0, s.length-3) + 'y';
    } else if(end === 'ses') {
      s = s.substr(0, s.length-2);
    } else {
      end = s.substr(-1).toLowerCase();
      if(end === 's') {
        s = s.substr(0, s.length-1);
      }
    }
  }
  return s;
};

