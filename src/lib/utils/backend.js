import { dev } from '$app/environment';

/**
 * Determine the correct backend URL based on environment
 * Uses layered resolution: Environment detection → appropriate defaults
 * @returns {string} Backend URL
 */
export function getBackendUrl() {
	console.log('🔍 getBackendUrl() called:', {
		dev,
		environment: dev ? 'development' : 'production'
	});

	// Development environment - use localhost:8000 for local dev (php artisan serve)
	// For Docker dev mode, use environment variable or separate config
	if (dev) {
		// Check for Docker dev mode via window/browser environment variable
		const isDockerDev =
			typeof window !== 'undefined' &&
			window.location.hostname === 'localhost' &&
			window.location.port === '5010';

		if (isDockerDev) {
			console.log('🐳 Using Docker dev backend URL: http://localhost:7010');
			return 'http://localhost:7010';
		} else {
			// Local development with npm run dev + php artisan serve
			console.log('🌐 Using local dev backend URL: http://localhost:8000');
			return 'http://localhost:8000';
		}
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

	// Development fallback - npm run dev uses Vite dev server on 5173
	if (dev) {
		console.log('🌐 Using dev frontend URL: http://localhost:5173');
		return 'http://localhost:5173';
	}

	// Production fallback (will be resolved from secrets in server-side integration)
	console.log('🌐 Using docker frontend URL: http://localhost:5010');
	return 'http://localhost:5010';
}
