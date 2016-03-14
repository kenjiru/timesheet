#!/bin/bash

git pull

npm set progress=false
npm install
./node_modules/.bin/tsd install

npm run debug