var async = require('async');
var fs = require('fs');
var path = require('path');
var tilde = require("tilde-expansion");
var config = require("./config");

exports.usage = "<repo>";
exports.shortHelp = "Changes working directory to <progDir>/<repo>";
exports.longHelp = "\
Aliases: open, go\n\
\n\
Changes working directory to <progDir>/<repo>\n\
";

function handle(args) {
	if (args.length !== 1) throw "Wrong arguments (Try: prog help open)";
	var pathKey;
	var repo;
	var splitArg = args[0].split('/');
	if (splitArg.length === 1) {
		pathKey = null;
		repo = splitArg[0];
	} else if (splitArg.length === 2) {
		pathKey = splitArg[0];
		repo = splitArg[1];
	} else {
		throw "Too many /-es in argument (Try: prog help open)";
	}

	var targetCwdFile = process.env["PROG_TARGET_CWD_FILE"];
	if (!targetCwdFile) {
		process.stderr.write("ERROR: Cannot change working directory");
		process.stderr.write("Try adding the following to your ~/.profile and start a new shell:");
		process.stderr.write(". prog.sh");
		process.exit(1);
	}

	config.getConfig(function (config) {
		var unresolvedPaths = config.get("paths");
		var keys = [];
		if (pathKey) {
			keys.push(pathKey);
			if (!unresolvedPaths.hasOwnProperty(pathKey)) {
				process.stderr.write("Unknown path key: " + pathKey);
				process.exit(1);
			}
		} else {
			for (var key in unresolvedPaths) {
				if (unresolvedPaths.hasOwnProperty(key)) keys.push(key);
			}
		}

		var paths = async.map(keys, function (key, callback) {
			tilde(unresolvedPaths[key], function (resolvedPath) {
				callback(null, resolvedPath);
			});
		}, function (err, pathsList) {
			var paths = {};
			keys.forEach(function (key, index) { paths[key] = pathsList[index]; });
			async.filter(keys, function (key, callback) {
				fs.stat(path.join(paths[key], repo), function (err, stats) {
					if (err) callback(false);
					else callback(stats.isDirectory());
				});
			}, function (candidates) {
				if (candidates.length === 0) {
					process.stderr.write("Not found\n");
					process.exit(1);
				} else if (candidates.length > 1) {
					process.stderr.write("Ambiguous project. Candidates:\n");
					candidates.forEach(function (candidate) {
						process.stderr.write(" * " + candidate + "/" + repo + "\n");
					});
					process.exit(1);
				} else {
					fs.writeFile(targetCwdFile, path.join(paths[candidates[0]], repo));
				}
			});
		});
	});
}

function complete(args) {
	if (args.length !== 1) return;

	var candidate = args[0];

	config.getConfig(function (config) {
		if (!config.has("paths", "default")) return;

		tilde(config.get("paths", "default"), function (progDir) {
			fs.readdir(progDir, function (err, files) {
				if (err) return;
				console.log(files.filter(function (file) { return file.indexOf(candidate) === 0; }).join('\n'));
			});
		});
	});
}

exports.handle = handle;
exports.complete = complete;
