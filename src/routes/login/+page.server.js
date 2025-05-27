import { fail } from '@sveltejs/kit';

/** @type {import('./$types').Actions} */
export const actions = {
	/**
	 * Default login action
	 * @param {import('@sveltejs/kit').RequestEvent} event
	 */
	default: async ({ request, cookies }) => {
		const formData = await request.formData();

		const email = formData.get('email');
		const password = formData.get('password');
		const rememberMe = formData.get('remember-me') === 'on';

		// Basic validation
		if (!email) {
			return fail(400, {
				email,
				rememberMe,
				error: true,
				message: 'Email обязателен'
			});
		}

		if (!password) {
			return fail(400, {
				email,
				rememberMe,
				error: true,
				message: 'Пароль обязателен'
			});
		}

		try {
			// TODO: Replace with actual authentication API call
			// This is just a simulation for now
			if (email === 'test@example.com' && password === 'password') {
				// For a real implementation with Sanctum:
				// 1. Get CSRF cookie
				// const csrfCookie = await fetch('/sanctum/csrf-cookie');

				// 2. Send login request
				// const response = await fetch('/api/login', {
				//   method: 'POST',
				//   headers: {
				//     'Content-Type': 'application/json',
				//     'Accept': 'application/json',
				//     'X-XSRF-TOKEN': getCookie(cookies, 'XSRF-TOKEN')
				//   },
				//   body: JSON.stringify({ email, password, remember: rememberMe }),
				//   credentials: 'include'
				// });

				// 3. Check response and return result
				// if (!response.ok) {
				//   const data = await response.json();
				//   return fail(response.status, {
				//     email,
				//     rememberMe,
				//     error: true,
				//     message: data.message || 'Ошибка авторизации'
				//   });
				// }

				// Success simulation
				return {
					success: true,
					user: {
						email,
						name: 'Test User'
					}
				};
			}

			// Simulate authentication failure
			return fail(401, {
				email,
				rememberMe,
				error: true,
				message: 'Неверный email или пароль'
			});
		} catch (error) {
			console.error('Login error:', error);

			return fail(500, {
				email,
				rememberMe,
				error: true,
				message: 'Произошла ошибка при входе'
			});
		}
	}
};

/**
 * Helper function to get cookie from request
 * @param {import('@sveltejs/kit').Cookies} cookies
 * @param {string} name
 */
function getCookie(cookies, name) {
	return cookies.get(name);
}
