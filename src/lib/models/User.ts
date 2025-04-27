
import type { SafeUser, User } from '../types';

export class UserModel {
    private user: User;

    constructor(user: User) {
        this.user = user;
    }

    canAfford(cost: number): boolean {
        return this.user.budget >= cost;
    }

    buyItem(item: 'food' | 'toy' | 'treat', cost: number): void {
        if (!this.canAfford(cost)) {
            throw new Error('Insufficient funds');
        }
        this.user.budget -= cost;
        this.user.inventory[item] = (this.user.inventory[item] || 0) + 1;
    }

    useItem(item: 'food' | 'toy' | 'treat'): void {
        if (this.user.inventory[item] <= 0) {
            throw new Error(`No ${item} left`);
        }
        this.user.inventory[item] -= 1;
    }

    getSafeUser(): SafeUser {
        const { passwordHash, ...safeUser } = this.user;
        return safeUser;
    }
}