#!/usr/bin/env bash

# calculate hashes
original_hash=${1:-$(printf "$(cat _package.json5 | json5)\n" | sha256sum | awk '{print $1}')};
current_hash=$(sha256sum package.json | awk '{print $1}');

if [ \"$original_hash\" = \"$current_hash\" ]; then
  rm package.json;
else
  echo "Warning: package.json was modified during script execution. Not deleting." >&2;
fi;

mv _package.json5 package.json5;
