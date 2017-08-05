#!/usr/bin/env node

const fs = require('fs');
const commander = require('commander');
const progress = require('cli-progress');
const csv = require('csv');
const durations = require('durations');

const clotho = require('./clotho.js');
const lachesis = require('./lachesis.js');
const atropos = require('./atropos.js');

commander
	.version('0.1.0')
	.option('--personCount [100]', 'specify how many people default [100]', 100)
	.parse(process.argv);

const stopwatch = durations.stopwatch();
stopwatch.start();

const maxBatchLength = 1000;
const personBatch = [];
const observationPeriodBatch = [];
const deathBatch = [];
const visitOccurrenceBatch = [];

const outputFolder = 'simulations/';

// Configure the data assets we're generating so we don't have to repeat code sections
const dataAssets = [{
	filename: 'observationPeriod.csv',
	data: observationPeriodBatch
}, {
	filename: 'person.csv',
	data: personBatch
}, {
	filename: 'death.csv',
	data: deathBatch
}, {
	filename: 'visitOccurrence.csv',
	data: visitOccurrenceBatch
}];

// Perhaps warn about overwriting files and add an option to overwrite --overwrite
dataAssets.forEach(d => {
	if (fs.existsSync(outputFolder + d.filename)) {
		fs.unlinkSync(outputFolder + d.filename);
	}
});

const progressbar = new progress.Bar({
	format: 'simulating [{bar}] {percentage}% | {value}/{total}'
}, progress.Presets.shades_classic);
progressbar.start(commander.personCount, 0);

for (let p = 0; p < commander.personCount; p++) {
	const person = clotho.spin();
	personBatch.push(person);

	const observationPeriod = lachesis.measure(person);
	observationPeriodBatch.push(observationPeriod);

	const visitOccurrence = lachesis.apportionVisits(person);
	visitOccurrenceBatch.push(visitOccurrence);

	const death = atropos.shear(person, null);
	deathBatch.push(death);

	progressbar.update(p);
	if (personBatch.length === maxBatchLength || p === commander.personCount - 1) {
		dataAssets.forEach(d => {
			csv.stringify(d.data, {
				header: true
			}, (err, data) => {
				if (err) {
					console.log(err);
				}
				fs.appendFileSync(outputFolder + d.filename, data);
				d.data = [];
			});
		});
	}
}

progressbar.update(commander.personCount);
progressbar.stop();

stopwatch.stop();
const duration = stopwatch.duration();

console.log('simulation complete: ' + duration.format());
