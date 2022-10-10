const fs = require("fs");
const s3 = require("s3-read-write");

const baseDir = "./data";

module.exports = async () => {
	const baseURL = "./data";

	if (fs.existsSync(baseURL))
		return console.log("Cancelled backup, since ./data exists.");

	await fs.promises.mkdir(baseDir);

	for (const file of ["plan", "recipes", "ingredients"]) {
		const fileName = `${file}.json`;

		const contents = await s3.read(fileName);

		await fs.promises.writeFile(
			`${baseURL}/${fileName}`,
			contents,
			"utf-8"
		);
	}
};
