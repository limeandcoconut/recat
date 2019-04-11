#!/bin/bash

# Create dirs
mkdir -p ./images/brotli ./images/raw ./images/webp

# Output sample config/env files
echo "const dbUsername = 'useruser'
const dbPassword = 'passpasspass'
const dbName = 'db'
const encryptionKey = 'aEXACTLYthirtyTWOcharacterSTRING'

module.exports = {
    dbUsername,
    dbPassword,
    dbName,
    encryptionKey,
}" > ./config/keys.js

echo "POSTGRES_PASSWORD=passpasspass
POSTGRES_USER=useruser    
POSTGRES_DB=db" > ./config/db.env

# Read input into YN and allow for arrow key editing
read -e -p "Seed images? [Y/n] " YN

echo "
Change:
    config/db.env
    config/keys.js
    config/config.js
    config/meta

After creating docker containers initialize db with:
    node config/initdb.js
    - or -
    npm run init:db
"

# Exit if no seeding required
if [[ $YN != "y" && $YN != "Y" && $YN != "" ]]; then 
    return 1 2> /dev/null || exit 1
fi

# Prepare command for user to clean up the files created
cleancommand='rm '

# Write files and concat command
for i in 1 2 3 4 5
do
    echo iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII= |  base64 --decode > ./images/raw/$i.png
    echo UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vv9UAA= |  base64 --decode > ./images/webp/$i.png.webp
    echo cixWAUklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vv9UAAD |  base64 --decode > ./images/brotli/$i.png.webp.br
    cleancommand="$cleancommand $PWD/images/raw/$i.png $PWD/images/webp/$i.webp $PWD/images/brotli/$i.webp.br"
done

# Cross env copy to clipboard
if hash pbcopy 2>/dev/null; then
    echo -n $cleancommand | pbcopy
else
    echo -n $cleancommand xclip -selection c
fi

echo "Images have been seeded. To clean up, run:
    $cleancommand
    - or -
    npm run init:clean
    
The command has been copied to your clipboard.
"

