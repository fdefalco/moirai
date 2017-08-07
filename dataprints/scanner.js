function Scanner() {
	// Scanner provides a layer of abstraction from the dataprint file and
	// possible changes it requires.

	this.parse = function (dataprint) {
		const data = require(dataprint);
		const parsed = {};
		parsed.birthYear = data.ageDist.map(d => {
			return d.yearOfBirth;
		});
		parsed.birthYearRisk = data.ageDist.map(d => {
			return d.risk;
		});
		parsed.seed = data.ageDist.map(d => {
			return {
				meanObservationPeriod: d.meanObservationPeriod,
				sdObservationPeriodDays: d.sdObservationPeriodDays
			};
		});
		return parsed;
	};
}

module.exports = new Scanner();
