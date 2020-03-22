export const getPersonsDefault = () => {
    return axios.get('https://pg-raw-api.herokuapp.com/api/contacts/');
}

export const getPersonsSearch = (searchString) => {
    return axios.get(`https://pg-raw-api.herokuapp.com/api/contacts/search/${searchString}`);
}