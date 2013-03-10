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
	var repo = args[0];

	var targetCwdFile = process.env["PROG_TARGET_CWD_FILE"];
	if (targetCwdFile) {
		config.getConfig(function (config) {
			tilde(config.get("local", "progDir"), function (progDir) {
				fs.writeFile(targetCwdFile, path.join(progDir, repo));
			});
		});
	} else {
		process.stderr.write("ERROR: Cannot change working directory");
		process.stderr.write("Try adding the following to your ~/.profile and start a new shell:");
		process.stderr.write(". prog.sh");
	}
}

function complete(args) {
	if (args.length !== 1) return;

	var candidate = args[0];

	config.getConfig(function (config) {
		if (!config.has("local", "progDir")) return;

		tilde(config.get("local", "progDir"), function (progDir) {
			fs.readdir(progDir, function (err, files) {
				if (err) return;
				console.log(files.filter(function (file) { return file.indexOf(candidate) === 0; }).join('\n'));
			});
		});
	});
}

exports.handle = handle;
exports.complete = complete;
