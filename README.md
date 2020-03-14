# twitter-trending

A Serverless app utilizing s3 and SendGrid used to send me the top twitter trends for the day.

## Local Setup

Install serverless globally:

`sudo npm install -g serverless`

## serverless.yml reference

https://serverless.com/framework/docs/providers/aws/guide/serverless.yml/

## common serverless dev commands

To test locally

`sls invoke local -f fetchTrendsAndStoreInS3`

To deploy and invoke remotely

`sls deploy`

`sls invoke -f fetchTrendsAndStoreInS3`

## Work in Progress as of January 2020
