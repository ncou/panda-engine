#!/bin/bash

echo "Publishing..."
git add .
git commit -a -m "Site update"
git push
echo "Done."