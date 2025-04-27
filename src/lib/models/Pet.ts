
import type { Pet } from '../types';

export class PetModel {
    private pet: Pet;

    constructor(pet: Pet) {
        this.pet = pet;
    }

    feed(): void {
        this.pet.hunger = Math.max(this.pet.hunger - 20, 0);
    }

    play(): void {
        this.pet.happiness = Math.min(this.pet.happiness + 30, 100);
    }

    returnToShop(): void {
        this.pet.owner = null;
    }

    adopt(newOwnerId: number): void {
        if (this.pet.owner !== null) {
            throw new Error('Pet already adopted');
        }
        this.pet.owner = newOwnerId;
    }
}