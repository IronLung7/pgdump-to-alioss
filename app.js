'use strict';
var schedule = require('node-schedule');
var spawn = require('child_process').spawn;
let OSS = require('ali-oss');
var fs=require('fs');
const args = require('minimist')(process.argv.slice(2))

let OSS_REGION = args['OSS_REGION']
let OSS_ACCESS_KEY_ID = args['OSS_ACCESS_KEY_ID']
let OSS_ACCESS_KEY_SECRET = args['OSS_ACCESS_KEY_SECRET']
let OSS_BUCKET = args['OSS_BUCKET']
let SCHEDULER = args['SCHEDULER']
let DB_HOST = args['DB_HOST']
let DB_PORT = args['DB_PORT']
let DB_USERNAME = args['DB_USERNAME']
let DB_PASSWORD = args['DB_PASSWORD']
let DB_DATABASE = args['DB_DATABASE']

let client = new OSS({
  region: OSS_REGION,
  accessKeyId: OSS_ACCESS_KEY_ID,
  accessKeySecret: OSS_ACCESS_KEY_SECRET,
  bucket: OSS_BUCKET
});

const options = {
    partSize: 10000 * 1024,//设置分片大小
    timeout: 1200000,//设置超时时间
};

schedule.scheduleJob(SCHEDULER, function(){
	var newDate = new Date();
	var dateString = newDate.toISOString();
	var ls = spawn( 'pg_dump', 
			[`--file=./${dateString}`, `--host=${DB_HOST}`, `--port=${DB_PORT}`, `--username=${DB_USERNAME}`, '-w', '--verbose', '--format=t', '--blobs', '--section=pre-data', '--section=data', '--section=post-data', DB_DATABASE], 
			{ env: {PGPASSWORD: DB_PASSWORD}}
		);
	try{
		ls.stdout.on( 'data', data => {
			console.log( `stdout: ${data}` );
		} );

		ls.stderr.on( 'data', data => {
			console.log( `${data}` );
		} );

		ls.on( 'close', code => {
			console.log( `child process exited with code ${code}` );
			console.log( `uploading the file ${dateString}` );

			client.multipartUpload(dateString, `./${dateString}`, options).then((res) => {
				console.log('upload success: %j', res);
					fs.unlink(`./${dateString}`,function(error){
						if(error){
							console.log(error);
							return false;
						}
						console.log('delte file successfully');
					})
			  }).catch((err) => {
				console.error(err);
			  });
		} );

		ls.on('error', function(err) {
			console.log('Oh noez, teh errurz: ' + err);
		});
		
		ls.on('data', function(data) {
			console.log('' + data);
		});
	}catch(err){
		console.log("exception: "+err)
	}
});

