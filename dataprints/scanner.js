function Scanner() {
	// Scanner provides a layer of abstraction from the dataprint file and
	// possible changes it requires.

	this.parse = function (dataprintName) {
		const fs = require('fs');
		const csvData = fs.readFileSync(dataprintName + '.csv', 'utf8');
		const lines = csvData.split('\n');
		const data = [];
		const properties = lines[0].split(',');
		for (let l = 1; l < lines.length; l++) {
			const record = {};
			const columns = lines[l].split(',');
			if (columns.length !== properties.length) {
				console.log('skipping line in csv: ' + lines[l]);
				continue;
			}
			for (let c = 0; c < columns.length; c++) {
				record[properties[c]] = columns[c];
			}
			data.push(record);
		}

		const parsed = {};
		parsed.risk = data.map(d => {
			return Number(d.risk);
		});
		parsed.model = data.map(d => {
			return {
				yearOfBirth: Number(d.yearOfBirth),
				genderConceptId: Number(d.genderConceptId),
				meanObservationPeriodDays: Number(d.meanObservationPeriodDays),
				sdObservationPeriodDays: Number(d.sdObservationPeriodDays),
				meanDaysToFirstObservation: Number(d.meanDaysToFirstObservation),
				sdDaysToFirstObservation: Number(d.sdDaysToFirstObservation)
			};
		});
		return parsed;
	};
}

module.exports = new Scanner();
