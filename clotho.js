function Clotho() {
	let identifier = 100000;
	const chance = require('chance')();
	const Person = require('./cdm/person');

	this.spin = function (dataprint) {
		const person = new Person();
		person.personId = identifier++;
		person.genderConceptId = chance.weighted([8507, 8532], [0.55, 0.45]);
		person.yearOfBirth = chance.weighted(dataprint.birthYear, dataprint.birthYearRisk);
		return person;
	};
}

module.exports = new Clotho();
