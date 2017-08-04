#!/usr/bin/env node

var commander = require('commander');
var progress = require('cli-progress');
var csv = require('csv');
var fs = require('fs');
var durations = require('durations');

var clotho = require('./clotho.js');
var lachesis = require('./lachesis.js');
var atropos = require('./atropos.js');

commander
  .version('0.1.0')
  .option('--personCount [100]', 'specify how many people default [100]', 100)
  .parse(process.argv);

var stopwatch = durations.stopwatch();
stopwatch.start();

var maxBatchLength = 1000;
var personBatch = [],
  observationPeriodBatch = [],
  deathBatch = [],
  visitOccurrenceBatch = [];

// configure the data assets we're generating so we don't have to repeat code sections
var dataAssets = [{
  "filename": "observationPeriod.csv",
  "data": observationPeriodBatch
}, {
  "filename": "person.csv",
  "data": personBatch
}, {
  "filename": "death.csv",
  "data": deathBatch
}, {
  "filename": "visitOccurrence.csv",
  "data": visitOccurrenceBatch
}];

// perhaps warn about overwriting files and add an option to overwrite --overwrite
dataAssets.forEach(function(d) {
  if (fs.existsSync(d.filename)) {
    fs.unlinkSync(d.filename);
  }
})

var progressbar = new progress.Bar({
  format: 'simulating [{bar}] {percentage}% | {value}/{total}'
}, progress.Presets.shades_classic);
progressbar.start(commander.personCount, 0);

for (var p = 0; p < commander.personCount; p++) {
  var person = clotho.spin(person);
  personBatch.push(person);

  var observationPeriod = lachesis.measure(person);
  observationPeriodBatch.push(observationPeriod);

  var visitOccurrence = lachesis.apportionVisits(person);
  visitOccurrenceBatch.push(visitOccurrence);

  var death = atropos.shear(person, null);
  deathBatch.push(death);

  progressbar.update(p);
  if (personBatch.length == maxBatchLength || p == commander.personCount - 1) {
    dataAssets.forEach(function(d) {
      csv.stringify(d.data, {
        header: true
      }, function(err, data) {
        fs.appendFileSync(d.filename, data);
        d.data = [];
      });
    });
  }
}

progressbar.update(commander.personCount);
progressbar.stop();

stopwatch.stop();
var duration = stopwatch.duration();

console.log('simulation complete: ' + duration.format());
