// src/routes/api/auth/login/+server.ts
import type { RequestHandler } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import path from 'path';
import fs from 'fs/promises';

const usersPath = path.resolve('static/data/users.json');

export const POST: RequestHandler = async ({ request }) => {
	const { name, password } = await request.json();

	try {
		const users = JSON.parse(await fs.readFile(usersPath, 'utf-8'));
		const user = users.find((u: any) => u.name === name);

		if (!user) {
			return new Response('User not found', { status: 404 });
		}

		const passwordMatch = await bcrypt.compare(password, user.passwordHash);

		if (!passwordMatch) {
			return new Response('Incorrect password', { status: 401 });
		}

		const { passwordHash, ...safeUser } = user;
		return new Response(JSON.stringify(safeUser), { status: 200 });
	} catch (err) {
		return new Response('Login failed', { status: 500 });
	}
};