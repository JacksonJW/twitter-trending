# twitter-trending

A Serverless app utilizing s3 and SendGrid used to send me the top twitter trends for the day.

## Local Setup

Install serverless globally:

`sudo npm install -g serverless`

## common serverless dev commands

To test functions locally

`sls invoke local -f fetchTrendsAndStoreInS3`

To deploy and invoke remotely

`sls deploy`

`sls invoke -f fetchTrendsAndStoreInS3`

## serverless.yml reference

https://serverless.com/framework/docs/providers/aws/guide/serverless.yml/

## Work in Progress as of January 2020
