import fetch from "isomorphic-fetch";

const baseUrl = window.baseUrl || process.env.REACT_APP_BASE_URL;

const token = window.token || process.env.REACT_APP_TOKEN;

const request = async (url, data, method = "GET", status) => {
  const response = await fetch(baseUrl + "api" + url, {
    method,
    headers: {
      "Content-Type": "application/json",
      manager: true,
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(data),
  });

  if (status) {
    if (status === response.status) {
      return true;
    } else {
      return false;
    }
  }

  return response.json();
};

export default request;
