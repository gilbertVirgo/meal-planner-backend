// I really just made my own mongo-js. Cry face.

const generateID = require("./generateID");
const fs = require("fs").promises;

module.exports = function Model(fileName, frame) {
	const dataPath = `./data/${fileName}`;

	// Optional array of ids
	this.find = async (ids) => {
		const nodes = JSON.parse(await fs.readFile(dataPath));

		if (ids === undefined) return nodes;

		return nodes.filter((n) => ids.includes(n.id));
	};

	this.findOne = async (id, options = {}) => {
		const nodes = await this.find();
		let node = nodes.find((r) => r.id === id);

		if (!node) {
			if (!options.insertIfNotFound)
				throw new Error(`No node with the id '${id}' exists.`);

			node = await this.insertOne({ id });
		}

		return node;
	};

	this.insertOne = async (node) => {
		const nodes = await this.find(),
			newNode = { id: generateID() };

		Object.keys(frame).forEach(
			(key) => (newNode[key] = node[key] || frame[key])
		);

		const patch = [...nodes, newNode];

		await fs
			.writeFile(dataPath, JSON.stringify(patch), "utf-8")
			.catch((err) => {
				throw new Error(`Could not create new node. ${err}`);
			});

		return newNode;
	};

	this.updateOne = async (updatedProps) => {
		const { id } = updatedProps,
			nodes = await this.find(),
			node = await this.findOne(id);

		Object.keys(updatedProps).forEach(
			(key) => (node[key] = updatedProps[key])
		);

		const patch = nodes.map((n) => (n.id === id ? node : n));

		// Replace
		await fs
			.writeFile(dataPath, JSON.stringify(patch), "utf-8")
			.catch((err) => {
				throw new Error(`Could not update node. ${err}`);
			});
	};
};
