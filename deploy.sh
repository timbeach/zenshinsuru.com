#!/bin/sh
rsync -vhrla --exclude .git/ --exclude pdf/ --exclude saints/ --exclude pix/ --exclude mp3/ --exclude CLAUDE.md --exclude .claude/ $PWD/ vultr:/var/www/zenshinsuru.com

