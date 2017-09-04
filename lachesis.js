function Lachesis() {
	const cdm = require('omop-cdm');
	const moment = require('moment');
	const chance = require('chance')();
	const visitItemSets = require('./dataprints/visitItemSets');

	let observationPeriodId = 10000;
	let visitOccurrenceId = 10000;
	let drugExposureId = 10000;
	let conditionOccurrenceId = 10000;
	let procedureOccurrenceId = 10000;
	let observationId = 10000;

	const visitItems = visitItemSets.map(d => {
		return d.items;
	});

	const visitItemWeights = visitItemSets.map(d => {
		return d.support;
	});

	this.measure = function (person) {
		const observationPeriod = new cdm.ObservationPeriod();
		observationPeriod.observationPeriodId = observationPeriodId++;
		const momentBirth = moment([person.model.yearOfBirth]);
		const daysFromBirth = Math.max(0, chance.normal({
			mean: person.model.meanDaysToFirstObservation,
			dev: person.model.sdDaysToFirstObservation
		}));
		const daysInObservationPeriod = Math.max(0, chance.normal({
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

		visitOccurrence.data = {};
		visitOccurrence.data.drugExposures = [];
		visitOccurrence.data.procedureOccurrences = [];
		visitOccurrence.data.conditionOccurrences = [];
		visitOccurrence.data.observations = [];

		const model = chance.weighted(visitItems, visitItemWeights);

		const items = model.split(',');
		for (let i = 0; i < items.length; i++) {
			const itemDetails = items[i].split('-');
			switch (itemDetails[0]) {
				case 'procedure':
					{
						const procedureOccurrence = new cdm.ProcedureOccurrence();
						procedureOccurrence.personId = person.personId;
						procedureOccurrence.procedureOccurrenceId = procedureOccurrenceId++;
						procedureOccurrence.procedureConceptId = itemDetails[1];
						procedureOccurrence.procedureDate = visitOccurrence.visitStartDate;
						procedureOccurrence.visitOccurrenceId = visitOccurrence.visitOccurrenceId;
						visitOccurrence.data.procedureOccurrences.push(procedureOccurrence);
						break;
					}
				case 'condition':
					{
						const conditionOccurrence = new cdm.ConditionOccurrence();
						conditionOccurrence.personId = person.personId;
						conditionOccurrence.conditionOccurrenceId = conditionOccurrenceId++;
						conditionOccurrence.conditionConceptId = itemDetails[1];
						conditionOccurrence.conditionStartDate = visitOccurrence.visitStartDate;
						conditionOccurrence.visitOccurrenceId = visitOccurrence.visitOccurrenceId;
						visitOccurrence.data.conditionOccurrences.push(conditionOccurrence);
						break;
					}
				case 'drug':
					{
						const drugExposure = new cdm.DrugExposure();
						drugExposure.personId = person.personId;
						drugExposure.drugExposureId = drugExposureId++;
						drugExposure.drugConceptId = itemDetails[1];
						drugExposure.drugExposureStartDate = visitOccurrence.visitStartDate;
						drugExposure.visitOccurrenceId = visitOccurrence.visitOccurrenceId;
						visitOccurrence.data.drugExposures.push(drugExposure);
						break;
					}
				case 'observation':
					{
						const observation = new cdm.Observation();
						observation.observationId = observationId++;
						observation.personId = person.personId;
						observation.observationConceptId = itemDetails[1];
						observation.observationDate = visitOccurrence.visitStartDate;
						observation.visitOccurrenceId = visitOccurrence.visitOccurrenceId;
						visitOccurrence.data.observations.push(observation);
						break;
					}
				default:
					{
						console.log('unexpected visit item ' + itemDetails[0]);
						break;
					}
			}
		}

		return visitOccurrence;
	};
}

module.exports = new Lachesis();
