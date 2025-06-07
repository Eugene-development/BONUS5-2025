// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			isAuthenticated: boolean;
			authToken?: string;
			user?: {
				id: number;
				name: string;
				email: string;
				email_verified: boolean;
				email_verified_at: string | null;
				city?: string;
				created_at?: string;
				updated_at?: string;
			} | null;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
