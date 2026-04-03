import axios from 'axios';


const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    'Content-type': 'application/json',
  },
});


api.interceptors.request.use(
  (config) => {
    const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ8.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvYXBpL2xvZ2luIiwiaWF0IjoxNzc0OTcxMjkyLCJleHAiOjE3NzQ5NzQ4OTIsIm5iZiI6MTc3NDk3MTI5MiwianRpIjoia3J0YkJOeTJaalI0VGhXYyIsInN1YiI6IjEiLCJwcnYiOiIyM2JkNWM4OTQ5ZjYwMGFkYjM5ZTcwMWM0MDA4NzJkYjdhNTk3NmY3In0.-F-1zVrvTL1avCEKBNLIlplLcowRhKwekI9UZcY6COU"

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error)=>{
    return Promise.reject(error);
  }
)
api.interceptors.response.use(
  (response)=>{
    async(error)=>{
      const originRequist = error.config;
      if(error.response?.status === 401 ){
        // originRequist._retry = true;
        console.log('help');
        // window.location.heref = '/login';
      }
    }

  }
)

const res = await api.get('/me');

console.log(res.data);
