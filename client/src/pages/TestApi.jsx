import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TestApi = () => {
  const [result, setResult] = useState('Testing...');

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Test 1: Direct fetch to server root
        const rootResponse = await fetch('http://localhost:5000');
        const rootText = await rootResponse.text();
        console.log('Server root:', rootText);

        // Test 2: Fetch posts using axios
        const postsResponse = await axios.get('http://localhost:5000/api/posts');
        console.log('Posts response:', postsResponse.data);
        
        setResult(JSON.stringify(postsResponse.data, null, 2));
      } catch (error) {
        console.error('Test error:', error);
        setResult(`ERROR: ${error.message}`);
      }
    };

    testConnection();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>API Test</h1>
      <pre style={{ background: '#f5f5f5', padding: '20px', overflow: 'auto' }}>
        {result}
      </pre>
    </div>
  );
};

export default TestApi;
