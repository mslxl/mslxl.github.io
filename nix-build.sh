#!/usr/bin/env bash

if ! command -v nix &>/dev/null; then
  echo "Opps! nix-command could not be found"
  exit 1
fi

if [[ "$PROJ_NIX_ENV" -ne "1" ]]; then
  echo "Enter devshell environment..."
  nix develop --command "$0" "$@"
  exit
fi

pnpm install
echo "Build with playwright browser $PLAYWRIGHT_BROWSERS_PATH"
pnpm build
