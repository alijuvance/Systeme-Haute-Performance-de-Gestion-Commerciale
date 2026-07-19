async function testSettings() {
  try {
    const loginRes = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@fanjava.local', password: 'password123' })
    });
    
    if (!loginRes.ok) {
      console.error('Login failed:', await loginRes.text());
      return;
    }
    const loginData = await loginRes.json();
    const token = loginData.access_token;
    console.log('Got token');
    
    const settingsRes = await fetch('http://localhost:3001/api/settings', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!settingsRes.ok) {
      console.error('Settings Error:', settingsRes.status, await settingsRes.text());
    } else {
      console.log('Settings Data:', await settingsRes.json());
    }
  } catch (err) {
    console.error('Request Error:', err.message);
  }
}
testSettings();
