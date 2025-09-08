#!/usr/bin/env bash

# json5 can't have a broken package.json in the way
rm package.json 2> /dev/null
# convert package.json5 to json
package=$(json5 package.json5);
# write json to package.json
echo "$package" > package.json;
original_hash=$(sha256sum package.json | awk '{print $1}');
# move package.json5 to ensure pnpm doesn't look at it
mv package.json5 _package.json5;

# return original package.json hash
echo "$original_hash"
