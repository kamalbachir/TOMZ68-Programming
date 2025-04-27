import { writable } from 'svelte/store';
import type { SafeUser } from './types';

// It's holding the user
export const currentUser = writable<SafeUser | null>(null);
