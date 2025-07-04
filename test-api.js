/**
 * Simple API Integration Test
 * Run with: node test-api.js
 */

const API_BASE = 'http://localhost:7010';

/**
 * Test CSRF endpoint
 */
async function testCsrf() {
	console.log('🔒 Testing CSRF endpoint...');

	try {
		const response = await fetch(`${API_BASE}/sanctum/csrf-cookie`, {
			method: 'GET',
			credentials: 'include'
		});

		if (response.ok) {
			console.log('✅ CSRF endpoint working');
			console.log('📋 Headers:', Object.fromEntries(response.headers.entries()));
		} else {
			console.log('❌ CSRF endpoint failed:', response.status);
		}
	} catch (error) {
		console.log('❌ CSRF error:', error.message);
	}
}

/**
 * Test user endpoint (should return 401)
 */
async function testUserEndpoint() {
	console.log('\n👤 Testing user endpoint (unauthenticated)...');

	try {
		const response = await fetch(`${API_BASE}/api/user`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			},
			credentials: 'include'
		});

		if (response.status === 401) {
			console.log('✅ User endpoint correctly returns 401 for unauthenticated users');
		} else {
			console.log('❌ User endpoint unexpected response:', response.status);
		}
	} catch (error) {
		console.log('❌ User endpoint error:', error.message);
	}
}

/**
 * Test login with invalid credentials (should return 401)
 */
async function testInvalidLogin() {
	console.log('\n🔐 Testing login with invalid credentials...');

	try {
		// First get CSRF cookie
		await fetch(`${API_BASE}/sanctum/csrf-cookie`, {
			method: 'GET',
			credentials: 'include'
		});

		const response = await fetch(`${API_BASE}/api/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			},
			credentials: 'include',
			body: JSON.stringify({
				email: 'invalid@example.com',
				password: 'wrongpassword',
				remember: false
			})
		});

		if (response.status === 401 || response.status === 422) {
			console.log('✅ Login correctly rejects invalid credentials');
			const data = await response.json();
			console.log('📋 Error response:', data);
		} else {
			console.log('❌ Login unexpected response:', response.status);
		}
	} catch (error) {
		console.log('❌ Login error:', error.message);
	}
}

/**
 * Test registration with invalid data (should return 422)
 */
async function testInvalidRegistration() {
	console.log('\n📝 Testing registration with invalid data...');

	try {
		// First get CSRF cookie
		await fetch(`${API_BASE}/sanctum/csrf-cookie`, {
			method: 'GET',
			credentials: 'include'
		});

		const response = await fetch(`${API_BASE}/api/register`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			},
			credentials: 'include',
			body: JSON.stringify({
				name: '',
				city: '',
				email: 'invalid-email',
				password: '123',
				password_confirmation: '456'
			})
		});

		if (response.status === 422) {
			console.log('✅ Registration correctly validates input');
			const data = await response.json();
			console.log('📋 Validation errors:', data);
		} else {
			console.log('❌ Registration unexpected response:', response.status);
		}
	} catch (error) {
		console.log('❌ Registration error:', error.message);
	}
}

/**
 * Test CORS headers
 */
async function testCors() {
	console.log('\n🌐 Testing CORS headers...');

	try {
		const response = await fetch(`${API_BASE}/api/user`, {
			method: 'OPTIONS',
			headers: {
				Origin: 'http://localhost:5010',
				'Access-Control-Request-Method': 'POST',
				'Access-Control-Request-Headers': 'Content-Type'
			}
		});

		const corsHeaders = {
			'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
			'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
			'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers'),
			'Access-Control-Allow-Credentials': response.headers.get('Access-Control-Allow-Credentials')
		};

		console.log('📋 CORS Headers:', corsHeaders);

		if (corsHeaders['Access-Control-Allow-Origin'] === 'http://localhost:5010') {
			console.log('✅ CORS configured correctly for SvelteKit');
		} else {
			console.log('❌ CORS may not be configured correctly');
		}
	} catch (error) {
		console.log('❌ CORS test error:', error.message);
	}
}

/**
 * Run all tests
 */
async function runTests() {
	console.log('🚀 Starting API Integration Tests\n');
	console.log('='.repeat(50));

	await testCsrf();
	await testUserEndpoint();
	await testInvalidLogin();
	await testInvalidRegistration();
	await testCors();

	console.log('\n' + '='.repeat(50));
	console.log('✨ Tests completed!');
	console.log('\n📋 Next steps:');
	console.log('1. Start backend: ./start-backend.sh');
	console.log('2. Start frontend: ./start-frontend.sh');
	console.log('3. Test registration form at http://localhost:5010/registration');
	console.log('4. Test API directly at http://localhost:7010/api');
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
	runTests().catch(console.error);
}
