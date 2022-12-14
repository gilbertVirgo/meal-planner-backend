// I really just made my own mongo-js. Cry face.

import generateID from "./generateID.js";
import { promises } from "fs";
import s3 from "./s3.js";

export default function Model(fileName, frame) {
	const dataPath = `./data/${fileName}`;

	// Optional array of ids
	this.find = async (ids) => {
		const nodes = JSON.parse(await promises.readFile(dataPath));

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

		const patch = JSON.stringify([...nodes, newNode]);

		await promises.writeFile(dataPath, patch, "utf-8").catch((err) => {
			throw new Error(`Could not create new node. ${err}`);
		});

		await s3.write(patch, fileName);

		return newNode;
	};

	this.updateOne = async (updatedProps) => {
		const { id } = updatedProps,
			nodes = await this.find(),
			node = nodes.find((n) => n.id === id);

		Object.keys(updatedProps).forEach(
			(key) => (node[key] = updatedProps[key])
		);

		const patch = JSON.stringify(
			nodes.map((n) => (n.id === id ? node : n))
		);

		// Replace
		await promises.writeFile(dataPath, patch, "utf-8").catch((err) => {
			throw new Error(`Could not update node. ${err}`);
		});

		await s3.write(patch, fileName);
	};

	this.updateMany = async (updatedPropsArray) => {
		const nodes = await this.find(),
			updatedNodes = [];

		updatedPropsArray.forEach((updatedProps) => {
			const { id } = updatedProps,
				node = nodes.find((n) => n.id === id);

			Object.keys(updatedProps).forEach(
				(key) => (node[key] = updatedProps[key])
			);

			updatedNodes.push(node);
		});

		const patch = JSON.stringify(
			nodes.map((n) => {
				const updatedNode = updatedNodes.find((u) => u.id === n.id);
				return updatedNode || n;
			})
		);

		await promises.writeFile(dataPath, patch, "utf-8").catch((err) => {
			throw new Error(`Could not update node. ${err}`);
		});

		await s3.write(patch, fileName);
	};
}
