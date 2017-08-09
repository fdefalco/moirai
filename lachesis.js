function Lachesis() {
	const cdm = require('omop-cdm');
	const moment = require('moment');
	const chance = require('chance')();

	let observationPeriodId = 10000;
	let visitOccurrenceId = 10000;

	this.measure = function (person) {
		const observationPeriod = new cdm.ObservationPeriod();
		observationPeriod.observationPeriodId = observationPeriodId++;
		const momentBirth = moment([person.model.yearOfBirth]);
		const daysFromBirth = Math.max(0,chance.normal({
			mean: person.model.meanDaysToFirstObservation,
			dev: person.model.sdDaysToFirstObservation
		}));
		const daysInObservationPeriod = Math.max(0,chance.normal({
			mean: person.model.meanObservationPeriodDays,
			dev: person.model.sdObservationPeriodDays
		}));
		momentBirth.add(daysFromBirth, 'd');
		observationPeriod.observationPeriodStartDate = momentBirth.format('YYYY-MM-DD');
		momentBirth.add(daysInObservationPeriod, 'd');
		observationPeriod.observationPeriodEndDate = momentBirth.format('YYYY-MM-DD');
		observationPeriod.personId = person.personId;
		person.model.observationPeriod = observationPeriod;
		return observationPeriod;
	};

	// Return drug exposures, condition occurrences, procedure occurrences, etc...
	this.apportionVisits = function (person) {
		const visitOccurrence = new cdm.VisitOccurrence();
		visitOccurrence.personId = person.personId;
		visitOccurrence.visitOccurrenceId = visitOccurrenceId++;
		visitOccurrence.visitStartDate = person.model.observationPeriod.observationPeriodStartDate;
		visitOccurrence.visitEndDate = person.model.observationPeriod.observationPeriodStartDate;
		return visitOccurrence;
	};
}

module.exports = new Lachesis();
