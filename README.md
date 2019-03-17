# pgdump-to-alioss

A tool to dump postgres database everyday and upload to ali OSS service.

## How to use
1. build docker image
   
   ```docker build -t db_dump .```
2. Start the docker container

   ```docker run  -v /etc/localtime:/etc/localtime:ro -d db_dump --OSS_REGION=oss-xx-xxxx --OSS_ACCESS_KEY_ID=xxxxxxxxx --OSS_ACCESS_KEY_SECRET=xxxxxxxxx --OSS_BUCKET=xxxxxxxxx --SCHEDULER='0 0 3 * * *' --DB_HOST=xxx.xxx.xxx.xx --DB_PORT=5432 --DB_USERNAME=postgres --DB_PASSWORD=xxxx --DB_DATABASE=xxxx```

   Parameters:
   ```
   --OSS_REGION=oss-xx-xxxx
   --OSS_ACCESS_KEY_ID=xxxxxxxxx
   --OSS_ACCESS_KEY_SECRET=xxxxxxxxx
   --OSS_BUCKET=xxxxxxxxx
   --SCHEDULER='0 0 3 * * *' //run at 3:00 AM everyday
   --DB_HOST=xxx.xxx.xxx.xx
   --DB_PORT=5432
   --DB_USERNAME=postgres
   --DB_PASSWORD=xxxx
   --DB_DATABASE=xxxx
   ```
