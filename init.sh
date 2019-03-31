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
}" > keys.js

echo "POSTGRES_PASSWORD=passpasspass
POSTGRES_USER=useruser    
POSTGRES_DB=db" > db.env

# Read input into YN and allow for arrow key editing
read -e -p "Seed images? [Y/n] " YN

echo "
Change:
    db.env
    keys.js
"

# Exit if no seeding required
if [[ $YN != "y" && $YN != "Y" ]]; then 
    return 1 2> /dev/null || exit 1
fi

# Prepare command for user to clean up the files created
cleancommand='rm '

# Write files and concat command
for i in 1 2 3 4 5
do
    base64 -D -o ./images/webp/$i.webp <<< UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vv9UAA= 
    base64 -D -o ./images/brotli/$i.webp.br <<< cixWAUklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vv9UAAD 
    cleancommand="$cleancommand $PWD/images/webp/$i.webp $PWD/images/brotli/$i.webp.br"
done

# Cross env copy to clipboard
if hash pbcopy 2>/dev/null; then
    echo -n $cleancommand | pbcopy
else
    echo -n $cleancommand xclip -selection c
fi

echo "Images have been seeded. To clean up, run:
    $cleancommand
    
The command has been copied to your clipboard.
"
