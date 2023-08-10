import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { serviceContent } from "./fetchContent";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";


                                        // Елементи розмітки
const elements = {
    form: document.querySelector('.search-form'),
    gallery: document.querySelector('.gallery'),
    loadMore: document.querySelector('.load-more'),
    target: document.querySelector('.js-guard')     //OBSERVER
};
                                        // Об'єкт параметрів для Notify
const paramsForNotify = {
    position: 'center-center',
        timeout: 2000,
        width: '500px',
        fontSize: '20px'
}
                                        // Об'єкт параметрів для Simple Lightbox
const paramsForLightbox = {
    captionsData: 'alt',
    captionPosition: 'top',
    captionDelay: 200
}

// // OBSERVER (Розкоментовуємо даний розділ + закоментовуємо функцію onLoad)
// let options = {
//   root: null,
//   rootMargin: "300px",
//   threshold: 1.0,
// };
// let observer = new IntersectionObserver(onLoad, options);
// function onLoad(entries, observer) {
//     entries.forEach((entry) => {
//         if (entry.isIntersecting) {
//             page += 1;
//             serviceContent(query, page, perPage)
//                 .then(data => {
//                     const markup = createMarkup(data.hits);
//                     elements.gallery.insertAdjacentHTML('beforeend', markup);
//                       if (page*perPage >= data.totalHits) {
//                         elements.loadMore.hidden = true
//                         Notify.info("We're sorry, but you've reached the end of search results.", paramsForNotify);
//                         elements.loadMore.removeEventListener('click', onLoad);
//                         observer.unobserve(target);
//                     };
//                 })
//                 .catch(fetchError)
//         }
//     });
// }
// // OBSERVER

let page = 1;                           //Поточна сторінка - перша
const perPage = 40                      // К-сть елементів на сторінці.
let query = "";
let changeQuery = "";

elements.form.addEventListener("submit", onClickSend)

function onClickSend(evt) {
   
    evt.preventDefault();
    elements.gallery.innerHTML = '';
    query = evt.currentTarget.elements.searchQuery.value.trim();
    page = 1;
                                        // Перевірка чи поле пошуку не пусте
    if (query === "") {
        Notify.failure('Fill the search field', paramsForNotify);
        elements.loadMore.hidden = true;
        return;
    }
                                        // Робимо запит на бекенд
    serviceContent(query, page, perPage)
        .then(data => {
            if (data.totalHits === 0) {
                Notify.failure('Sorry, there are no images matching your search query. Please try again.', paramsForNotify);
                elements.loadMore.hidden = true;
                return;

                
            } else {
                console.log(page);
                const countPages = Math.ceil(data.totalHits / perPage);
                const markup = createMarkup(data.hits);
                elements.gallery.insertAdjacentHTML('beforeend', markup);
                // OBSERVER
                // observer.observe(elements.target);
                // // OBSERVER
                simpleLightBox = new SimpleLightbox('.gallery a', paramsForLightbox).refresh();
                Notify.info(`Hooray! We found ${data.totalHits} images.`, paramsForNotify);
                
                                        // Перевіряємо кількість сторінок і якщо вона не одна, то показуємо кнопку LoadMore
                if (page !== countPages) {
                    elements.loadMore.hidden = false;
                }
            }
    
        })
        .catch(fetchError)
        .finally(() => {
            elements.form.reset();
        });
    
    
}

elements.loadMore.addEventListener('click', onLoad);

function createMarkup(arr)  {
    return arr.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => `
    <a class="gallery__link link" href="${largeImageURL}">
        <div class="photo-card">
            
                <img src="${webformatURL}" alt="${tags}" width="300px" loading="lazy" />
            
            <div class="info">
                <p class="info-item">
                    <b>Likes: ${likes}</b>
                </p>
                <p class="info-item">
                    <b>Views: ${views}</b>
                </p>
                <p class="info-item">
                    <b>Comments: ${comments}</b>
                </p>
                <p class="info-item">
                    <b>Downloads: ${downloads}</b>
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
    })
    .catch (fetchError);
}

function fetchError(err) {
    console.log(err);
    Notify.failure('Oops! Something went wrong! Try reloading the page or select another cat breed!', paramsForNotify);
};
    





