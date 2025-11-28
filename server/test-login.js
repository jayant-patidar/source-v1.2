// Test Login API Directly
async function testLogin() {
  console.log('Testing login with fixed@test.com...\n');
  
  try {
    const response = await fetch('http://localhost:5000/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        email: 'fixed@test.com',
        password: 'password123'
      })
    });
    
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    
    const data = await response.json();
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('\n✅ Login API working!');
      console.log('User:', data.name);
      console.log('Email:', data.email);
    } else {
      console.log('\n❌ Login failed:', data.message || data.error);
    }
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
}

testLogin();
