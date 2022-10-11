import "dotenv/config.js";

import express, { json } from "express";

import cors from "cors";
import loadBackupFromAWS from "./loadBackupFromAWS.js";
import router from "./router.js";

const app = express();
app.use(json());
app.use(cors());

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
