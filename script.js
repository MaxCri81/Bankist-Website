'use strict';
/***************************************************************************** Declarations ****************************************************************************/
// Modal window
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
// Smooth scrolling
const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.getElementById("section--1");

/**************************************************************************** Event handlers ************************************************************************/
// attach the event listener to the 2 buttons 'btn--show-modal'
btnsOpenModal.forEach(button => button.addEventListener('click', openModal));

// attach the event listener to the close button in the modal window
btnCloseModal.addEventListener('click', closeModal);

// attach the event listener to hide the overlay background
overlay.addEventListener('click', closeModal);

// attach the event listener to the all page for a key pressed
document.addEventListener('keydown', closeModalEscape);

// attach the event listener to the Learn more button
btnScrollTo.addEventListener("click", sectionOneScroll);
/********************************************************************************* Functions ***************************************************************************/
/**
 * When 'Escaped' key is pressed closeModal is called.
 * @param {Object} event - PointerEvent returned from document event listener 
 */
function closeModalEscape(event) {
  // if the key Escape is pressed and the modal window doesn't have the class hidden
  // (meaning the modal window is shown) then the closeModalWindow function is called
  if (event.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  };
};
/**
 * Open the modal window and shows the overlay class
 * @param {Object} event - PointerEvent returned from btnsOpenModal event listener 
 */
function openModal(event) {
  event.preventDefault(); // prevent the default behaviour of the anchor tag with # to jump at the beginning of the page
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

/** Close the modal window and hide the overlay class */
function closeModal() {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

/** Scroll the page to section 1 with smooth behaviour */
function sectionOneScroll() {
  section1.scrollIntoView({behavior: "smooth"});
};


