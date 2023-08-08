import { Notify } from 'notiflix/build/notiflix-notify-aio';
import {serviceContent} from "./fetchContent";

// Елементи розмітки
const elements = {
    form: document.querySelector('.search-form'),
    gallery: document.querySelector('.gallery'),
    loadMore:document.querySelector('.load-more')
};
// Об'єкт параметрів для Notify
const paramsForNotify = {
    position: 'center-center',
        timeout: 3000,
        width: '500px',
        fontSize: '20px'
}

let page = 1;  //Поточна сторінка - перша
const perPage = 40  // К-сть елементів на сторінці.
let query = "";

elements.form.addEventListener("submit", onClickSend)

function onClickSend(evt) {
    evt.preventDefault();
    query = evt.currentTarget.elements.searchQuery.value.trim()
// Перевірка чи поле пошуку не пусте
    if (query === "") {
        Notify.failure('Fill the search field', paramsForNotify);
        return;
    }
// Робимо запит на бекенд
    serviceContent(query, page, perPage)
        .then(data => {
            if (data.totalHits === 0) {
                Notify.failure('Sorry, there are no images matching your search query. Please try again.', paramsForNotify);
                return;
                
            } else {
                const countPages = Math.ceil(data.totalHits / perPage);
                const markup = createMarkup(data.hits);
                elements.gallery.insertAdjacentHTML('beforeend', markup);
                // Перевіряємо кількість сторінок і якщо вона не одна, то показуємо кнопку LoadMore
                if (page !== countPages) {
                    elements.loadMore.hidden = false;
                }
            }
        // .catch(onFetchError);
    })
    
}

elements.loadMore.addEventListener('click', onLoad);

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

function onLoad() {
    page += 1;
    serviceContent(query, page, perPage)
    .then(data => {
        const markup = createMarkup(data.hits);
        elements.gallery.insertAdjacentHTML('beforeend', markup);
        // Перевірка чи ми знаходимось на останній сторінці колекції
        if (page*perPage >= data.totalHits) {
            elements.loadMore.hidden = true;
            Notify.info("We're sorry, but you've reached the end of search results.", paramsForNotify);
            elements.loadMore.removeEventListener('click', onLoad);
        }
        // .catch(onFetchError);
    })
}
    
