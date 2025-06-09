import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, cookies }) {
	try {
		console.log('📧 Resend email verification request received');

		// Get Laravel session cookie and CSRF token
		const laravelSession = cookies.get('laravel_session');
		const xsrfToken = cookies.get('XSRF-TOKEN');

		console.log('🍪 Laravel session cookie:', laravelSession ? 'Present' : 'Missing');
		console.log('🔐 XSRF token:', xsrfToken ? 'Present' : 'Missing');

		if (!laravelSession) {
			console.error('❌ No Laravel session cookie found');
			return json(
				{
					success: false,
					message: 'Сессия не найдена. Попробуйте войти в систему заново.'
				},
				{ status: 401 }
			);
		}

		if (!xsrfToken) {
			console.error('❌ No XSRF token found');
			return json(
				{
					success: false,
					message: 'CSRF токен не найден. Обновите страницу и попробуйте снова.'
				},
				{ status: 400 }
			);
		}

		// Forward request to Laravel API with proper cookies
		const response = await fetch('http://localhost:8000/api/email/verify/resend', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				'X-XSRF-TOKEN': decodeURIComponent(xsrfToken),
				Referer: 'http://localhost:5173',
				Origin: 'http://localhost:5173',
				Cookie: `laravel_session=${laravelSession}; XSRF-TOKEN=${xsrfToken}`
			},
			credentials: 'include'
		});

		const data = await response.json();

		console.log('📡 Laravel response:', {
			status: response.status,
			success: response.ok,
			data
		});

		if (!response.ok) {
			console.error('❌ Laravel resend failed:', data);
			return json(data, { status: response.status });
		}

		console.log('✅ Resend email successful');
		return json(data);
	} catch (error) {
		console.error('💥 Resend email proxy error:', error);
		return json(
			{
				success: false,
				message: 'Произошла ошибка при отправке письма'
			},
			{ status: 500 }
		);
	}
}
