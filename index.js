require("dotenv").config();
const express = require("express");
const loadBackupFromAWS = require("./loadBackupFromAWS");
const router = require("./router");
const app = express();
app.use(express.json());
app.use(require("cors")());

app.use(router);
app.use((req, res, next) => {
	res.status(200).json({
		success: true,
		data: res.locals.data,
	});
});
app.use((err, req, res, next) => {
	res.status(500).json({
		success: false,
		message: err,
	});
});

(async function start() {
	await loadBackupFromAWS();

	const { PORT } = process.env;
	app.listen(PORT, () => console.log(`Server started on ${PORT}`));
})();
