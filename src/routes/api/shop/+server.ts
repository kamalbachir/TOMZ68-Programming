// src/routes/api/shop/+server.ts
import type { RequestHandler } from '@sveltejs/kit';
import fs from 'fs/promises';
import path from 'path';
import { UserModel } from '$lib/models/User';

const usersPath = path.resolve('static/data/users.json');
const logPath = path.resolve('static/data/log.json');

const itemPrices = {
	food: 4,
	toy: 20,
	treat: 7
};

export const POST: RequestHandler = async ({ request }) => {
	const { item, userId } = await request.json();

	if (!(item in itemPrices)) {
		return new Response('Invalid item', { status: 400 });
	}

	const price = itemPrices[item as keyof typeof itemPrices];

	try {
		// Read users and logs
		const [usersData, logsData] = await Promise.all([
			fs.readFile(usersPath, 'utf-8'),
			fs.readFile(logPath, 'utf-8')
		]);

		const users = JSON.parse(usersData);
		const logs = JSON.parse(logsData);

		const userIndex = users.findIndex((u: any) => u.id === userId);

		if (userIndex === -1) {
			return new Response('User not found', { status: 404 });
		}

		const userModel = new UserModel(users[userIndex]);

		// Check if user has enough budget
		if (users[userIndex].budget < price) {
			return new Response('Not enough budget to buy this item', { status: 400 });
		}

		userModel.buyItem(item as 'food' | 'toy' | 'treat', price);

		// Log the purchase
		logs.unshift(`${users[userIndex].name} bought ${item} for $${price}`);

		// Save changes
		await Promise.all([
			fs.writeFile(usersPath, JSON.stringify(users, null, 2), 'utf-8'),
			fs.writeFile(logPath, JSON.stringify(logs, null, 2), 'utf-8')
		]);

		// Return the updated user info
		const { passwordHash, ...safeUser } = users[userIndex];
		return new Response(JSON.stringify({
			message: "Item purchased successfully",
			user: safeUser
		}), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (err) {
		console.error('Shop error:', err);
		const error = err as Error;
		return new Response(error.message, { status: 400 });
	}
};