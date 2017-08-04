// todo - leverage prediction model to assign mortality

function atropos() {
  var Death = require('./cdm/death');
  this.shear = function(person, records) {
    var death = new Death();
    death.personId = person.personId;
    return death;
  }
}

module.exports = new atropos();
