if (!fs.existsSync(baseURL)) {
	console.log("/data does not exist");
	await fs.mkdirSync("data");
	console.log("Created /data");
}

for (const title of ["ingredients", "plan", "recipes"]) {
	const fileURL = `${baseURL}/${title}.json`;

	if (!fs.existsSync(fileURL) || fs.readFileSync(fileURL, "utf-8") === "") {
		console.log("File does not exist or is empty:", fileURL);

		fs.writeFileSync(
			fileURL,
			title === "plan"
				? `[{"id": "the-plan", "recipes": ${JSON.stringify(
						Array(7).fill(null)
				  )}}]`
				: "[]"
		);

		console.log("Created and/or populated file:", fileURL);
	}
}
