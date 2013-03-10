var verbs = require('./verbs');

exports.usage = "[verb]";
exports.shortHelp = "Display help about verbs, or this text";
exports.longHelp = "\
Without verb-argument: Displays global help\n\
\n\
With verb-argument: Displays help about verb\n\
";

function generateGlobalHelpString() {
	var lines = [];
	var usageWidth = 0;

	verbs.verbs.forEach(function (verbName) {
		var verb = verbs.req(verbName);
		var line = {
			"usage": verbName + " " + verb.usage,
			"short": verb.shortHelp
		};
		lines.push(line);
		usageWidth = Math.max(usageWidth, line.usage.length);
	});

	function spaces(n) { return new Array(n+1).join(" "); }

	var formattedLines = lines.map(function (line) {
		return " " + line.usage + spaces(usageWidth - line.usage.length) + "  " + line.short;
	});

	return "Prog\n\nList of verbs:\n" + formattedLines.join('\n');
}

function generateVerbHelpString(verbName) {
	if (!verbs.has(verbName)) {
		return "Unknown verb: " + verbName + "\nTry: prog help";
	}

	var verb = verbs.req(verbName);

	return "Prog: " + verbName + "\n\nUsage: prog " + verb.usage + "\n\n" + verb.longHelp;
}

function handle(args) {
	if (args.length === 0) console.log(generateGlobalHelpString());
	else if (args.length === 1) console.log(generateVerbHelpString(args[0]));
	else console.log(generateVerbHelpString("help"));
}

exports.handle = handle;
