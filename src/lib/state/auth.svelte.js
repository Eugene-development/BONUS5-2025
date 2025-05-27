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
		// TODO: Replace with actual API call to Laravel Sanctum
		// const response = await fetch('/api/login', {
		//   method: 'POST',
		//   headers: {
		//     'Content-Type': 'application/json',
		//     'Accept': 'application/json',
		//     'X-XSRF-TOKEN': getCookie('XSRF-TOKEN')
		//   },
		//   body: JSON.stringify({ email, password, remember }),
		//   credentials: 'include'
		// });

		// const data = await response.json();

		// if (!response.ok) {
		//   throw new Error(data.message || 'Login failed');
		// }

		// auth.user = data.user;
		// auth.isAuthenticated = true;

		// For testing without backend
		console.log('Login attempt:', { email, password, remember });
		await new Promise((resolve) => setTimeout(resolve, 1000));

		if (email === 'test@example.com' && password === 'password') {
			auth.user = {
				id: 1,
				name: 'Test User',
				email
			};
			auth.isAuthenticated = true;
			return true;
		} else {
			throw new Error('Invalid credentials');
		}
	} catch (error) {
		auth.error = error instanceof Error ? error.message : 'Unknown error';
		return false;
	} finally {
		auth.loading = false;
	}
}

/**
 * Function to handle user registration
 * @param {{ firstName: string, city: string, email: string, password: string, password_confirmation: string }} userData - User registration data
 * @returns {Promise<boolean>} - Success status
 */
export async function register(userData) {
	auth.loading = true;
	auth.error = null;

	try {
		// TODO: Replace with actual API call to Laravel Sanctum
		// const response = await fetch('/api/register', {
		//   method: 'POST',
		//   headers: {
		//     'Content-Type': 'application/json',
		//     'Accept': 'application/json',
		//     'X-XSRF-TOKEN': getCookie('XSRF-TOKEN')
		//   },
		//   body: JSON.stringify(userData),
		//   credentials: 'include'
		// });

		// const data = await response.json();

		// if (!response.ok) {
		//   throw new Error(data.message || 'Registration failed');
		// }

		// auth.user = data.user;
		// auth.isAuthenticated = true;

		// For testing without backend
		console.log('Registration attempt:', userData);
		await new Promise((resolve) => setTimeout(resolve, 1000));

		auth.user = {
			id: 1,
			name: userData.firstName,
			email: userData.email
		};
		auth.isAuthenticated = true;
		return true;
	} catch (error) {
		auth.error = error instanceof Error ? error.message : 'Unknown error';
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
	auth.loading = true;
	auth.error = null;

	try {
		// TODO: Replace with actual API call to Laravel Sanctum
		// const response = await fetch('/api/logout', {
		//   method: 'POST',
		//   headers: {
		//     'Content-Type': 'application/json',
		//     'Accept': 'application/json',
		//     'X-XSRF-TOKEN': getCookie('XSRF-TOKEN')
		//   },
		//   credentials: 'include'
		// });

		// if (!response.ok) {
		//   const data = await response.json();
		//   throw new Error(data.message || 'Logout failed');
		// }

		// For testing without backend
		console.log('Logout attempt');
		await new Promise((resolve) => setTimeout(resolve, 500));

		auth.user = null;
		auth.isAuthenticated = false;
		return true;
	} catch (error) {
		auth.error = error instanceof Error ? error.message : 'Unknown error';
		return false;
	} finally {
		auth.loading = false;
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
		// TODO: Replace with actual API call to Laravel Sanctum
		// const response = await fetch('/api/user', {
		//   method: 'GET',
		//   headers: {
		//     'Content-Type': 'application/json',
		//     'Accept': 'application/json'
		//   },
		//   credentials: 'include'
		// });

		// if (response.status === 401) {
		//   auth.user = null;
		//   auth.isAuthenticated = false;
		//   return false;
		// }

		// const data = await response.json();
		// auth.user = data;
		// auth.isAuthenticated = true;
		// return true;

		// For testing without backend
		console.log('Check auth attempt');
		await new Promise((resolve) => setTimeout(resolve, 500));

		// For now, always return not authenticated
		auth.user = null;
		auth.isAuthenticated = false;
		return false;
	} catch (error) {
		auth.error = error instanceof Error ? error.message : 'Unknown error';
		auth.user = null;
		auth.isAuthenticated = false;
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
