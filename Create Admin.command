#!/bin/zsh
set -e
cd "${0:A:h}"
BUNDLED_NODE="/Users/radin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin"
if [[ -x "$BUNDLED_NODE/node" ]]; then export PATH="$BUNDLED_NODE:$PATH"; fi
read 'ADMIN_EMAIL?Administrator email: '
read -s 'ADMIN_PASSWORD?Choose a password (at least 14 characters): '
print ''
export ADMIN_EMAIL ADMIN_PASSWORD
node node_modules/tsx/dist/cli.mjs scripts/create-admin.ts
unset ADMIN_PASSWORD ADMIN_EMAIL
print 'Press Enter to close.'
read
