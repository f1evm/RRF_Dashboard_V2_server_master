#!/bin/sh


case "$1" in
    start)
        nohup node server.js > /tmp/dashboard_TEST.log 2>&1 & echo $! > /tmp/dashboard_TEST.pid
        ;;
    stop) 
        kill `cat /tmp/dashboard_TEST.pid`
        ;;
    esac

