async function testRegister() {
  try {
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      })
    });

    const data = await response.json();

    if (response.ok) {
      console.log('Registration successful:', data);
    } else {
      console.error('Registration failed:', response.status, data);
    }
  } catch (error) {
    console.error('Network/Server error:', error.message);
  }
}

testRegister();
