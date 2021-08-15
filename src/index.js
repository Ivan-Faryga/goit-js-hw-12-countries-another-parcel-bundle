import './sass/main.scss';

//================ imports ==========================

import { fetchCountries } from './js/fetch-countries.js';
import { error } from '@pnotify/core/dist/PNotify.js';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import debounce from 'lodash.debounce';
import countryCardTpl from './templates/country-card.hbs';
import countryListTpl from './templates/country-list.hbs';
import getRefs from './js/get-refs.js';

const refs = getRefs();

// ==============event listener ==================

refs.input.addEventListener('input', debounce(onFilledInput, 500));

// ======================== main function

function onFilledInput(event) {
  refs.output.innerHTML = '';
  const inputData = event.target.value;

  if (!inputData) {
    return;
  }
  fetchCountries(inputData)
    .then(country => cardsRenderHandler(country))
    .catch(() =>
      error({
        delay: 5000,
        text: 'unfortunately, there is no such country in base, please try again',
      }),
    );
}
//====================== render functions =============================

function renderCountryCard(country) {
  const markup = countryCardTpl(...country);
  refs.output.innerHTML = markup;
}

function renderCountryList(countries) {
  const renderList = countries.map(country => countryListTpl(country)).join('');
  refs.output.innerHTML = `<ul class="countries-list">${renderList}</ul>`;
}

function onListItemClick(event, countries) {
  countries.forEach(country => {
    if (country.name === event.target.textContent) {
      refs.input.value === event.target.textContent;
      renderCountryCard(country);
      refs.output.innerHTML = '';
    }
  });
}

function cardsRenderHandler(country) {
  if (country.length === 1) {
    renderCountryCard(country);
  }
  if (country.length > 1 && country.length <= 10) {
    renderCountryList(country);
    refs.output.addEventListener('click', onListItemClick(e, country));
  }
  if (country.length > 10) {
    error({
      delay: 10000,
      text: 'More than 10 countries were found at your request, please provide more specific query',
    });
  }
}
