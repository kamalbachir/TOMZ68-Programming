// src/routes/api/adopt/+server.ts
import type { RequestHandler } from '@sveltejs/kit';
import path from 'path';
import fs from 'fs/promises';
import { PetModel } from '$lib/models/Pet';

const petsPath = path.resolve('static/data/pets.json');
const usersPath = path.resolve('static/data/users.json');
const logPath = path.resolve('static/data/log.json');

export const POST: RequestHandler = async ({ request }) => {
	const { userId, petId } = await request.json();

	try {
		const [petsData, usersData, logsData] = await Promise.all([
			fs.readFile(petsPath, 'utf-8'),
			fs.readFile(usersPath, 'utf-8'),
			fs.readFile(logPath, 'utf-8')
		]);

		const pets = JSON.parse(petsData);
		const users = JSON.parse(usersData);
		const logs = JSON.parse(logsData);

		const petIndex = pets.findIndex((p: any) => p.id === petId);
		const user = users.find((u: any) => u.id === userId);

		if (petIndex === -1 || !user) {
			return new Response('User or pet not found', { status: 404 });
		}

		if (pets[petIndex].owner !== null) {
			return new Response('This pet is already adopted', { status: 400 });
		}

		// Create PetModel instance and adopt
		const petModel = new PetModel(pets[petIndex]);
		petModel.adopt(userId);

		// Update the pet in the pets array directly
		// Since PetModel modifies the original object, we can just set the owner directly
		pets[petIndex].owner = userId;

		// Log the adoption
		logs.unshift(`${user.name} adopted ${pets[petIndex].name}`);

		// Make sure user has pets array
		if (!user.pets) user.pets = [];
		user.pets.push(petId);

		await Promise.all([
			fs.writeFile(petsPath, JSON.stringify(pets, null, 2)),
			fs.writeFile(usersPath, JSON.stringify(users, null, 2)),
			fs.writeFile(logPath, JSON.stringify(logs, null, 2))
		]);

		return new Response(JSON.stringify({ message: 'Pet adopted successfully' }), {
			status: 200,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	} catch (err) {
		const error = err as Error;
		console.error('Error adopting pet:', error);
		return new Response(error.message, { status: 400 });
	}
};