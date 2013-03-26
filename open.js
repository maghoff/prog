var fs = require('fs');
var tilde = require("tilde-expansion");
var config = require('./config');
var ProjectPath = require('./project-path').ProjectPath;

exports.usage = "<repo>";
exports.shortHelp = "Changes working directory to <progDir>/<repo>";
exports.longHelp = "\
Aliases: open, go\n\
\n\
Changes working directory to <progDir>/<repo>\n\
";

function handle(args) {
	if (args.length !== 1) throw "Wrong arguments (Try: prog help open)";
	var projectPath = new ProjectPath(args[0]);

	var targetCwdFile = process.env["PROG_TARGET_CWD_FILE"];
	if (!targetCwdFile) {
		process.stderr.write("ERROR: Cannot change working directory\n");
		process.stderr.write("Try adding the following to your ~/.profile and start a new shell:\n");
		process.stderr.write(". prog.sh\n");
		process.exit(1);
	}

	projectPath.resolve(function (err, resolvedPaths) {
		if (err) {
			process.stderr.write(err + "\n");
			process.exit(1);
		}

		if (resolvedPaths.length === 0) {
			process.stderr.write("Not found\n");
			process.exit(1);
		} else if (resolvedPaths.length > 1) {
			process.stderr.write("Ambiguous project. Candidates:\n");
			resolvedPaths.forEach(function (candidate) {
				process.stderr.write(" * " + candidate.pathKey + "/" + candidate.repo + "\n");
			});
			process.exit(1);
		}

		fs.writeFile(targetCwdFile, resolvedPaths[0].fullPath);
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
