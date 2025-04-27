import type { RequestHandler } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import path from 'path';
import fs from 'fs/promises';

const usersPath = path.resolve('static/data/users.json');

export const POST: RequestHandler = async ({ request }) => {
	const { name, email, password } = await request.json();

	// Validate that all required fields are present
	if (!name || !password) {
		return new Response('Name and password are required', { status: 400 });
	}

	try {
		const users = JSON.parse(await fs.readFile(usersPath, 'utf-8'));

		if (users.find((user: any) => user.name === name)) {
			return new Response('Username already exists', { status: 400 });
		}

		const passwordHash = await bcrypt.hash(password, 10);
		const newUser = {
			name,
			email, // Add email to the user object
			passwordHash,
			id: Date.now(),
			budget: 100,
			inventory: { food: 0, toy: 0, treat: 0 },
			isAdmin: false // Add isAdmin flag as we discussed earlier
		};

		users.push(newUser);
		await fs.writeFile(usersPath, JSON.stringify(users, null, 2), 'utf-8');

		const { passwordHash: _, ...safeUser } = newUser;
		return new Response(JSON.stringify(safeUser), { status: 201 });
	} catch (err) {
		console.error('Registration error:', err);
		return new Response('Registration failed', { status: 500 });
	}
};