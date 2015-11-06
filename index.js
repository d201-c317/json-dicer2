#! /usr/bin/env node
var program = require('commander');
var fs = require('fs');
var _ = require('underscore');
var start = new Date();


program
  .version('1.0.0')
  .option('-e, --entries <n>', 'How Many Entries in a single file?', 10)
  .option('-p, --pretty', 'Pretty Formatted JSON in the outputs', false)
  .option('-m, --metadata', 'Generate Metadata', false)
  .arguments('<cmd>')
  .action(function (cmd) {
    cmdValue = cmd;
  });

program.parse(process.argv);

/**
 * File Reader
 * @param callback   Result Exported For Downstream Processing
 */
function readfile(callback) {
  fs.readFile(cmdValue, 'utf8', function (err, data) {
    if (err) {
      callback && callback(err);
    } else {
      var dir = './output';
      if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
      }
      callback && callback(data);
    }
  });
}

/**
 * Upstream Result Parser
 * @param entry     Callback From readfile()
 * @param callback  Result Exported For Downstream Processing
 */
function parseFile(entry, callback) {
  if (JSON.parse(JSON.stringify(entry)).errno) {
    console.error(JSON.parse(JSON.stringify(entry)).code);
    process.exit(1);
  } else {
    var data = JSON.parse(entry);

    var purified = _.filter(data, function(d){ return d.lemma.match(/^[a-zA-Z]+$/); });

    callback && callback(purified);
  }
}

/**
 * Write Outputs
 * @param entry     Callback From Upstream
 * @param callback  Result Exported For Downstream Processing
 */
function writeFile(entry, callback) {
  var jsonSrc = entry;
  console.log('Number of Entries: ' + jsonSrc.length);
  console.log('It can be diced into: ' + Math.ceil(Number(jsonSrc.length) / Number(program.entries)) + ' Files');
  var first = 0;
  var last = Number(program.entries);
  var cnt = 1;
  var out = {};
  for (first; first + Number(program.entries) < jsonSrc.length;) {
    for (last; last < jsonSrc.length; last = last + Number(program.entries), first = first + Number(program.entries), cnt++) {
      if (first == 0) {
        out = jsonSrc.slice(first, last);
      } else {
        out = jsonSrc.slice(first + 1, last);
      }
      if (program.pretty == true) {
        fs.writeFile('./output/' + cnt + '.json', JSON.stringify(out, null, 2), 'utf8', null);
      } else {
        fs.writeFile('./output/' + cnt + '.json', JSON.stringify(out), 'utf8', null);
      }
    }
    out = jsonSrc.slice(first, jsonSrc.length);
    if (program.pretty == true) {
      fs.writeFile('./output/' + cnt + '.json', JSON.stringify(out, null, 2), 'utf8', null);
    } else {
      fs.writeFile('./output/' + cnt + '.json', JSON.stringify(out), 'utf8', null);
    }
  }
  callback && callback(cnt);
}

/**
 * Main Runtime
 */
readfile(function (result) {
  parseFile(result, function (parsed) {
    writeFile(parsed, function (callback) {
      var end = new Date() - start;
      console.info(callback + " Files Generated");
      console.info("Execution time: %dms", end);
      if (program.metadata == true) {
        var metadata = {
          pages: callback
        };
        fs.writeFile('./output/metadata.json', JSON.stringify(metadata, null, 2), 'utf8', null);
      }
    });
  });
});

