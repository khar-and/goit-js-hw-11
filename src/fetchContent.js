export function serviceContent(query) {
    const API_KEY = '38685077-7183c86b95211b39352b290b2';
    const BASE_URL = 'https://pixabay.com/api/';

    const params = new URLSearchParams({
        key: API_KEY,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true'
    })

    return fetch(`${BASE_URL}?${params}&q=${query}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error(response.statusText)
            }
            return response.json();
        
        })
    
    // axios
    //     .get(`${BASE_URL}?${params}`)
    //     .then(response => {
    //         console.log(response.data);
           
    //     })
}