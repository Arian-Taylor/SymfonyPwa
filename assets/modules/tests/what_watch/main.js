function initForm() {
    const form = document.getElementById("searchForm");
    const searchInput = document.getElementById("searchInput");
    const result = document.getElementById("result");

    let search = "";
    let movies = [];
    let ajax_get_creneau = null;

    const fetchMovies = async () => {
        // with fetch
        movies = await fetch(
            `https://api.themoviedb.org/3/search/movie?api_key=ed82f4c18f2964e75117c2dc65e2161d&query=${search}`
        ).then((res) => res.json());
        //console.log(movies);
    };

    const majResult = () => {
        if (!movies.results) {
            movies.results = [];
        }

        movies.results.length = 12;

        result.innerHTML = movies.results
            .map(
                (movie) =>
                `
                  <li>
                    <h2>${movie.original_title}</h2>
                    <div class="card-content">
                      <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}"></img>
                      <div class="infos">
                        <p>${movie.overview}</p>
                        <p>Popularité : ${movie.popularity} ⭐</p>
                      </div>
                    </div>
                  </li>
                `
            )
            .join("");

    };

    const majResultByFetch = async () => {
        await fetchMovies();
        majResult();
    };

    const majResultByAjax = (key) => {
        if (key) {
            search = key;
        }
        // With ajax
        if (ajax_get_creneau) {
            ajax_get_creneau.abort();
        }
        ajax_get_creneau = $.ajax({
            method: "GET",
            url: "https://api.themoviedb.org/3/search/movie",
            data: {
                api_key: "ed82f4c18f2964e75117c2dc65e2161d",
                query: search,
            },
        });
        ajax_get_creneau.always(function(result) {
            var { statusText = null } = result;
            if (statusText == "abort") {
                return false;
            }

            if (result) {
                movies = result;
            } else {
                movies = [];
            }
            majResult();
        });
    };

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        search = searchInput.value;
        //majResultByFetch();
        majResultByAjax();
    });

    // load default search
    majResultByAjax("Mission impossible")
}

function main() {
    initForm();
}

export { main };