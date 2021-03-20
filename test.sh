#!/bin/sh
param1=`tail -1 /home/scrap/app/test.log | awk '{print $1}'`
param2=`tail -1 /home/scrap/app/test.log | awk '{print $2}'`
param3=`tail -1 /home/scrap/app/test.log | awk '{print $3}'`
param4=`tail -1 /home/scrap/app/test.log | awk '{print $4}'`
param5=`tail -1 /home/scrap/app/test.log | awk '{print $5}'`
param6=`tail -1 /home/scrap/app/test.log | awk '{print $6}'`
param7=`tail -1 /home/scrap/app/test.log | awk '{print $7}'`
param8=`tail -1 /home/scrap/app/test.log | awk '{print $8}'`
DATE=`date +%Y%m%d-%H%M%S`

echo "$param1"
echo "$param2"
echo "$param3"
echo "$param4"
echo "$param5"
echo "$param6"
echo "$param7"
echo "$param8"
echo "$DATE"
