import { dev } from '$app/environment';

/**
 * Determine the correct backend URL based on environment
 * Uses layered resolution: PUBLIC_API_BASE_URL → development defaults
 * @returns {string} Backend URL
 */
export function getBackendUrl() {
	console.log('🔍 getBackendUrl() called:', {
		dev,
		environment: dev ? 'development' : 'production'
	});

	// Note: For now using fallback approach until server-side integration is complete

	// Development fallback
	if (dev) {
		console.log('🌐 Using dev backend URL: http://localhost:7010');
		return 'http://localhost:7010';
	}

	// Production fallback
	console.log('🌐 Using docker backend URL: http://host.docker.internal:7010');
	return 'http://host.docker.internal:7010';
}

/**
 * Get frontend URL based on environment
 * Uses fallback approach for now
 * @returns {string} Frontend URL
 */
export function getFrontendUrl() {
	console.log('🔍 getFrontendUrl() called:', {
		dev
	});

	// Development fallback
	if (dev) {
		console.log('🌐 Using dev frontend URL: http://localhost:5173');
		return 'http://localhost:5173';
	}

	// Production fallback (will be resolved from secrets in server-side integration)
	console.log('🌐 Using docker frontend URL: http://localhost:5010');
	return 'http://localhost:5010';
}
