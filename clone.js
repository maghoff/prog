var spawn = require('child_process').spawn;
var tilde = require('tilde-expansion');
var config = require("./config");

var helpString = "\
Clone\n\
\n\
Usage: prog clone [<user>/]<repos>\n\
\n\
Will clone the bitbucket repository named <repos> owned by <user>. If <user>\n\
is not specified, it defaults to the current user configured.\n\
";

function handle(args) {
	if (args.length !== 1) throw "Wrong arguments";

	config.getConfig(function (config) {
		var arg = args[0].split('/');
		var user, repo;
		if (arg.length === 1) {
			user = config.get("bitbucket", "user");
			repo = arg[0];
		} else if (arg.length === 2) {
			user = arg[0];
			repo = arg[1];
		} else {
			throw "Too many '/'-es in repo spec";
		}

		var progDirConfig = config.get("local", "progDir");

		tilde(progDirConfig, function (progDir) {
			var url = "ssh://hg@bitbucket.org/" + user + "/" + repo;

		    var hg = spawn('hg', ['clone', url], { cwd: progDir });

			hg.stdout.on('data', function (data) { console.log(data); });
			hg.stderr.on('data', function (data) { console.log(data); });
			hg.on('exit', function (code) {
				console.log('hg process exited with code ' + code);
			});
		});
	});
}

exports.handle = handle;
exports.helpString = helpString;
