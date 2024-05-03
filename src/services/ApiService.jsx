// ApiService.js
const baseURL = "http://localhost:3001";

export const fetchApi = async (url, options = {}) => {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    return response.json();
};

export const get = (endpoint, queryParams = {}) => {
    const query = new URLSearchParams(queryParams).toString();
    return fetchApi(`${baseURL}${endpoint}?${query}`);
};

export const post = (endpoint, data) => {
    return fetchApi(`${baseURL}${endpoint}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });
};

export const put = (endpoint, data) => {
    return fetchApi(`${baseURL}${endpoint}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });
};

export const del = (endpoint) => {
    return fetchApi(`${baseURL}${endpoint}`, {
        method: 'DELETE'
    });
};