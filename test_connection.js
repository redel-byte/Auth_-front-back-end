import axios from 'axios';


const testConnection = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/me', {
      headers: {
        'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwMDAvYXBpL2xvZ2luIiwiaWF0IjoxNzc0ODgwMjE0LCJleHAiOjE3NzQ4ODM4MTQsIm5iZiI6MTc3NDg4MDIxNCwianRpIjoiWDhWbDZOM2NQVlU2ZVJnRyIsInN1YiI6IjMiLCJwcnYiOiIyM2JkNWM4OTQ5ZjYwMGFkYjM5ZTcwMWM0MDA4NzJkYjdhNTk3NmY3In0.2d6M2qgKKCHfJLNpDGJSuF6J9-2BBWJ2tZOCjrcKxfI'
      }
    });
    console.log('Response:', response.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
};

testConnection();