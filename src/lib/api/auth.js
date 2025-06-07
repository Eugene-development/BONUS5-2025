/**
 * Authentication API client for Laravel Sanctum
 * Provides authentication-specific methods and error handling
 */

import { API_CONFIG } from '$lib/config/api.js';
import { post, get, ApiError } from '$lib/api/client.js';

/**
 * Login user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {boolean} remember - Remember me option
 * @returns {Promise<any>}
 */
export async function loginUser(email, password, remember = false) {
	try {
		console.log('🔐 loginUser called with:', { email, password: '***', remember });
		console.log('🌐 Using endpoint:', API_CONFIG.endpoints.login);

		const response = await post(API_CONFIG.endpoints.login, {
			email,
			password,
			remember
		});

		console.log('✅ loginUser success:', response);

		return {
			success: true,
			user: response.user,
			message: response.message
		};
	} catch (error) {
		console.error('❌ loginUser error:', error);

		if (error instanceof ApiError) {
			console.log('📊 Error details:', { status: error.status, data: error.data });

			if (error.status === 422) {
				// Validation errors
				return {
					success: false,
					// @ts-ignore
					errors: error.data && error.data.errors ? error.data.errors : {},
					// @ts-ignore
					message: error.data && error.data.message ? error.data.message : 'Ошибка валидации'
				};
			} else if (error.status === 401) {
				return {
					success: false,
					message: 'Неверный email или пароль'
				};
			}
		}

		return {
			success: false,
			message: 'Произошла ошибка при входе'
		};
	}
}

/**
 * Register new user
 * @param {Object} userData - User registration data
 * @param {string} userData.firstName - User first name
 * @param {string} userData.city - User city
 * @param {string} userData.email - User email
 * @param {string} userData.password - User password
 * @param {string} userData.password_confirmation - Password confirmation
 * @param {boolean} userData.terms_accepted - Terms acceptance
 * @returns {Promise<any>}
 */
export async function registerUser(userData) {
	try {
		// Map firstName to name for Laravel backend
		const requestData = {
			name: userData.firstName,
			city: userData.city,
			email: userData.email,
			password: userData.password,
			password_confirmation: userData.password_confirmation,
			terms_accepted: userData.terms_accepted
		};

		const response = await post(API_CONFIG.endpoints.register, requestData);

		return {
			success: true,
			user: response.user,
			message: response.message
		};
	} catch (error) {
		if (error instanceof ApiError) {
			if (error.status === 422) {
				// Validation errors
				return {
					success: false,
					// @ts-ignore
					errors: error.data?.errors,
					// @ts-ignore
					message: error.data?.message || 'Ошибка валидации'
				};
			} else if (error.status === 409) {
				return {
					success: false,
					message: 'Пользователь с таким email уже существует'
				};
			}
		}

		return {
			success: false,
			message: 'Произошла ошибка при регистрации'
		};
	}
}

/**
 * Logout current user
 * @returns {Promise<any>}
 */
export async function logoutUser() {
	try {
		await post(API_CONFIG.endpoints.logout);

		return {
			success: true,
			message: 'Вы успешно вышли из системы'
		};
	} catch (error) {
		// Even if logout request fails, consider it successful
		// since the main goal is to clear client state
		console.warn('Logout request failed:', error);
		return {
			success: true,
			message: 'Вы вышли из системы'
		};
	}
}

/**
 * Get current authenticated user data
 * @returns {Promise<{success: boolean, user?: any, message?: string}>}
 */
export async function getCurrentUser() {
	try {
		const response = await get(API_CONFIG.endpoints.user);

		return {
			success: true,
			user: response.user || response
		};
	} catch (error) {
		if (error instanceof ApiError && error.status === 401) {
			return {
				success: false,
				message: 'Пользователь не авторизован'
			};
		}

		return {
			success: false,
			message: 'Ошибка получения данных пользователя'
		};
	}
}

/**
 * Check if user is authenticated by trying to get user data
 * @returns {Promise<boolean>}
 */
export async function checkAuthentication() {
	try {
		const result = await getCurrentUser();
		return result.success;
	} catch {
		return false;
	}
}

/**
 * Send email verification notification
 * @returns {Promise<{success: boolean, message?: string}>}
 */
export async function sendEmailVerification() {
	try {
		const response = await post('/api/email/verification-notification');

		return {
			success: true,
			message: response.message || 'Письмо с подтверждением отправлено'
		};
	} catch (error) {
		if (error instanceof ApiError) {
			if (error.status === 422) {
				return {
					success: false,
					// @ts-ignore
					message: error.data?.message || 'Email уже подтвержден'
				};
			}
		}

		return {
			success: false,
			message: 'Произошла ошибка при отправке письма'
		};
	}
}

/**
 * Resend email verification notification
 * @returns {Promise<{success: boolean, message?: string}>}
 */
export async function resendEmailVerification() {
	try {
		const response = await post('/api/email/verify/resend');

		return {
			success: true,
			message: response.message || 'Письмо с подтверждением отправлено повторно'
		};
	} catch (error) {
		if (error instanceof ApiError) {
			if (error.status === 422) {
				return {
					success: false,
					// @ts-ignore
					message: error.data?.message || 'Email уже подтвержден'
				};
			}
		}

		return {
			success: false,
			message: 'Произошла ошибка при повторной отправке письма'
		};
	}
}

/**
 * Verify email with token (called from email link)
 * @param {string} id - User ID
 * @param {string} hash - Verification hash
 * @returns {Promise<{success: boolean, user?: any, message?: string}>}
 */
export async function verifyEmail(id, hash) {
	try {
		const response = await get(`/api/email/verify/${id}/${hash}`);

		return {
			success: true,
			user: response.user,
			message: response.message || 'Email успешно подтвержден'
		};
	} catch (error) {
		if (error instanceof ApiError) {
			if (error.status === 403) {
				return {
					success: false,
					message: 'Недействительная ссылка для подтверждения'
				};
			}
		}

		return {
			success: false,
			message: 'Произошла ошибка при подтверждении email'
		};
	}
}

/**
 * Map Laravel validation errors to frontend format
 * @param {Object} errors - Laravel validation errors
 * @returns {Object} Mapped errors
 */
export function mapValidationErrors(errors) {
	if (!errors) return {};

	const mapped = {};

	// Map common field names
	const fieldMap = {
		name: 'firstName',
		email: 'email',
		password: 'password',
		city: 'city'
	};

	for (const [field, messages] of Object.entries(errors)) {
		// @ts-ignore
		const mappedField = fieldMap[field] || field;
		// @ts-ignore
		mapped[mappedField] = Array.isArray(messages) ? messages[0] : messages;
	}

	return mapped;
}
