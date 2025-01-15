import axios from 'axios';

export const apiClient = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/v1',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM5NDk0NDI1LCJpYXQiOjE3MzY5MDI0MjUsImp0aSI6ImRiYTU4MjIxMzAxODRmNzM4ZWU4ZGJhNzhlMjRlYThhIiwidXNlcl9pZCI6MTV9._ad09pNrxlyRsNeOPecl-hLb0R5C-q3aeXl7D04MSBM`,
    },
});