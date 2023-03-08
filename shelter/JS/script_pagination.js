// let CARDS = document.querySelectorAll('.card');
const PAGINATOR = document.querySelector('.cards-box');
const BTN_PAGE = document.querySelector('.paginator-page');
const BTN_LEFT = document.querySelector('.paginator-left');
const BTN_RIGHT = document.querySelector('.paginator-right');
const BTN_START = document.querySelector('.paginator-start');
const BTN_FINISH = document.querySelector('.paginator-finish');

BTN_LEFT.addEventListener('click', pageLeft);
BTN_RIGHT.addEventListener('click', pageRight);
BTN_START.addEventListener('click', pageStart);
BTN_FINISH.addEventListener('click', pageFinish);

import { showModalWindowEvent } from '../JS/script_popup.js';

// import cardBase from "../../base/pets_base.json"; //browser doesn't support
// import cardBase from "../../base/pets_base.json" assert { type: "json" }; //linter doesn't support

const response = await fetch('../../base/pets_base.json');
const cardBase = await response.json();

function pageLeft() {
  if (currentPage == 1) return;
  currentPage--;

  closeCard();

  document.querySelectorAll('.card')[document.querySelectorAll('.card').length - 1].addEventListener('animationend', () => {
    //maybe change when the last card animated?
    PAGINATOR.innerHTML = '';
    PAGINATOR.innerHTML = listOfPages[currentPage - 1].join('');
    BTN_PAGE.innerHTML = currentPage;
    BTN_RIGHT.classList.add('navigation-button_active');
    BTN_FINISH.classList.add('navigation-button_active');
    if (currentPage == 1) {
      BTN_LEFT.classList.remove('navigation-button_active');
      BTN_START.classList.remove('navigation-button_active');
    }
    showModalWindowEvent();

    openCard();
  });
}

function pageStart() {
  if (currentPage == 1) return;
  currentPage = 1;

  closeCard();

  document.querySelectorAll('.card')[document.querySelectorAll('.card').length - 1].addEventListener('animationend', () => {
    PAGINATOR.innerHTML = '';
    PAGINATOR.innerHTML = listOfPages[currentPage - 1].join('');
    BTN_PAGE.innerHTML = currentPage;
    BTN_LEFT.classList.remove('navigation-button_active');
    BTN_START.classList.remove('navigation-button_active');
    BTN_RIGHT.classList.add('navigation-button_active');
    BTN_FINISH.classList.add('navigation-button_active');
    showModalWindowEvent();

    openCard();
  });
}

function pageRight() {
  if (currentPage == listOfPages.length) return;
  BTN_LEFT.classList.add('navigation-button_active');
  BTN_START.classList.add('navigation-button_active');
  currentPage++;

  closeCard();

  document.querySelectorAll('.card')[document.querySelectorAll('.card').length - 1].addEventListener('animationend', () => {
    PAGINATOR.innerHTML = '';
    PAGINATOR.innerHTML = listOfPages[currentPage - 1].join('');
    BTN_PAGE.innerHTML = currentPage;
    if (currentPage == listOfPages.length) {
      BTN_RIGHT.classList.remove('navigation-button_active');
      BTN_FINISH.classList.remove('navigation-button_active');
    }
    showModalWindowEvent();

    openCard();
  });
}

function pageFinish() {
  if (currentPage == listOfPages.length) return;
  currentPage = listOfPages.length;

  closeCard();

  document.querySelectorAll('.card')[document.querySelectorAll('.card').length - 1].addEventListener('animationend', () => {
    PAGINATOR.innerHTML = '';
    PAGINATOR.innerHTML = listOfPages[currentPage - 1].join('');
    BTN_PAGE.innerHTML = currentPage;
    BTN_LEFT.classList.add('navigation-button_active');
    BTN_START.classList.add('navigation-button_active');
    BTN_RIGHT.classList.remove('navigation-button_active');
    BTN_FINISH.classList.remove('navigation-button_active');
    showModalWindowEvent();

    openCard();
  });
}

function closeCard() {
  let stepTimer = 0;
  document.querySelectorAll('.card').forEach((item) => {
    setTimeout(function () {
      item.classList.add('card_close-flip');
    }, stepTimer);
    stepTimer += 50;
  });
}

function openCard() {
  let stepTimer = 0;
  document.querySelectorAll('.card').forEach((item) => {
    item.classList.add('card_close');
    setTimeout(function () {
      item.classList.add('card_open-flip');
      item.addEventListener('animationend', removeAnimation);

      function removeAnimation() {
        item.classList.remove('card_open-flip');
        item.classList.remove('card_close-flip');
        item.removeEventListener('animationend', removeAnimation);
        item.classList.remove('card_close');
      }
    }, stepTimer);
    stepTimer += 50;
  });
}

const listOfPages = [];
let currentPage = 1;

BTN_PAGE.innerHTML = currentPage;

//GENERATE PAGES. SHOW FIRST PAGE-----------------------------------------------
if (window.matchMedia('(min-width: 1024px)').matches) {
  PAGINATOR.innerHTML = generateMatrixOfCards(8)[0].join('');
}
if (window.matchMedia('(max-width: 1023px) and (min-width: 750px)').matches) {
  PAGINATOR.innerHTML = generateMatrixOfCards(6)[0].join('');
}
if (window.matchMedia('(min-width: 320px) and (max-width: 749px)').matches) {
  PAGINATOR.innerHTML = generateMatrixOfCards(3)[0].join('');
}
showModalWindowEvent();
//------------------------------------------------------------------------------

function generateMatrixOfCards(cardsOnPage) {
  const listOfCards = [];
  const numberOfCards = 48;
  const numberOfPages = Math.ceil(numberOfCards / cardsOnPage);

  // Generate cards
  let cardCounter = 0;
  for (let i = 0; i < numberOfCards; i++) {
    if (cardCounter == 8) cardCounter = 0;
    let nameOfPet = cardBase[cardCounter].name;
    let imageOfPet = cardBase[cardCounter].img;
    listOfCards.push(`<div class="card"><img src="${imageOfPet}" alt=""><p>${nameOfPet}</p><a class="card__button">Learn more</a></div>`);
    cardCounter++;
  } //Can be optimized. Generate half of array and then add copy//!!!!!!!!

  // Generate pages
  for (let currPage = 1; currPage <= numberOfPages; currPage++) {
    let trimStart = (currPage - 1) * cardsOnPage;
    let trimEnd = trimStart + cardsOnPage;
    listOfPages[currPage - 1] = listOfCards.slice(trimStart, trimEnd);
  }

  //Shuffle pages
  for (let i = 0; i < numberOfPages; i++) {
    shuffle(listOfPages[i]);
  }

  //Shuffle cards
  shuffle(listOfPages);

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  // showModalWindowEvent(); //doesn't work
  // CARDS = document.querySelectorAll('.card'); //addEvent click every time after generation

  return listOfPages;
}
