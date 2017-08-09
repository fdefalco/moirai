function Atropos() {
	// Leverage prediction model to assign mortality
	const cdm = require('omop-cdm');
	this.shear = function (person) {
		const death = new cdm.Death();
		death.personId = person.personId;
		death.deathDate = person.model.observationPeriod.observationPeriodEndDate;
		return death;
	};
}

module.exports = new Atropos();
