/**
 * Authentication store using Svelte 5 runes
 * This store manages user authentication state across the application
 * and provides functions for login, registration, and logout.
 */

// Define types for our auth state
/**
 * @typedef {Object} User
 * @property {number} id - User ID
 * @property {string} name - User name
 * @property {string} email - User email
 */

/**
 * @typedef {Object} AuthState
 * @property {User|null} user - Current user
 * @property {boolean} isAuthenticated - Authentication status
 * @property {boolean} loading - Loading status
 * @property {string|null} error - Error message
 */

/** @type {AuthState} */
export const auth = $state({
	user: null,
	isAuthenticated: false,
	loading: false,
	error: null
});

/**
 * Function to handle user login
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {boolean} remember - Remember me option
 * @returns {Promise<boolean>} - Success status
 */
export async function login(email, password, remember = false) {
	auth.loading = true;
	auth.error = null;

	try {
		// Import auth API functions dynamically to avoid circular dependencies
		const { loginUser } = await import('$lib/api/auth.js');

		const result = await loginUser(email, password, remember);

		if (result.success) {
			auth.user = {
				id: result.user.id || 1,
				name: result.user.name || result.user.email,
				email: result.user.email
			};
			auth.isAuthenticated = true;
			return true;
		} else {
			auth.error = result.message || 'Ошибка авторизации';
			return false;
		}
	} catch (error) {
		console.error('Login error:', error);
		auth.error = 'Произошла ошибка при входе';
		return false;
	} finally {
		auth.loading = false;
	}
}

/**
 * Function to handle user registration
 * @param {any} userData - User registration data
 * @returns {Promise<boolean>} - Success status
 */
export async function register(userData) {
	auth.loading = true;
	auth.error = null;

	try {
		// Import auth API functions dynamically to avoid circular dependencies
		const { registerUser } = await import('$lib/api/auth.js');

		const result = await registerUser(userData);

		if (result.success) {
			auth.user = {
				id: result.user.id || 1,
				name: result.user.name || userData.firstName,
				email: result.user.email || userData.email
			};
			auth.isAuthenticated = true;
			return true;
		} else {
			auth.error = result.message || 'Ошибка регистрации';
			return false;
		}
	} catch (error) {
		console.error('Registration error:', error);
		auth.error = 'Произошла ошибка при регистрации';
		return false;
	} finally {
		auth.loading = false;
	}
}

/**
 * Function to handle user logout
 * @returns {Promise<boolean>} - Success status
 */
export async function logout() {
	console.log('🔓 Logout function called');
	auth.loading = true;
	auth.error = null;

	try {
		// Import auth API functions dynamically to avoid circular dependencies
		const { logoutUser } = await import('$lib/api/auth.js');

		console.log('📡 Calling logout API...');
		const result = await logoutUser();
		console.log('📡 Logout API response:', result);

		// Always clear local state regardless of API response
		console.log('🧹 Clearing local auth state...');
		auth.user = null;
		auth.isAuthenticated = false;

		if (result.success) {
			window.location.href = '/';
			console.log('✅ Logout successful');
			return true;
		} else {
			console.warn('⚠️ Logout API failed, but local state cleared:', result.message);
			return true; // Still return true since local state is cleared
		}
	} catch (error) {
		console.error('💥 Logout error:', error);
		// Even if logout request fails, clear local state
		console.log('🧹 Force clearing local state after error...');
		auth.user = null;
		auth.isAuthenticated = false;
		auth.error = null; // Don't show error for logout
		return true;
	} finally {
		auth.loading = false;
		console.log('🔓 Logout function completed');
	}
}

/**
 * Function to check if user is authenticated (for initial page load)
 * @returns {Promise<boolean>} - Authentication status
 */
export async function checkAuth() {
	auth.loading = true;
	auth.error = null;

	try {
		// Import auth API functions dynamically to avoid circular dependencies
		const { getCurrentUser } = await import('$lib/api/auth.js');

		const result = await getCurrentUser();

		if (result.success && result.user) {
			auth.user = {
				id: result.user.id || 1,
				name: result.user.name || result.user.email,
				email: result.user.email
			};
			auth.isAuthenticated = true;
			return true;
		} else {
			auth.user = null;
			auth.isAuthenticated = false;
			return false;
		}
	} catch (error) {
		console.error('Auth check error:', error);
		auth.user = null;
		auth.isAuthenticated = false;
		auth.error = null; // Don't show error for auth check
		return false;
	} finally {
		auth.loading = false;
	}
}

/**
 * Helper function to get CSRF cookie for Laravel Sanctum
 * @param {string} name - Cookie name
 * @returns {string|null} - Cookie value
 */
function getCookie(name) {
	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);
	if (parts.length === 2) {
		const part = parts.pop();
		if (part) {
			return part.split(';').shift() || null;
		}
	}
	return null;
}
