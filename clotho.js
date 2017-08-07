function Clotho() {
	let identifier = 100000;
	const chance = require('chance')();
	const Person = require('./cdm/person');

	this.spin = function (dataprint) {
		const person = new Person();
		person.personId = identifier++;
		const model = chance.weighted(dataprint.model, dataprint.risk);
		person.genderConceptId = model.genderConceptId;
		person.yearOfBirth = model.yearOfBirth;
		person.model = model;
		return person;
	};
}

module.exports = new Clotho();
