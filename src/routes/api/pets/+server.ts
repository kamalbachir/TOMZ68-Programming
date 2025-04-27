import type { RequestHandler } from '@sveltejs/kit';
import path from 'path';
import fs from 'fs/promises';

const petsPath = path.resolve('static/data/pets.json');
const usersPath = path.resolve('static/data/users.json');

// get Pet
export const GET: RequestHandler = async ({ url }) => {
	const type = url.searchParams.get('type');
	try {
		const pets = JSON.parse(await fs.readFile(petsPath, 'utf-8'));
		const filteredPets = type ? pets.filter((pet: any) => pet.type === type) : pets;
		return new Response(JSON.stringify(filteredPets), { status: 200 });
	} catch (err) {
		return new Response('Failed to read pets.', { status: 500 });
	}
};

// add new pet
export const POST: RequestHandler = async ({ request }) => {
	const newPet = await request.json();
	try {
		const pets = JSON.parse(await fs.readFile(petsPath, 'utf-8'));
		pets.push(newPet);
		await fs.writeFile(petsPath, JSON.stringify(pets, null, 2), 'utf-8');
		return new Response("Pet added successfully", { status: 200 });
	} catch (err) {
		return new Response('Failed to add pet.', { status: 500 });
	}
};
