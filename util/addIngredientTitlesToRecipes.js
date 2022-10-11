import Ingredient from "../models/Ingredient.js";
import Recipe from "../models/Recipe.js";

(async function () {
	const allRecipes = await Recipe.find(),
		allIngredients = await Ingredient.find();

	const patch = allRecipes.map(({ ingredients, ...r }) => {
		return {
			...r,
			ingredients: ingredients.map((i) => ({
				...i,
				title: allIngredients.find((j) => j.id === i.id).title,
			})),
		};
	});

	Recipe.updateMany(patch);
})();
