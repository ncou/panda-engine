#!/bin/bash

echo "Publishing..."
node updategists.js
git add .
git commit -a -m "Site update"
git push
echo "Done."