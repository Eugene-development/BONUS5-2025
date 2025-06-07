/**
 * HTTP Client for Laravel Sanctum API Integration
 * Handles CSRF tokens, authentication, and error responses
 */

import { API_CONFIG, buildApiUrl, prepareHeaders } from '$lib/config/api.js';

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
 * Fetch CSRF cookie from Laravel Sanctum
 * Must be called before any authenticated requests
 * @returns {Promise<void>}
 */
export async function fetchCsrfCookie() {
	try {
		const response = await fetch(buildApiUrl(API_CONFIG.endpoints.csrf), {
			method: 'GET',
			credentials: 'include'
		});

		if (!response.ok) {
			throw new ApiError('Failed to fetch CSRF cookie', response.status);
		}
	} catch (error) {
		console.error('CSRF cookie fetch failed:', error);
		throw error;
	}
}

/**
 * Make authenticated API request with automatic CSRF handling
 * @param {string} endpoint - API endpoint path
 * @param {any} options - Request options
 * @returns {Promise<any>} Response data
 */
export async function apiRequest(endpoint, options = {}) {
	const { method = 'GET', body = null, headers = {} } = options;

	try {
		// Prepare request headers with CSRF token
		const requestHeaders = prepareHeaders(headers);

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
