'use strict';

var simplexml = require('../lib/simplexml.js');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports['simplexml'] = {
  setUp: function(done) {
    this.Obj = function(fname, lname) {
      this.fname = fname;
      this.lname = lname;
    };

    this.opts = {indent:0, root:'root'};

    done();
  },
  'premitive': function(test) {
    var self = this;
    
    //test string
    test.equals(simplexml.toXML('Donald', self.opts), '<root>Donald</root>');
    
    //test int
    test.equals(simplexml.toXML(1, self.opts), '<root>1</root>');

    //test double/float
    test.equals(simplexml.toXML(1.1, self.opts), '<root>1.1</root>');

    //test boolean
    test.equals(simplexml.toXML(true, self.opts), '<root>true</root>');
    test.equals(simplexml.toXML(false, self.opts), '<root>false</root>');

    test.done();
  },
  'date': function(test) {
    var self = this;
    var opts = self.opts;
    
    var date = new Date();

    //ISO dateformat
    test.equals(simplexml.toXML(date, opts), '<root>'+date.toISOString()+'</root>');

    opts.dateFormat = 'JS';
    //JS dateformat
    test.equals(simplexml.toXML(date, opts), '<root>'+date.toString()+'</root>');    

    test.done();
  },
  'arrays': function(test){
    var self = this;
    var opts = self.opts;

    //String array
    var planets = ['Mercury', 'Venus', 'Earth', 'Mars'];
    opts.root = 'planets';
    test.equals(simplexml.toXML(planets, opts), 
      '<planets><planet>Mercury</planet><planet>Venus</planet><planet>Earth</planet><planet>Mars</planet></planets>');

    //numbers array
    var numbers = [1,2,3,4,5];
    opts.root = 'numbers';
    test.equals(simplexml.toXML(numbers, opts), 
      '<numbers><number>1</number><number>2</number><number>3</number><number>4</number><number>5</number></numbers>');

    //Object
    var arrayObjs = [new self.Obj('joe', 'king'), new self.Obj('ron', 'bon')];
    opts.root = 'arrayObjs';
    test.equals(simplexml.toXML(arrayObjs, opts), 
      '<arrayObjs><arrayObj><fname>joe</fname><lname>king</lname></arrayObj><arrayObj><fname>ron</fname><lname>bon</lname></arrayObj></arrayObjs>');

    test.done();
  },
  'object': function(test) {
    var self = this;
    var opts = self.opts;

    //simple object
    function Mock(){
      this.name = 'Joe Don'; //String
      this.age = 12; //int
      this.score = 1.3; //double/float
      this.active = true; //boolean
    }
    opts.root = 'Mock';
    test.equals(simplexml.toXML(new Mock(), opts), 
      '<Mock><name>Joe Don</name><age>12</age><score>1.3</score><active>true</active></Mock>');

    //object with reference
    function Reference() {
      this.name = 'Dream';
      this.mock = new Mock();
    }
    opts.root = 'Reference';
    test.equals(simplexml.toXML(new Reference(), opts), 
      '<Reference><name>Dream</name><mock><name>Joe Don</name><age>12</age><score>1.3</score><active>true</active></mock></Reference>');

    // object with arrays
    function ArrObj(){
      this.planets = ['Mercury', 'Venus'];
      this.numbers = [1,2];
      this.arrayObjs = [new self.Obj('joe', 'king'), new self.Obj('ron', 'bon')];
      this.jsonArrays = [{'prop1': 'prop1value', 'prop2':'prop2value'}, {'prop1': 'prop1value2', 'prop2':'prop2value2'}];
    }
    opts.root = 'ArrObj';
    test.equals(simplexml.toXML(new ArrObj(), opts),
      '<ArrObj><planets><planet>Mercury</planet><planet>Venus</planet></planets><numbers><number>1</number><number>2</number></numbers><arrayObjs><arrayObj><fname>joe</fname><lname>king</lname></arrayObj><arrayObj><fname>ron</fname><lname>bon</lname></arrayObj></arrayObjs><jsonArrays><jsonArray><prop1>prop1value</prop1><prop2>prop2value</prop2></jsonArray><jsonArray><prop1>prop1value2</prop1><prop2>prop2value2</prop2></jsonArray></jsonArrays></ArrObj>');
    
    test.done();
  },

};
