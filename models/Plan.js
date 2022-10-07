const Model = require("../Model");
let id,
	recipes = Array(7).fill(null);

module.exports = new Model("plan.json", { id, recipes });
