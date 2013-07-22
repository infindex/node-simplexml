/*
 * node-simplexml
 * http://github.com
 *
 * Copyright (c) 2013 Manjunath Govindaswamy
 * Licensed under the MIT license.
 */

'use strict';

var helpers = require('./helpers'),
  et = require('elementtree'),
  ElementTree = et.ElementTree,
  element = et.Element,
  subElement = et.SubElement;

exports.toXML = function(object, options) {
  var self = this;

  //defaults
  var defaults = { 
    dateFormat: 'ISO', // ISO = ISO8601, SQL = MySQL Timestamp, JS = (new Date).toString()
    manifest: false,
    indent: 4,
    root: 'response'
  };

  var configs = helpers.mergeOptions(defaults, options);

  // bind all the config to this
  for(var o in configs){
    this[o] = configs[o];
  }

  function __parse(parent, object){

    if(typeof object === 'object' && object.constructor ) {
    //var el = null;
    switch(object.constructor.name) {
      case 'Array':
        __processArray(parent, object);
        break;
      case 'Date':
        __parse(parent, __processDate(self.dateFormat, object));
        break;
      default:
        __processObject(parent, object);
    }

    } else {

      switch(typeof object) {
        case 'string':
          parent.text = object;
          break;
        case 'number':
        case 'boolean':
          parent.text = object.toString();
          break;
        default:
          throw new Error("unknown_data_type: " + typeof object);
      }
    }
  }

  function __processArray(parent, array){
    var tagName = helpers.singular(parent.tag);
    array.forEach(function(object){
      var child = subElement(parent, tagName);
      __parse(child, object);
    });
  }

  function __processDate(dateFormat, object){
    var dateString = null;
    switch(dateFormat){
      case 'ISO':
        dateString = object.toISOString();
        break;
      case 'SQL':
        //todo: implement this
      case 'JS':
        dateString = object.toString();
        break;
      default:
        throw new Error("unknown_date_type: " + typeof object);
    }
    return dateString;
  }

  function __processObject(parent, object){
    var el = null;
    //if(object.constructor.name){
      //parent = subElement(parent, object.constructor.name);
    //}
    //assuming plain object
    for (var key in object) {
      if (object.hasOwnProperty(key)) {
        var property = object[key];
        if(typeof property !== 'undefined'){
          el = subElement(parent, key);
          __parse(el, property);
        }
      }
    }
  }

  var xml = element(self.root);
  __parse(xml, object);
  
  var xmlOpts = {
    xml_declaration: self.manifest
  };
  
  if(self.indent > 0) {
    (xmlOpts.indent =  self.indent);
  }
  
  return new ElementTree(xml).write(xmlOpts);
};