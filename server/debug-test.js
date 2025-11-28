// Quick Registration Test
const testUrl = 'http://localhost:5000/api/users/register';

async function quickTest() {
  console.log('Testing registration endpoint...\n');
  
  try {
    const response = await fetch(testUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Debug User',
        email: `debug${Date.now()}@test.com`,
        password: 'password123',
        DOB: '1990-01-01',
        phone: '1234567890',
        address: '123 Test St'
      })
    });
    
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    
    const data = await response.json();
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('\n✅ Registration endpoint working!');
    } else {
      console.log('\n❌ Registration failed:', data.message || data.error);
    }
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
}

quickTest();
