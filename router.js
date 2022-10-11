import Ingredient from "./models/Ingredient.js";
import Plan from "./models/Plan.js";
import Recipe from "./models/Recipe.js";
import { Router } from "express";

const router = Router();

router.get("/recipes", async (req, res, next) => {
	res.locals.data = await Recipe.find().catch(next);
	next();
});

router.get("/recipe/:id", async ({ params }, res, next) => {
	res.locals.data = await Recipe.findOne(params.id).catch(next);
	next();
});

router.get("/recipe/:id/ingredients", async ({ params }, res, next) => {
	const recipe = await Recipe.findOne(params.id).catch(next);
	res.locals.data = await Ingredient.find(
		recipe.ingredients.map(({ id }) => id)
	);
	next();
});

router.put("/recipe", async ({ body }, res, next) => {
	await Recipe.insertOne(body);
	res.locals.data = undefined;
	next();
});

router.get("/ingredients", async (req, res, next) => {
	res.locals.data = await Ingredient.find().catch(next);
	next();
});

router.put("/ingredient", async ({ body }, res, next) => {
	await Ingredient.insertOne(body);
	res.locals.data = undefined;
	next();
});

router.get("/ingredient/:id", async ({ params }, res, next) => {
	res.locals.data = await Ingredient.findOne(params.id).catch(next);
	next();
});

const defaultPlanId = "the-plan";

router.get("/plan", async (req, res, next) => {
	res.locals.data = await Plan.findOne(defaultPlanId);
	next();
});

router.get("/plan/recipes", async (req, res, next) => {
	const { recipes } = await Plan.findOne(defaultPlanId);
	res.locals.data = await Recipe.find(recipes.flat(1));
	next();
});

router.get("/plan/ingredients", async (req, res, next) => {
	const plan = await Plan.findOne(defaultPlanId),
		recipes = await Recipe.find(plan.recipes.flat(1)),
		ingredientIds = [
			...new Set(
				recipes
					.map(({ ingredients }) => ingredients.map(({ id }) => id))
					.flat(1)
			),
		];

	res.locals.data = await Ingredient.find(ingredientIds);
	next();
});

router.get("/plan/checklist", async (req, res, next) => {
	const plan = await Plan.findOne(defaultPlanId),
		recipes = await Recipe.find(plan.recipes.flat(1));

	res.locals.data = (function cleanIngredientsAndSortQuantities(dirty) {
		const clean = [],
			final = [];

		console.log({ dirty });

		dirty.forEach(({ title, id, amount, unit }) => {
			const ingredientIndex = clean.findIndex((i) => i.id === id);

			if (ingredientIndex === -1)
				clean.push({ id, title, dirtyQuantities: [{ amount, unit }] });
			else clean[ingredientIndex].dirtyQuantities.push({ amount, unit });
		});

		clean.forEach(({ dirtyQuantities, ...props }) => {
			const cleanQuantities = [];

			dirtyQuantities.forEach(({ unit, amount }) => {
				const quantityIndex = cleanQuantities.findIndex(
					(q) => q.unit === unit
				);

				if (quantityIndex === -1)
					cleanQuantities.push({ amount, unit });
				else {
					cleanQuantities[quantityIndex].amount =
						parseInt(cleanQuantities[quantityIndex].amount) +
						parseInt(amount);
				}
			});

			const quantityString = cleanQuantities
				.map(({ amount, unit }) => {
					return `${amount} ${unit !== 1 ? unit : unit + "s"}`;
				})
				.join(", ");

			final.push({ quantity: quantityString, ...props });
		});

		return final;
	})(recipes.map(({ ingredients }) => ingredients).flat(1));

	next();
});

router.patch("/plan", async ({ body: { recipes } }, res, next) => {
	await Plan.updateOne({ id: defaultPlanId, recipes });
	res.locals.data = undefined;
	next();
});

export default router;
