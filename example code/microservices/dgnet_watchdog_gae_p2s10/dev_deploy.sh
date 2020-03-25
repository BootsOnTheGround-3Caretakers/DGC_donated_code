#!/bin/bash

./build.sh
gcloud -q --project=dev-watchdog-user-interface app deploy app.yaml --version 1 3>> upload_log.txt
