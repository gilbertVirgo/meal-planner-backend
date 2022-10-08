const s3 = require("./s3Object"),
	{ BUCKET_NAME } = process.env;

module.exports = (fileName) =>
	new Promise((resolve, reject) => {
		s3.getObject(
			{
				Key: fileName,
				Bucket: BUCKET_NAME,
			},
			function (err, data) {
				if (err) reject(err);

				console.log(`S3: Read file ${fileName}`);

				const buffer = Buffer.from(data.Body, "utf-8"),
					string = buffer.toString();
				resolve(string);
			}
		);
	});
