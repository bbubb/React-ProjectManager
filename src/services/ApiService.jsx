// ApiService.js
const baseURL = "http://localhost:3001";

export const fetchApi = async (url, options = {}) => {
  try {
    const response = await fetch(`${baseURL}${url}`, {
      ...options,
      headers: {
        ...options.headers,
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      console.error(
        "API Error:",
        errorData.message || `HTTP error ${response.status}`
      );
      throw new Error(errorData.message || `HTTP error ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("API Error:", error.toString());
    throw error;
  }
};

export const get = (endpoint, queryParams = {}) => {
  const query = new URLSearchParams(queryParams).toString();
  return fetchApi(`${endpoint}?${query}`);
};

export const post = (endpoint, data) => {
  return fetchApi(endpoint, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const put = (endpoint, data) => {
  return fetchApi(endpoint, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const del = (endpoint) => {
  return fetchApi(endpoint, {
    method: "DELETE",
  });
};
