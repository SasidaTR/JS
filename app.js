const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const filmsContainer = document.querySelector('.films-container');

searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const searchTerm = searchInput.value.trim();
  if (searchTerm !== '') {
    searchFilms(searchTerm);
  } else {
    alert("Votre recherche est vide...");
  }
});

async function searchFilms(searchTerm) {
  const response = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&s=${searchTerm}`);
  const data = await response.json();
  if (data.Search) {
    displayFilms(data.Search);
  } else {
    alert("Aucun résultat n'a été trouvé");
    filmsContainer.innerHTML = '<p>Aucun résultat trouvé.</p>';
  }
}

function displayFilms(films) {
  filmsContainer.innerHTML = '';
  films.forEach((film) => {
    const filmBlock = document.createElement('div');
    filmBlock.classList.add('d-flex' ,'card', 'col-3', 'film-block', 'fade-in');
    // filmBlock.setAttribute('data-aos', 'fade-left');
    filmBlock.innerHTML = `
      <img src="${film.Poster}" class="card-img-top" alt="${film.Title}">
      <div class="card-body">
        <h5 class="card-title">${film.Title}</h5>
        <p class="card-text">Date de parution : ${film.Year}</p>
        <button type="button" class="btn btn-primary btn-read-more" data-toggle="modal" data-target="#filmModal" data-id="${film.imdbID}">Read More</button>
      </div>
    `;
    filmsContainer.appendChild(filmBlock);
  });

  // Add event listener for "Read More" buttons
  const readMoreButtons = document.querySelectorAll('.btn-read-more');
  readMoreButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const imdbID = button.getAttribute('data-id');
      displayFilmDetails(imdbID);
    });
  });
}

async function displayFilmDetails(imdbID) {
  const response = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${imdbID}`);
  const film = await response.json();
  const modalTitle = document.getElementById('filmModalLabel');
  const modalBody = document.querySelector('.modal-body');
  modalTitle.innerText = film.Title;
  modalBody.innerHTML = `
    <p>${film.Plot}</p>
    <p>Date de parution : ${film.Released}</p>
  `;
  $('#filmModal').modal('show');
  const closeButton = document.querySelector('[data-dismiss="modal"]');
  closeButton.addEventListener('click', () => {
    $('#filmModal').modal('hide');
  });
}

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible', 'fade-in');
      observer.unobserve(entry.target);
    } else {
      // Code à exécuter lorsque l'élément n'est pas en intersection (n'est pas visible)
      // Par exemple, vous pouvez ajouter une classe pour marquer qu'il ne doit pas être chargé
      entry.target.classList.add('not-visible');
    }
  });
}, {
  threshold: 1.0
});

const fadeIns = document.querySelectorAll('.fade-in');
fadeIns.forEach(fadeIn => {
  observer.observe(fadeIn);
});

