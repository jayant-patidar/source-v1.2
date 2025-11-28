import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

async function testProfileUpdate() {
  try {
    // 1. Login
    console.log('Logging in...');
    const loginRes = await axios.post(`${API_URL}/users/login`, {
      email: 'test2@example.com', // Assuming this user exists from previous steps
      password: 'password123'
    });
    
    const cookie = loginRes.headers['set-cookie'];
    console.log('Login successful. Cookie:', cookie);

    // 2. Update Profile
    console.log('Updating profile...');
    const updateData = {
      about: 'Updated bio via script',
      preferences: {
        minPay: 60
      }
    };

    const updateRes = await axios.put(`${API_URL}/users/profile`, updateData, {
      headers: {
        Cookie: cookie
      }
    });

    console.log('Update response:', updateRes.data);

    if (updateRes.data.about === 'Updated bio via script' && updateRes.data.preferences.minPay === 60) {
      console.log('SUCCESS: Profile updated correctly.');
    } else {
      console.log('FAILURE: Profile did not update as expected.');
    }

  } catch (error: any) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}

testProfileUpdate();
