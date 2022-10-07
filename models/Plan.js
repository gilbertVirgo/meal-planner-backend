const Model = require("../Model");
let id,
	recipes = [null, null, null, null, null, null, null];

module.exports = new Model("plans.json", { id, recipes });
