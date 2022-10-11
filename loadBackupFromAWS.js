import fs from "fs";
import path from "path";
import s3 from "./s3";
import trash from "trash";

const baseDir = "./data";

module.exports = async () => {
	const baseURL = path.resolve(__dirname, "data");

	// if (fs.existsSync(baseURL))
	// 	return console.log("Cancelled backup, since ./data exists.");

	await trash(baseDir);
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
