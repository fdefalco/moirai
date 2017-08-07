function Lachesis() {
	const ObservationPeriod = require('./cdm/observation-period');
	const VisitOccurrence = require('./cdm/visit-occurrence');
	const moment = require('moment');
	const chance = require('chance')();

	let observationPeriodId = 10000;
	let visitOccurrenceId = 10000;

	this.measure = function (person) {
		const observationPeriod = new ObservationPeriod();
		observationPeriod.observationPeriodId = observationPeriodId++;
		const momentBirth = moment([person.model.yearOfBirth]);
		const daysFromBirth = chance.normal({
			mean: person.model.meanDaysToFirstObservation,
			dev: person.model.sdDaysToFirstObservation
		});
		const daysInObservationPeriod = chance.normal({
			mean: person.model.meanObservationPeriodDays,
			dev: person.model.sdObservationPeriodDays
		});
		momentBirth.add(daysFromBirth, 'd');
		observationPeriod.observationPeriodStartDate = momentBirth.format('YYYY-MM-DD');
		momentBirth.add(daysInObservationPeriod, 'd');
		observationPeriod.observationPeriodEndDate = momentBirth.format('YYYY-MM-DD');
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
