import "dotenv/config.js";

import S3RW from "s3-read-write";
const { AWS_ID, AWS_SECRET, BUCKET_NAME } = process.env;


export default new S3RW({
	accessKeyId: AWS_ID,
	secretAccessKey: AWS_SECRET,
	Bucket: BUCKET_NAME,
});
