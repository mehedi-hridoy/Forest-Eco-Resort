#!/bin/zsh
set -e
cd "${0:A:h}"
BUNDLED_NODE="/Users/radin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin"
if [[ -x "$BUNDLED_NODE/node" ]]; then export PATH="$BUNDLED_NODE:$PATH"; fi
if ! command -v node >/dev/null; then print 'Install Node.js 22 or newer first.'; read; exit 1; fi
if [[ ! -d node_modules ]]; then print 'Run pnpm install, database setup and pnpm build as described in README.md.'; read; exit 1; fi
print 'Forest Eco Resort: http://127.0.0.1:3000'
print 'Administration: http://127.0.0.1:3000/admin'
print 'Keep this window open. Press Control-C to stop.'
node node_modules/concurrently/dist/bin/concurrently.js -k 'node dist-server/server/index.js' 'node node_modules/next/dist/bin/next start --hostname 127.0.0.1'
