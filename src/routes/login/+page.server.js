import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
	// If user is already authenticated, redirect them
	if (locals.isAuthenticated) {
		// Check if email is verified
		if (locals.user && !locals.user.email_verified) {
			redirect(307, '/email-verify');
		} else {
			redirect(307, '/dashboard');
		}
	}

	// Return empty object if not authenticated
	return {};
}
