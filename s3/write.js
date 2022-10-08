const fs = require("fs");
const s3 = require("./s3Object"),
	{ BUCKET_NAME } = process.env;

module.exports = async (localFile, key) => {
	const params = {
		Bucket: BUCKET_NAME,
		Key: key,
	};

	new Promise((resolve, reject) => {
		s3.deleteObject(params, function (err) {
			if (err) reject(err);

			console.log(`S3: Deleted file ${key}`);
		});

		s3.putObject({ Body: localFile, ...params }, function (err, data) {
			if (err) reject(err);

			console.log(`S3: Uploaded file ${key}`);
			resolve(data);
		});
	});
};
