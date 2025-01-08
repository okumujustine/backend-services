import axios from 'axios';

export const apiClient = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/v1',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM2Mjg4Mjg3LCJpYXQiOjE3MzYxMTU0ODcsImp0aSI6ImZkOGIwYWM4ZmU2NzRjYzlhYzY2OWU1MWMwZWE0YmZhIiwidXNlcl9pZCI6MX0.ww376GyGtYQs5mW7KRtFa0MYmp72PP_rv2hEEWOm1FU`,
    },
});