function clotho() {
  var identifier = 100000;
  var chance = require('chance')();
  var Person = require('./cdm/person');

  this.spin = function() {
    var person = new Person();
    person.personId = identifier++;
    person.genderConceptId = chance.weighted([8507, 8532], [0.55, 0.45]);
    person.yearOfBirth = 2001;
    return person;
  }
}

module.exports = new clotho();
