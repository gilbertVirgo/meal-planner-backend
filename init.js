const fs = require("fs");

const init = async () => {
	const baseURL = "./data";

	for (const title of ["ingredients", "plan", "recipes"]) {
		const fileURL = `${baseURL}/${title}.json`;

		if (
			!fs.existsSync(fileURL) ||
			fs.readFileSync(fileURL, "utf-8") === ""
		) {
			console.log("File does not exist or is empty:", fileURL);
			fs.writeFileSync(fileURL, "[]");
			console.log("Created and/or populated file:", fileURL);
		}
	}
};

(async function () {
	await init();
})();

module.exports = init;
