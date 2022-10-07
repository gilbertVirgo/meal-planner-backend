const Model = require("../Model");

let title, ingredients;

module.exports = new Model("recipes.json", { title, ingredients });
