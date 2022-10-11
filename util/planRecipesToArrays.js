import Plan from "../models/Plan.js";

(async function () {
	const { recipes, ...plan } = await Plan.findOne("the-plan");

	const patch = { ...plan, recipes: recipes.map((r) => (r ? [r] : [])) };

	// console.log(JSON.stringify(patch));

	await Plan.updateOne(patch);

	console.log("Done", patch);
})();
