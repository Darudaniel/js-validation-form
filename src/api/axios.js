import axios from 'axios';
const BASE_URL = 'sistemic.udea.edu.co:4000/api/autenticacion/oauth/token';

export default axios.create({
    baseURL: BASE_URL
});

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});