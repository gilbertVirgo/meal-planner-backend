import { findOne as __findOne, updateOne } from "./models/Plan";
import {
	find as _find,
	findOne as _findOne,
	insertOne as _insertOne,
} from "./models/Recipe";
import { find, findOne, insertOne } from "./models/Ingredient";

import { Router } from "express";

const router = Router();

router.get("/recipes", async (req, res, next) => {
	res.locals.data = await _find().catch(next);
	next();
});

router.get("/recipe/:id", async ({ params }, res, next) => {
	res.locals.data = await _findOne(params.id).catch(next);
	next();
});

router.get("/recipe/:id/ingredients", async ({ params }, res, next) => {
	const recipe = await _findOne(params.id).catch(next);
	res.locals.data = await find(recipe.ingredients.map(({ id }) => id));
	next();
});

router.put("/recipe", async ({ body }, res, next) => {
	await _insertOne(body);
	res.locals.data = undefined;
	next();
});

router.get("/ingredients", async (req, res, next) => {
	res.locals.data = await find().catch(next);
	next();
});

router.put("/ingredient", async ({ body }, res, next) => {
	await insertOne(body);
	res.locals.data = undefined;
	next();
});

router.get("/ingredient/:id", async ({ params }, res, next) => {
	res.locals.data = await findOne(params.id).catch(next);
	next();
});

const defaultPlanId = "the-plan";

router.get("/plan", async (req, res, next) => {
	res.locals.data = await __findOne(defaultPlanId);
	next();
});

router.get("/plan/recipes", async (req, res, next) => {
	const { recipes } = await __findOne(defaultPlanId);
	res.locals.data = await _find(recipes);
	next();
});

router.get("/plan/ingredients", async (req, res, next) => {
	const plan = await __findOne(defaultPlanId),
		recipes = await _find(plan.recipes.filter((r) => !!r)),
		ingredientIds = [
			...new Set(
				recipes
					.map(({ ingredients }) => ingredients.map(({ id }) => id))
					.flat(1)
			),
		];

	res.locals.data = await find(ingredientIds);
	next();
});

router.get("/plan/checklist", async (req, res, next) => {
	const plan = await __findOne(defaultPlanId),
		recipes = await _find(plan.recipes.filter((r) => !!r));

	res.locals.data = (function cleanIngredientsAndSortQuantities(dirty) {
		const clean = [],
			final = [];

		dirty.forEach(({ title, id, amount, unit }) => {
			const ingredientIndex = clean.findIndex((i) => i.id === id);

			if (ingredientIndex === -1)
				clean.push({ id, title, dirtyQuantities: [{ amount, unit }] });
			else clean[ingredientIndex].dirtyQuantities.push({ amount, unit });
		});

		clean.forEach(({ dirtyQuantities, ...props }) => {
			const cleanQuantities = [];

			dirtyQuantities.forEach(({ unit, amount }) => {
				const quantityIndex = cleanQuantity.findIndex(
					(q) => q.unit === unit
				);

				if (quantityIndex === -1)
					cleanQuantities.push({ amount, unit });
				else {
					cleanQuantities[quantityIndex].amount =
						parseInt(cleanQuantities[quantityIndex].amount) +
						amount;
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
	await updateOne({ id: defaultPlanId, recipes });
	res.locals.data = undefined;
	next();
});

export default router;
