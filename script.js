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
// ul nav links
const navLinks = document.querySelector(".nav__links");
// Tabbed components
const tabs = document.querySelectorAll(".operations__tab");
const tabsContainer = document.querySelector(".operations__tab-container");
const tabsContent = document.querySelectorAll(".operations__content");
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

// attach the event listener to the ul nav links
navLinks.addEventListener("click", smoothScroll);

// attach the event listener to the parent container of the tabs
tabsContainer.addEventListener("click", showTabsContent);
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
function sectionOneScroll(event) {
  section1.scrollIntoView({behavior: "smooth"});
};

/**
 * Implements smooth scrolling for navigation links. An event listener is attached 
 * to the parent element with the class nav__link. When a link is clicked, the target 
 * section is identified dynamically, and the page scrolls smoothly to that section.
 * @param {Object} event - PointerEvent returned from navLinks event listener 
 */
function smoothScroll(event) {
  event.preventDefault();
  // since the event listener is attached to the all bar, we need to make sure
  // the click is generated within the link itself, and not in the space within links
  if (event.target.classList.contains("nav__link")) {
    // event.target = where the event happens
    const id = event.target.getAttribute("href");
    document.querySelector(id).scrollIntoView({behavior: "smooth"});
  };
};

/**
 * Show the tab content according to the clicked tab button
 * @param {Object} event - PointerEvent returned from tabsContainer event listener 
 * @returns null
 */
function showTabsContent(event) {
  // select the tab whenever the user click the tab itself or the span within it.
  const tabClicked = event.target.closest(".operations__tab");
  if (!tabClicked) return; // avoid returning null when clicking nearby the tab

  // remove the active class
  tabs.forEach(tab => tab.classList.remove("operations__tab--active")); 
  tabsContent.forEach(tabContent => tabContent.classList.remove("operations__content--active")); 

  // add the active class
  tabClicked.classList.add("operations__tab--active"); 
  document.querySelector(`.operations__content--${tabClicked.dataset.tab}`).classList.add("operations__content--active");
};
