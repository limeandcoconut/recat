#!/bin/bash
rm ./init/images/raw/.gitkeep
mv ./init/* ./
rm -rf ./init
rm init.sh
echo -e "\nChange:\n    db.sample.env\n    keys.sample.js\n    rm init.sh"
