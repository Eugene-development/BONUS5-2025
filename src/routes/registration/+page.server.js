import { fail } from '@sveltejs/kit';

/** @type {import('./$types').Actions} */
export const actions = {
	/**
	 * Default registration action
	 * @param {import('@sveltejs/kit').RequestEvent} event
	 */
	default: async ({ request, cookies }) => {
		const formData = await request.formData();

		const firstName = formData.get('first-name');
		const city = formData.get('city');
		const email = formData.get('email');
		const password = formData.get('password');
		const passwordConfirm = formData.get('password-confirm');
		const termsAccepted = formData.get('terms') === 'on';

		// Basic validation
		if (!firstName) {
			return fail(400, {
				firstName,
				city,
				email,
				error: true,
				message: 'Имя обязательно'
			});
		}

		if (!city) {
			return fail(400, {
				firstName,
				city,
				email,
				error: true,
				message: 'Город обязателен'
			});
		}

		if (!email) {
			return fail(400, {
				firstName,
				city,
				email,
				error: true,
				message: 'Email обязателен'
			});
		}

		if (!password) {
			return fail(400, {
				firstName,
				city,
				email,
				error: true,
				message: 'Пароль обязателен'
			});
		}

		if (String(password).length < 8) {
			return fail(400, {
				firstName,
				city,
				email,
				error: true,
				message: 'Пароль должен содержать минимум 8 символов'
			});
		}

		if (!passwordConfirm) {
			return fail(400, {
				firstName,
				city,
				email,
				error: true,
				message: 'Подтверждение пароля обязательно'
			});
		}

		if (password !== passwordConfirm) {
			return fail(400, {
				firstName,
				city,
				email,
				error: true,
				message: 'Пароли не совпадают'
			});
		}

		if (!termsAccepted) {
			return fail(400, {
				firstName,
				city,
				email,
				error: true,
				message: 'Необходимо принять условия'
			});
		}

		try {
			// TODO: Replace with actual API call to Laravel Sanctum
			// This is just a simulation for now

			// For a real implementation with Sanctum:
			// 1. Get CSRF cookie
			// const csrfCookie = await fetch('/sanctum/csrf-cookie');

			// 2. Send registration request
			// const response = await fetch('/api/register', {
			//   method: 'POST',
			//   headers: {
			//     'Content-Type': 'application/json',
			//     'Accept': 'application/json',
			//     'X-XSRF-TOKEN': getCookie(cookies, 'XSRF-TOKEN')
			//   },
			//   body: JSON.stringify({
			//     name: firstName,
			//     city,
			//     email,
			//     password,
			//     password_confirmation: passwordConfirm
			//   }),
			//   credentials: 'include'
			// });

			// 3. Check response and return result
			// if (!response.ok) {
			//   const data = await response.json();
			//   return fail(response.status, {
			//     firstName, city, email,
			//     error: true,
			//     message: data.message || 'Ошибка регистрации'
			//   });
			// }

			// Success simulation
			return {
				success: true,
				user: {
					email,
					name: firstName
				}
			};
		} catch (error) {
			console.error('Registration error:', error);

			return fail(500, {
				firstName,
				city,
				email,
				error: true,
				message: 'Произошла ошибка при регистрации'
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
