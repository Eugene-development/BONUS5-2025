/** @type {import('./$types').LayoutServerLoad} */
export async function load({ locals, fetch, cookies, url }) {
	console.log('🔄 Layout server load:', {
		path: url.pathname,
		isAuthenticated: locals.isAuthenticated
	});

	// Если нет токена аутентификации, пользователь не авторизован
	if (!locals.isAuthenticated) {
		return {
			user: null,
			isAuthenticated: false
		};
	}

	try {
		// Проверяем аутентификацию через внутренний API
		const response = await fetch('/api/user', {
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'X-Requested-With': 'XMLHttpRequest',
				// Передаем все cookies для аутентификации
				Cookie: cookies
					.getAll()
					.map((cookie) => `${cookie.name}=${cookie.value}`)
					.join('; ')
			},
			credentials: 'include'
		});

		if (response.ok) {
			const data = await response.json();
			console.log('✅ User data loaded:', data.user || data);
			return {
				user: data.user || data,
				isAuthenticated: true
			};
		} else {
			// Если API вернул ошибку, пользователь не авторизован
			console.log('❌ User API failed:', response.status);
			return {
				user: null,
				isAuthenticated: false
			};
		}
	} catch (error) {
		console.error('💥 Auth check failed:', error);
		return {
			user: null,
			isAuthenticated: false
		};
	}
}
