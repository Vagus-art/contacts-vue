import axios from "axios";

const API_ROOT = "https://pg-raw-api.herokuapp.com/api/contacts";

export const getPersonsDefault = () => {
  return axios.get(API_ROOT);
};

export const getPersonsWithOffset = (offset) => {
  return axios.get(`${API_ROOT}/offset/${offset}`);
};

export const getPersonsSearch = searchString => {
  return axios.get(
    `${API_ROOT}/search/${searchString}`
  );
};

export const postPerson = (payload, callback) => {
  const { name, phone } = payload;
  return axios.post(API_ROOT, {
      name,
      phone
    })
    .then(response => {
      callback();
    })
    .catch(e => {
      console.log('Request error: ', e);
    });
};

export const updatePerson = (payload, callback) => {
    const { name, phone, id } = payload;
    return axios.put(API_ROOT, {
        name,
        phone,
        id
      })
      .then(response => {
        callback();
      })
      .catch(e => {
        console.log('Request error: ', e);
      });
  };