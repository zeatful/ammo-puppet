#!/bin/bash

echo "Cronjob initiated!" >> ammo.log

printenv >> ammo.log

node -v >> ammo.log

echo "Cronjob finished!" >> ammo.log
