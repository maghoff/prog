#!/usr/bin/env node

var args = process.argv.slice(2);

if (args.length < 1) {
	console.log("Usage: prog <verb> [...]");
	console.log("Try: prog help");
	process.exit(1);
}

var verb = args[0];

try {
	var verbModule = require("./" + verb);
	verbModule.handle(args.slice(1));
}
catch (e) {
	console.log(e);
	process.exit(1);
}
