function lachesis() {
  var ObservationPeriod = require('./cdm/observationPeriod');
  var VisitOccurrence = require('./cdm/visitOccurrence');
  var observationPeriodId = 10000;
  var visitOccurrenceId = 10000;

  this.measure = function(person) {
    var observationPeriod = new ObservationPeriod();
    observationPeriod.observationPeriodId = observationPeriodId++;
    observationPeriod.personId = person.personId;
    return observationPeriod;
  };

  this.apportionVisits = function(person, observationPeriod) {
    // return drug exposures, condition occurrences, procedure occurrences, etc...
    var visitOccurrence = new VisitOccurrence();
    visitOccurrence.personId = person.personId;
    visitOccurrence.visitOccurrenceId = visitOccurrenceId++;
    return visitOccurrence;
  }
};

module.exports = new lachesis();
