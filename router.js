const getPlanId = require("./scripts/getPlanId");
const Ingredient = require("./models/Ingredient");
const Recipe = require("./models/Recipe");

const { Router } = require("express");
const Plan = require("./models/Plan");
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

router.get("/plan", async (req, res, next) => {
	res.locals.data = await Plan.findOne(getPlanId(), {
		insertIfNotFound: true,
	});
	next();
});

router.get("/plan/recipes", async (req, res, next) => {
	const { recipes } = await Plan.findOne(getPlanId());
	res.locals.data = await Recipe.find(recipes);
	next();
});

router.get("/plan/ingredients", async (req, res, next) => {
	const plan = await Plan.findOne(getPlanId()),
		recipes = await Recipe.find(plan.recipes.filter((r) => !!r)),
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

router.patch("/plan", async ({ body: { id, recipes } }, res, next) => {
	await Plan.updateOne({ id: getPlanId(), id, recipes });
	res.locals.data = undefined;
	next();
});

module.exports = router;
