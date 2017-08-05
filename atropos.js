function Atropos() {
	// Leverage prediction model to assign mortality
	const Death = require('./cdm/death');
	this.shear = function (person) {
		const death = new Death();
		death.personId = person.personId;
		return death;
	};
}

module.exports = new Atropos();
