const AWS = require("aws-sdk");

const { AWS_ID, AWS_SECRET, BUCKET_NAME } = process.env;

module.exports = new AWS.S3({
	accessKeyId: AWS_ID,
	secretAccessKey: AWS_SECRET,
	Bucket: BUCKET_NAME,
});
