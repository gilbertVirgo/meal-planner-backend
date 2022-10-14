import { fileURLToPath } from "url";
import fs from "fs";
import path from "path";
import s3 from "./s3.js";
import trash from "trash";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseDir = "./data";

export default async () => {
	const baseURL = path.resolve(__dirname, "data");

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
