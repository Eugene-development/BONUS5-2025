/**
 * HTTP Client for SvelteKit API Integration
 * Simple client for internal SvelteKit API routes
 */

import { API_CONFIG, buildApiUrl } from '$lib/config/api.js';

/**
 * API Error class for structured error handling
 */
export class ApiError extends Error {
	/**
	 * @param {string} message - Error message
	 * @param {number} status - HTTP status code
	 * @param {Object|null} data - Error response data
	 */
	constructor(message, status, data = null) {
		super(message);
		this.name = 'ApiError';
		this.status = status;
		this.data = data;
	}
}

/**
 * Get CSRF token from cookies
 * @returns {string|null} CSRF token value
 */
function getCsrfToken() {
	if (typeof document === 'undefined') return null;
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
 * Ensure CSRF token is available
 * @returns {Promise<void>}
 */
async function ensureCsrfToken() {
	if (getCsrfToken()) {
		return; // Token already exists
	}

	// Get CSRF token from Laravel Sanctum
	await fetch(buildApiUrl('/sanctum/csrf-cookie'), {
		method: 'GET',
		credentials: 'include'
	});
}

/**
 * Make API request to SvelteKit internal endpoints
 * @param {string} endpoint - API endpoint path
 * @param {any} options - Request options
 * @returns {Promise<any>} Response data
 */
export async function apiRequest(endpoint, options = {}) {
	const { method = 'GET', body = null, headers = {} } = options;

	try {
		// Ensure CSRF token for state-changing requests
		if (method !== 'GET' && method !== 'HEAD') {
			await ensureCsrfToken();
		}

		// Prepare request headers
		const requestHeaders = Object.assign({}, API_CONFIG.defaultHeaders, headers);

		// Add CSRF token for state-changing requests
		if (method !== 'GET' && method !== 'HEAD') {
			const csrfToken = getCsrfToken();
			if (csrfToken) {
				requestHeaders['X-XSRF-TOKEN'] = csrfToken;
			}
		}

		// Build request configuration
		/** @type {RequestInit} */
		const requestConfig = {
			method,
			headers: /** @type {HeadersInit} */ (requestHeaders),
			credentials: 'include'
		};

		// Add body for non-GET requests
		if (body && method !== 'GET') {
			requestConfig.body = JSON.stringify(body);
		}

		// Make the request
		const response = await fetch(buildApiUrl(endpoint), requestConfig);

		// Handle response
		if (!response.ok) {
			await handleErrorResponse(response);
		}

		// Parse JSON response
		const data = await response.json();
		return data;
	} catch (error) {
		if (error instanceof ApiError) {
			throw error;
		}
		throw new ApiError('Network error', 0, { originalError: error });
	}
}

/**
 * Handle error responses from the API
 * @param {Response} response - Fetch response object
 * @throws {ApiError}
 */
async function handleErrorResponse(response) {
	let errorData = null;

	try {
		errorData = await response.json();
	} catch {
		// Response is not JSON
		errorData = { message: 'Unknown error occurred' };
	}

	switch (response.status) {
		case 401:
			throw new ApiError('Unauthorized', 401, errorData);
		case 403:
			throw new ApiError('Forbidden', 403, errorData);
		case 422:
			// Laravel validation errors
			throw new ApiError('Validation failed', 422, errorData);
		case 429:
			throw new ApiError('Too many requests', 429, errorData);
		case 500:
			throw new ApiError('Server error', 500, errorData);
		default:
			throw new ApiError(errorData?.message || 'Request failed', response.status, errorData);
	}
}

/**
 * Convenience methods for common HTTP operations
 */

/**
 * Make GET request
 * @param {string} endpoint - API endpoint
 * @param {any} headers - Additional headers
 * @returns {Promise<any>}
 */
export function get(endpoint, headers = {}) {
	return apiRequest(endpoint, { method: 'GET', headers });
}

/**
 * Make POST request
 * @param {string} endpoint - API endpoint
 * @param {any} body - Request body
 * @param {any} headers - Additional headers
 * @returns {Promise<any>}
 */
export function post(endpoint, body = null, headers = {}) {
	return apiRequest(endpoint, { method: 'POST', body, headers });
}

/**
 * Make PUT request
 * @param {string} endpoint - API endpoint
 * @param {any} body - Request body
 * @param {any} headers - Additional headers
 * @returns {Promise<any>}
 */
export function put(endpoint, body = null, headers = {}) {
	return apiRequest(endpoint, { method: 'PUT', body, headers });
}

/**
 * Make DELETE request
 * @param {string} endpoint - API endpoint
 * @param {any} headers - Additional headers
 * @returns {Promise<any>}
 */
export function del(endpoint, headers = {}) {
	return apiRequest(endpoint, { method: 'DELETE', headers });
}
