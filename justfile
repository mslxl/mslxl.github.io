serve-open:
	just open
	just serve

open:
	#!/usr/bin/env nix-shell
	#! nix-shell -p fzy -p fd -i bash

	cur=$(pwd)
	markdown=$(fd -g "*.md" $cur/source/_posts/ | sort | fzy)
	if [[ "$markdown" != "" ]]; then
		nohup typora $markdown 2>&1 >/dev/null &
	fi
serve:
	pnpm serve
