/** @type {import('./$types').PageServerLoad} */
export async function load({ locals, cookies }) {
	/** @type {Record<string, string>} */
	const allCookies = {};
	cookies.getAll().forEach((cookie) => {
		allCookies[cookie.name] = cookie.value.substring(0, 20) + '...';
	});

	return {
		serverAuth: {
			isAuthenticated: locals.isAuthenticated,
			user: locals.user,
			authToken: locals.authToken ? locals.authToken.substring(0, 20) + '...' : null
		},
		serverCookies: allCookies
	};
}
