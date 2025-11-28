// Comprehensive Backend Test Script
const baseUrl = 'http://localhost:5000/api';

async function runTests() {
  console.log('🚀 Starting Comprehensive Backend Tests...\n');
  
  let authToken = '';
  let userId = '';
  let jobId = '';
  let negotiationId = '';
  
  try {
    // ========== TEST 1: User Registration ==========
    console.log('📝 TEST 1: User Registration');
    const regRes = await fetch(`${baseUrl}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        name: 'Test User',
        email: `test${Date.now()}@example.com`,
        password: 'password123',
        DOB: '1990-01-01',
        phone: '1234567890',
        address: '123 Test Street'
      })
    });
    const regData = await regRes.json();
    if (!regRes.ok) throw new Error(`Registration failed: ${JSON.stringify(regData)}`);
    userId = regData._id;
    console.log('✅ Registration successful:', regData.email);
    console.log('   User ID:', userId);
    
    // ========== TEST 2: User Login ==========
    console.log('\n🔐 TEST 2: User Login');
    const loginRes = await fetch(`${baseUrl}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        email: regData.email,
        password: 'password123'
      })
    });
    const loginData = await loginRes.json();
    if (!loginRes.ok) throw new Error(`Login failed: ${JSON.stringify(loginData)}`);
    console.log('✅ Login successful');
    console.log('   Seeker Rating:', loginData.seekerRating);
    console.log('   Provider Rating:', loginData.providerRating);
    
    // ========== TEST 3: Get User Profile ==========
    console.log('\n👤 TEST 3: Get User Profile');
    const profileRes = await fetch(`${baseUrl}/users/profile`, {
      credentials: 'include'
    });
    const profileData = await profileRes.json();
    if (!profileRes.ok) throw new Error(`Get profile failed: ${JSON.stringify(profileData)}`);
    console.log('✅ Profile retrieved');
    console.log('   Name:', profileData.name);
    console.log('   DOB:', profileData.DOB);
    console.log('   Phone:', profileData.phone);
    console.log('   Address:', profileData.address);
    
    // ========== TEST 4: Create Job ==========
    console.log('\n💼 TEST 4: Create Job');
    const jobRes = await fetch(`${baseUrl}/jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        title: 'Test Job',
        description: 'This is a test job posting',
        pay: 100,
        payType: 'fixed',
        category: 'Testing',
        generalLocation: 'New York',
        exactLocation: '123 Broadway',
        jobDate: '2025-02-01',
        jobTime: '10:00',
        expirationDate: '2025-01-31',
        isNegotiable: true
      })
    });
    const jobData = await jobRes.json();
    if (!jobRes.ok) throw new Error(`Job creation failed: ${JSON.stringify(jobData)}`);
    jobId = jobData._id;
    console.log('✅ Job created successfully');
    console.log('   Job ID:', jobId);
    console.log('   Title:', jobData.title);
    console.log('   Status:', jobData.status);
    
    // ========== TEST 5: Get All Jobs ==========
    console.log('\n📋 TEST 5: Get All Jobs');
    const jobsRes = await fetch(`${baseUrl}/jobs`);
    const jobsData = await jobsRes.json();
    if (!jobsRes.ok) throw new Error(`Get jobs failed: ${JSON.stringify(jobsData)}`);
    console.log('✅ Jobs retrieved');
    console.log('   Total jobs:', jobsData.length);
    
    // ========== TEST 6: Get Single Job ==========
    console.log('\n🔍 TEST 6: Get Single Job');
    const singleJobRes = await fetch(`${baseUrl}/jobs/${jobId}`);
    const singleJobData = await singleJobRes.json();
    if (!singleJobRes.ok) throw new Error(`Get job failed: ${JSON.stringify(singleJobData)}`);
    console.log('✅ Job details retrieved');
    console.log('   Location (General):', singleJobData.location.general);
    console.log('   Location (Exact):', singleJobData.location.exact);
    console.log('   Job Date:', singleJobData.jobDate);
    console.log('   Job Time:', singleJobData.jobTime);
    
    // ========== TEST 7: Create Second User for Negotiation ==========
    console.log('\n👥 TEST 7: Create Second User (for negotiation)');
    const user2Res = await fetch(`${baseUrl}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        name: 'Worker User',
        email: `worker${Date.now()}@example.com`,
        password: 'password123',
        DOB: '1992-05-15',
        phone: '9876543210',
        address: '456 Worker Ave'
      })
    });
    const user2Data = await user2Res.json();
    if (!user2Res.ok) throw new Error(`Second user registration failed: ${JSON.stringify(user2Data)}`);
    console.log('✅ Second user created:', user2Data.email);
    
    // ========== TEST 8: Create Negotiation ==========
    console.log('\n💰 TEST 8: Create Negotiation');
    const negRes = await fetch(`${baseUrl}/negotiations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        jobId: jobId,
        amount: 120,
        message: 'I can do this job for $120'
      })
    });
    const negData = await negRes.json();
    if (!negRes.ok) throw new Error(`Negotiation creation failed: ${JSON.stringify(negData)}`);
    negotiationId = negData._id;
    console.log('✅ Negotiation created');
    console.log('   Negotiation ID:', negotiationId);
    console.log('   Amount:', negData.amount);
    console.log('   Status:', negData.status);
    
    // ========== TEST 9: Get Negotiations for Job ==========
    console.log('\n📊 TEST 9: Get Negotiations for Job');
    const negsRes = await fetch(`${baseUrl}/negotiations/${jobId}`, {
      credentials: 'include'
    });
    const negsData = await negsRes.json();
    if (!negsRes.ok) throw new Error(`Get negotiations failed: ${JSON.stringify(negsData)}`);
    console.log('✅ Negotiations retrieved');
    console.log('   Total negotiations:', negsData.length);
    
    // ========== TEST 10: Logout ==========
    console.log('\n🚪 TEST 10: Logout');
    const logoutRes = await fetch(`${baseUrl}/users/logout`, {
      method: 'POST',
      credentials: 'include'
    });
    const logoutData = await logoutRes.json();
    if (!logoutRes.ok) throw new Error(`Logout failed: ${JSON.stringify(logoutData)}`);
    console.log('✅ Logout successful');
    
    console.log('\n✨ All tests passed successfully! ✨\n');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
  }
}

runTests();
