/**
 * API Configuration for SvelteKit Internal Routes
 * Provides configuration for internal API routes that proxy to Laravel
 */

// API Configuration
export const API_CONFIG = {
	// Use SvelteKit internal API routes (they proxy to Laravel)
	baseUrl: '',

	// API endpoints (internal SvelteKit routes)
	endpoints: {
		login: '/api/login',
		register: '/api/register',
		logout: '/api/logout',
		user: '/api/user'
	},

	// Default headers for all requests
	defaultHeaders: {
		'Content-Type': 'application/json',
		Accept: 'application/json'
	},

	// Request timeout in milliseconds
	timeout: 10000
};

/**
 * Build full API URL
 * @param {string} endpoint - API endpoint path
 * @returns {string} Full URL
 */
export function buildApiUrl(endpoint) {
	return `${API_CONFIG.baseUrl}${endpoint}`;
}

/**
 * Get CSRF token from cookies
 * @returns {string|null} CSRF token or null if not found
 */
export function getCsrfToken() {
	if (typeof document === 'undefined') return null;

	// Parse XSRF-TOKEN cookie
	const cookies = document.cookie.split(';');
	for (let cookie of cookies) {
		const [name, value] = cookie.trim().split('=');
		if (name === 'XSRF-TOKEN') {
			return decodeURIComponent(value);
		}
	}
	return null;
}

/**
 * Get cookie value by name
 * @param {string} name - Cookie name
 * @returns {string|null} Cookie value or null if not found
 */
export function getCookie(name) {
	if (typeof document === 'undefined') return null;

	const cookies = document.cookie.split(';');
	for (let cookie of cookies) {
		const [cookieName, cookieValue] = cookie.trim().split('=');
		if (cookieName === name) {
			return decodeURIComponent(cookieValue);
		}
	}
	return null;
}

/**
 * Prepare headers for API request with CSRF token
 * @param {Object} additionalHeaders - Additional headers to include
 * @returns {Object} Headers object with CSRF token
 */
export function prepareHeaders(additionalHeaders = {}) {
	const headers = Object.assign({}, API_CONFIG.defaultHeaders, additionalHeaders);

	// Add CSRF token if available
	const csrfToken = getCsrfToken();
	if (csrfToken) {
		// @ts-ignore
		headers['X-XSRF-TOKEN'] = csrfToken;
	}

	return headers;
}
