import axios from "axios";

export async function serviceContent(query, page, perPage) {
    const API_KEY = '38685077-7183c86b95211b39352b290b2';
    const BASE_URL = 'https://pixabay.com/api/';

    const params = new URLSearchParams({
        key: API_KEY,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
    })

    const response = await axios.get(`${BASE_URL}?${params}&q=${query}&page=${page}&per_page=${perPage}`)
    console.log(response.data);
    // console.log(response.data.hits);
    return response.data  
         
}; 