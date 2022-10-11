import Model from "../Model.js";
let id,
	recipes = Array(7).fill(null);

export default new Model("plan.json", { id, recipes });
