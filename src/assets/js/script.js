import '../css/style.css'


// https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=73368105b34aeee387a43b668a46b4b0
const apiKey = '73368105b34aeee387a43b668a46b4b0'
const pathMoviesPopularity = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc'
const API_URL = `${pathMoviesPopularity}&api_key=${apiKey}&page=1`

const IMG_SIZE = 'https://image.tmdb.org/t/p/w200'

const pathSearch = 'https://api.themoviedb.org/3/search/movie?'
const SEARCH_URL = `${pathSearch}&api_key=${apiKey}&query="`

const content = document.getElementById('content'),
form = document.getElementById('form'),
search = document.getElementById('search')

// Get initial movies
getMovies(API_URL)

async function getMovies(url) {
    const res = await fetch(url)
    const data = await res.json()

    const len = data.total_pages
    let page = data.page

    showMovies(data.results)
}

function showMovies(movies) {

    content.innerHTML = ''

    if (movies.length === 0) {

        const nonResults = createEl('div', 'no_results', content)
        nonResults.textContent = 'No Results...'
    }

    movies.forEach((movie) => {
        const { title, poster_path, vote_average, overview } = movie

        const movieEl = createEl('div', 'movie', content),
        movieImage = createEl('div', 'movie_image', movieEl),
        movieInfo = createEl('div', 'movie_info', movieEl),
        titleMovieInfo = createEl('h3', 'title_info', movieInfo),
        rating = createEl('span', 'green', movieInfo),
        overviewMovies = createEl('div', 'overview', movieEl),
        descriptionOverview = createEl('p', 'description', overviewMovies)

        if (poster_path !== null) {
            const img = createEl('img', 'image', movieImage)
            img.src = `${IMG_SIZE}${poster_path}`
        } 
        else {
            movieImage.style.backgroundColor = '#000000'
            movieImage.textContent = 'No photo'.toUpperCase(0)
        }
        
        titleMovieInfo.textContent = title

        rating.innerHTML = validVoteAverage(vote_average)
        validateColorRating(rating, vote_average)

        

        descriptionOverview.textContent = validateDescription(overview)
    });
}

form.addEventListener('submit', (event) => {
    event.preventDefault()

    const searchTerm = search.value

    if (searchTerm && searchTerm !== '') {
        getMovies(SEARCH_URL + searchTerm)

        search.value = ''
    } else {
        window.location.reload()
    }
})

function validVoteAverage(vote_average) {
    const desc = [] 
    desc.push(vote_average.toString().split('.'))

    const len = desc[0].length
    const src = []
    src[0] = desc[0][0]
    src[1] = desc[0][1]
    if (len === 1) {
        src[1] = '0'
    }
    return src.join('.')
}

function validateColorRating(rating, vote_average) {
    const num = Number.parseInt(vote_average)
    if (num < 4) {
        rating.classList.remove('green')
        rating.classList.add('red')
    } else if (num >= 4 && num <= 5) {
        rating.classList.remove('green')
        rating.classList.add('orange')
    }
}

function validateDescription(overview) {
    const desc = overview.split(' ')
    const src = []

    for (let i = 0; i < 20; i++) {
        src.push(desc[i])
    }

    return `${src.join(' ')}...`
}

function createEl(element, className, parent) {

    const el = document.createElement(element)
    el.classList.add(className)
    parent.appendChild(el)

    return el
}