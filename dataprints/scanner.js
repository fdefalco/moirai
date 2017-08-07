function Scanner() {
	// Scanner provides a layer of abstraction from the dataprint file and
	// possible changes it requires.

	this.parse = function (dataprint) {
		const data = require(dataprint);
		const parsed = {};
		parsed.risk = data.profiles.map(d => {
			return d.risk;
		});
		parsed.model = data.profiles.map(d => {
			return {
				yearOfBirth: d.yearOfBirth,
				genderConceptId: d.genderConceptId,
				meanObservationPeriod: d.meanObservationPeriod,
				sdObservationPeriodDays: d.sdObservationPeriodDays,
				meanDaysToFirstObservation: d.meanDaysToFirstObservation,
				sdDaysToFirstObservation: d.sdDaysToFirstObservation
			};
		});
		return parsed;
	};
}

module.exports = new Scanner();
