function prog() {
	export PROG_TARGET_CWD_FILE=/tmp/.prog_target_cwd.XXXXXX.tmp
	prog.js $*

	if [ -f "$PROG_TARGET_CWD_FILE" ]
	then
		PROG_TARGET_CWD=$(cat "$PROG_TARGET_CWD_FILE")
		rm "$PROG_TARGET_CWD_FILE"
		cd "$PROG_TARGET_CWD"
	fi
}
