import { API_KEY } from 'react-native-dotenv';

const get_query = (params) => {
  const key_array = Object.keys(params);
  const value_array = Object.values(params);

  if (!key_array.length)
    return "";

  let query = `?${key_array[0]}=${value_array[0]}`;

  for (let i = 1; i < key_array.length; i++)
    query += `&${key_array[i]}=${value_array[i]}`;

  return query;
}

module.exports = (params, callback) => {
  if (!params || !params.method || !params.url)
    return callback("options not specified");

  const request_url = "https://stumarkt.herokuapp.com/api";
  // const request_url = "http://localhost:3000/api";

  let query = "";
  if (params.query)
    query = get_query(params.query);

  if (params.method == "GET") {
    fetch(request_url + params.url + query, {
      headers: {
        "x_auth": API_KEY
      }
    })
    .then(response => response.json())
    .then(data => {
      return callback(null, data);
    })
    .catch(err => {
      return callback(err);
    });
  } else if (params.method == "POST") {
    fetch(request_url + params.url + query, {
      headers: {
        "Content-Type": params.is_form_data ? "multipart/form-data" :  "application/json",
        "x_auth": API_KEY
      },
      method: "POST",
      body: params.is_form_data ? params.body : JSON.stringify(params.body)
    })
    .then(response => response.json())
    .then(data => {
      return callback(null, data);
    })
    .catch(err => {
      return callback(err);
    });
  } else {
    return callback("unknown option specified.");
  }
}
