import type { RequestHandler } from '@sveltejs/kit';
import path from 'path';
import fs from 'fs/promises';
import { UserModel } from '$lib/models/User';
import { PetModel } from '$lib/models/Pet';

const usersPath = path.resolve('static/data/users.json');
const petsPath = path.resolve('static/data/pets.json');
const logPath = path.resolve('static/data/log.json');

export const POST: RequestHandler = async ({ request }) => {
	const { userId, petId, action } = await request.json();

	try {
		const [usersData, petsData, logsData] = await Promise.all([
			fs.readFile(usersPath, 'utf-8'),
			fs.readFile(petsPath, 'utf-8'),
			fs.readFile(logPath, 'utf-8')
		]);

		const users = JSON.parse(usersData);
		const pets = JSON.parse(petsData);
		const logs = JSON.parse(logsData);

		const userIndex = users.findIndex((u: any) => u.id === userId);
		const petIndex = pets.findIndex((p: any) => p.id === petId);

		if (userIndex === -1 || petIndex === -1) {
			return new Response('User or pet not found', { status: 404 });
		}

		const userModel = new UserModel(users[userIndex]);
		const petModel = new PetModel(pets[petIndex]);

		switch (action) {
			case 'feed':
				userModel.useItem('food');
				petModel.feed();
				logs.unshift(`${users[userIndex].name} fed ${pets[petIndex].name}`);
				break;
			case 'toy':
				userModel.useItem('toy');
				petModel.play();
				logs.unshift(`${users[userIndex].name} played with ${pets[petIndex].name}`);
				break;
			case 'return':
				petModel.returnToShop();
				logs.unshift(`${users[userIndex].name} returned ${pets[petIndex].name}`);
				break;
			default:
				return new Response('Invalid action', { status: 400 });
		}

		await Promise.all([
			fs.writeFile(usersPath, JSON.stringify(users, null, 2)),
			fs.writeFile(petsPath, JSON.stringify(pets, null, 2)),
			fs.writeFile(logPath, JSON.stringify(logs, null, 2))
		]);

		return new Response(JSON.stringify({ message: 'Action completed successfully' }), { status: 200 });
	} catch (error) {
		const err = error as Error;
		return new Response(err.message, { status: 400 });
	}
};