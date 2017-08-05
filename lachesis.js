function Lachesis() {
	const ObservationPeriod = require('./cdm/observationPeriod');
	const VisitOccurrence = require('./cdm/visitOccurrence');
	let observationPeriodId = 10000;
	let visitOccurrenceId = 10000;

	this.measure = function (person) {
		const observationPeriod = new ObservationPeriod();
		observationPeriod.observationPeriodId = observationPeriodId++;
		observationPeriod.personId = person.personId;
		return observationPeriod;
	};

	// Return drug exposures, condition occurrences, procedure occurrences, etc...
	this.apportionVisits = function (person) {
		const visitOccurrence = new VisitOccurrence();
		visitOccurrence.personId = person.personId;
		visitOccurrence.visitOccurrenceId = visitOccurrenceId++;
		return visitOccurrence;
	};
}

module.exports = new Lachesis();
