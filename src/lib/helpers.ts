
import { PetModel } from './models/Pet';
import { UserModel } from './models/User';
import type { Pet, User } from './types';

export function canAfford(user: User, cost: number): boolean {
    return new UserModel(user).canAfford(cost);
}

export function feedPet(pet: Pet): void {
    new PetModel(pet).feed();
}

export function toyPet(pet: Pet): void {
    new PetModel(pet).play();
}

export function returnPet(pet: Pet): void {
    new PetModel(pet).returnToShop();
}