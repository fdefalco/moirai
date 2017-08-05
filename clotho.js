function Clotho() {
	let identifier = 100000;
	const chance = require('chance')();
	const Person = require('./cdm/person');

	this.spin = function () {
		const person = new Person();
		person.personId = identifier++;
		person.genderConceptId = chance.weighted([8507, 8532], [0.55, 0.45]);
		person.yearOfBirth = 2001;
		return person;
	};
}

module.exports = new Clotho();
