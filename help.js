var defaultHelpString = "\
Prog\n\
\n\
List of verbs:\n\
\n\
	help 	Display help about verbs, or this text\n\
	clone	Clone a repository from bitbucket\n\
";

var helpString = "\
Help\n\
\n\
Usage: prog help [verb]\n\
\n\
Without verb-argument: Displays global help\n\
\n\
With verb-argument: Displays help about verb\n\
"

function handle(args) {
	if (args.length === 0) console.log(defaultHelpString);
	else if (args.length === 1) console.log(require("./"+args[0]).helpString);
	else console.log(helpString);
}

exports.handle = handle;
exports.helpString = helpString;
