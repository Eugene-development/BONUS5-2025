import { dev } from '$app/environment';

/**
 * Determine the correct backend URL based on environment
 * @returns {string} Backend URL
 */
export function getBackendUrl() {
	console.log('🔍 getBackendUrl() called:', {
		dev,
		environment: dev ? 'development' : 'production'
	});

	// For development mode, use localhost
	if (dev) {
		console.log('🌐 Using dev backend URL: http://localhost:7010');
		return 'http://localhost:7010';
	}

	// For production/Docker, use host.docker.internal
	console.log('🌐 Using docker backend URL: http://host.docker.internal:7010');
	return 'http://host.docker.internal:7010';
}

/**
 * Get frontend URL based on environment
 * @returns {string} Frontend URL
 */
export function getFrontendUrl() {
	// For development mode, use localhost:5173
	if (dev) {
		return 'http://localhost:5173';
	}

	// For production/Docker, use localhost:5010
	return 'http://localhost:5010';
}
