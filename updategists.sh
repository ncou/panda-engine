#!/bin/bash

node updategists.js
git add .
git commit -a -m 'Gist update'
git push
