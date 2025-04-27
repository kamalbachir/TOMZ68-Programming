export interface Pet {
	id: number;
	name: string;
	type: string;  // 'puppy' or 'kitten'
	hunger: number;
	happiness: number;
	adoptionStatus: boolean;
	owner: number | null;
}

export interface User {
	id: number;
	name: string;
	passwordHash: string;
	budget: number;
	isAdmin: boolean;
	inventory: {
		food: number;
		toy: number;
		treat: number;
	};
}

export type SafeUser = Omit<User, 'passwordHash'>;
