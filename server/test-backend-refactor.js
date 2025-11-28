async function testBackend() {
  const baseUrl = 'http://localhost:5000/api';
  
  // 1. Register User
  console.log('Testing Registration...');
  try {
    const regRes = await fetch(`${baseUrl}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Refactor User',
        email: `refactor${Date.now()}@example.com`,
        password: 'password123',
        DOB: '1990-01-01',
        phone: '1234567890',
        address: '123 Refactor Lane'
      })
    });
    const user = await regRes.json();
    if (!regRes.ok) throw new Error(`Registration failed: ${JSON.stringify(user)}`);
    console.log('Registration Success:', user._id);

    // 2. Login (to get token if needed, though register usually logs in or returns token)
    // My controller returns token in cookie, so I might need to handle that or just rely on the fact that register worked.
    // Let's try to post a job. I need to be logged in.
    // The register controller sets the cookie.
    // Fetch doesn't automatically persist cookies across requests unless configured, but in this script context it might not.
    // However, I can just verify the registration worked.
    
    // 3. Login to verify login route
    console.log('Testing Login...');
    const loginRes = await fetch(`${baseUrl}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: user.email,
            password: 'password123'
        })
    });
    const loginData = await loginRes.json();
    if (!loginRes.ok) throw new Error(`Login failed: ${JSON.stringify(loginData)}`);
    console.log('Login Success:', loginData.email);

  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}

testBackend();
