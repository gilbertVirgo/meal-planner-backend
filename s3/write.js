const fs = require("fs");
const s3 = require("./s3Object"),
	{ BUCKET_NAME } = process.env;

module.exports = async (localFile, key) => {
	const params = {
		Bucket: BUCKET_NAME,
		Key: key,
	};

	new Promise(async (resA, rejA) => {
		await new Promise((resB) => {
			s3.deleteObject(params, function (err) {
				if (err) rejA(err);

				console.log(`S3: Deleted file ${key}`);
				resB();
			});
		});

		s3.putObject({ Body: localFile, ...params }, function (err, data) {
			if (err) return rejA(err);

			console.log(`S3: Uploaded file ${key}`);
			resA(data);
		});
	});
};
