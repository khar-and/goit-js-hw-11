import axios from "axios";
import {serviceContent} from "./fetchContent";

// Елементи розмітки
const elements = {
    form: document.querySelector('.search-form'),
    gallery:document.querySelector('.gallery')
};

elements.form.addEventListener("submit", onClickSend)

function onClickSend(evt) {
    evt.preventDefault();
    const query = evt.currentTarget.elements.searchQuery.value.trim()
    serviceContent(query)
    .then((data) => {
    console.log(data.hits);
    })

}



function createMarkup(arr)  {
    return arr.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => `
    <a class="gallery__link" href="${largeImageURL}">
        <div class="photo-card">
            <img src="${webformatURL}" alt="${tags}" loading="lazy" />
            <div class="info">
                <p class="info-item">
                    <b>${likes}</b>
                </p>
                <p class="info-item">
                    <b>${views}</b>
                </p>
                <p class="info-item">
                    <b>${comments}</b>
                </p>
                <p class="info-item">
                    <b>${downloads}</b>
                </p>
            </div>
        </div>
    </a>
    `).join("");
}   