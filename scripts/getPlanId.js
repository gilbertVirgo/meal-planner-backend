const { DateTime } = require("luxon");

module.exports = () => {
	const { weekNumber, year } = DateTime.local();

	return `${year}-${weekNumber}`;
};
