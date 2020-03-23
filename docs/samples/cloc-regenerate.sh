#!/bin/bash
set -euo pipefail

cd "$(dirname "$0")/../.."
cloc --vcs=git --quiet --csv | sed '/^$/d' >docs/samples/cloc.csv
