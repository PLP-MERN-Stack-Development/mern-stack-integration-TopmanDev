// quickTest.js - Quick test to verify posts API

const http = require('http');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/posts',
  method: 'GET',
};

const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('Status Code:', res.statusCode);
    console.log('Response:');
    console.log(data);
    
    try {
      const parsed = JSON.parse(data);
      console.log('\nNumber of posts:', parsed.data?.length || 0);
      console.log('Total posts:', parsed.total || 0);
    } catch (e) {
      console.log('Could not parse JSON');
    }
  });
});

req.on('error', (error) => {
  console.error('Error:', error.message);
});

req.end();
