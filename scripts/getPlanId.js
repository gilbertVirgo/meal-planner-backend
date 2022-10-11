import { DateTime } from "luxon";

export default () => {
	const { weekNumber, year } = DateTime.local();

	return `${year}-${weekNumber}`;
};
