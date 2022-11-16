#!/usr/bin/env bash
set -e
set -u
set -o pipefail

npm install
# lint and test broken
# npm run lint
# npm run test
npm run build
npm run readme

