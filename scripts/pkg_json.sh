#!/usr/bin/env bash

original_hash=$(./$(dirname "$0")/convert_pkg_json.sh)

# clean up files on exit
_cleanup() {
  ./"$(dirname "$0")"/unconvert_pkg_json.sh "$original_hash"
}
trap "_cleanup" EXIT;

# run command passed to script
$@;
