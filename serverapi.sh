#!/bin/sh


case "$1" in
    start)
        nohup node serverapi.js > /tmp/serverapi.log 2>&1 & echo $! > /tmp/serverapi.pid
        ;;
    stop) 
        kill `cat /tmp/serverapi.pid`
        ;;
    esac

