#!/bin/sh

echo -e "$USER\n$EMAIL\n$PASS" | yarn login --registry="https://registry.npmjs.org"
