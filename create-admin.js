fetch('http://localhost:3000/api/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Admin User', email: 'admin@eventflow.com', password: 'password123' })
}).then(r => r.json()).then(console.log).catch(console.error);
