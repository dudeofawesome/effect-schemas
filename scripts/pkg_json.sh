#!/usr/bin/env bash

# convert package.json5 to json
package=$(json5 package.json5);
# write json to package.json
echo "$package" > package.json;
original_hash=$(sha256sum package.json | awk '{print $1}');
# move package.json5 to ensure pnpm doesn't look at it
mv package.json5 _package.json5;

# clean up files on exit
_cleanup() {
  current_hash=$(sha256sum package.json | awk '{print $1}');
  if [ \"$original_hash\" = \"$current_hash\" ]; then
    rm package.json;
  else
    echo "Warning: package.json was modified during script execution. Not deleting." >&2;
  fi;
  mv _package.json5 package.json5;
}
trap "_cleanup" EXIT;

# run command passed to script
$@;
