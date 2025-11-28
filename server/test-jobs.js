// Test Jobs API
async function testJobsAPI() {
  try {
    const response = await fetch('http://localhost:5000/api/jobs');
    const data = await response.json();
    console.log('Jobs API Response:');
    console.log('Type:', Array.isArray(data) ? 'Array' : typeof data);
    console.log('Data:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testJobsAPI();
