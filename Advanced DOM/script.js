'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};
btnsOpenModal.forEach(openButton => openButton.addEventListener('click',openModal))


btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});
/////////////////////////////
///////////////////////////
///////////////////////////
const allSections = document.querySelectorAll('.section');
console.log(allSections)
const allButtons = document.getElementsByTagName('button')
console.log(allButtons )

//insert and create
//.insertAdjacentHTML
const message = document.createElement('div')
message.classList.add('cookie-message')
message.textContent = 'We use cookies to improve our use experience and for analytics.'
message.innerHTML = `We use cookies to improve our use experience and for analytics. <button class = btn btn--close-cookie>GOT IT </button>`
