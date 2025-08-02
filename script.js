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
// Nav bar
const nav = document.querySelector(".nav");
const navHeigth = nav.getBoundingClientRect().height; // nav height in px relative to the viewport
const navLinks = document.querySelector(".nav__links");
// Tabbed components
const tabs = document.querySelectorAll(".operations__tab");
const tabsContainer = document.querySelector(".operations__tab-container");
const tabsContent = document.querySelectorAll(".operations__content");
// Intersection Observer constants
const header = document.querySelector(".header");
const allSections = document.querySelectorAll("section");
// Lazy loading images
const imgTargets = document.querySelectorAll("img[data-src]");
// Slider
const slider = document.querySelector(".slider");
const slides = document.querySelectorAll(".slide");
const btnLeft = document.querySelector(".slider__btn--left");
const btnRight = document.querySelector(".slider__btn--right");
const dotContainer = document.querySelector(".dots");
let currentSlideIndex = 0; // index of the image currently displaying in the slider
const maxSlide = slides.length; // number of images in the slider
// Create Slider Constructor
const sliderObject = new Slider();
sliderObject.init(); // initializes Slider methods
/************************************************************************** Intersection Observer Objects **********************************************************/
// Nav Intersection Object
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null, // target = viewport 
  threshold: 0, // event is triggered when reached the 0% of the intersectionRatio
  rootMargin: `-${navHeigth}px`, // the height of the nav is added as margin on top of the threshold
});
headerObserver.observe(header);
// Sections Intersection Object
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null, 
  threshold: 0.15, 
});
// Links Intersection Object
const linkObserver = new IntersectionObserver(linksColor, {
  root: null,
  threshold: 0.25,
});
// Lazy image Intersection Object
const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
   threshold: 0,
   rootMargin: "200px", // the effect fires before the user can notice it
});
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
// attach the event listener to the nav bar
// nav.addEventListener("mouseover", (event) => fadeMenu(event, 0.5)); // without bind
nav.addEventListener("mouseover", fadeMenu.bind(0.5));
nav.addEventListener("mouseout",  fadeMenu.bind(1)); // bind return a new function which it will return 'this' = 1 in this case
// attach observers to all the sections
allSections.forEach(section => attachObserver(section));
// attach observer to all the imgTargets
imgTargets.forEach(img => imgObserver.observe(img));
// attach the event listener to the slide right button
btnRight.addEventListener("click", sliderObject.slideRight.bind(sliderObject));
// // attach the event listener to the slide left button
btnLeft.addEventListener("click", sliderObject.slideLeft.bind(sliderObject));
// attach the event listener to the slide buttons for a key pressed
document.addEventListener('keydown', sliderObject.slideKeyPressed.bind(sliderObject));
// attach the event listener to the dot buttons
dotContainer.addEventListener("click", sliderObject.dotSliding.bind(sliderObject));
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

/**
 * Fade the navigation bar when hovering over it.
 * The 'this' is binded to the opacity value according to the mouse event, see Event handlers.
 * @param {Object} event - PointerEvent returned from the nav event listener (mouseover and mouseout)
 */
function fadeMenu(event) {
  if (event.target.classList.contains("nav__link")) {
    // Select all elements in the nav bar
    const link = event.target;
    const siblings = nav.querySelectorAll(".nav__link");
    const logo = nav.querySelector(".nav__logo");

    // Fade the elements
    siblings.forEach(element => {
      if (element !== link) element.style.opacity = this;
    });
    logo.style.opacity = this;
  };
};

/**
 * Make the navigation bar sticky after scrolling past the header section
 * @param {Object} entries - IntersectionObserverEntry returned from the IntersectionObserver
 */
function stickyNav(entries) {
  const [entry] = entries; // take the first element of entries
  if (!entry.isIntersecting) nav.classList.add("sticky"); // when the observer is not intersecting with the header
  else nav.classList.remove("sticky"); // when the observer is intersecting with the header
};

/**
 * Display the sections once they are scrolled into view.
 * @param {Object} sections - IntersectionObserverEntry returned from the forEach
 * @param {Object} observer - IntersectionObserver returned from the forEach
 * @returns null
 */
function revealSection(sections, observer) {
  sections.forEach(section => {

  if (!section.isIntersecting) return;
  section.target.classList.remove("section--hidden"); // show the section
  observer.unobserve(section.target); // remove the observer once the section is intersected
  });
};

/**
 * Change the color of the links according to the corresponding intersected section
 * @param {Object} sections - IntersectionObserverEntry returned from the forEach
 */
function linksColor(sections) {
  sections.forEach(section => {
    const sectionId = section.target.id;
    const link = document.querySelector(`.nav__link[href="#${sectionId}"]`);
    // when a section is intersected
    if (section.isIntersecting) {
      // if the link is not the open account button, then change the color for the corresponding link
      if (!link.classList.contains("nav__link--btn")) link.style.color = "var(--color-primary)";
    }
    else link.style.color = ""; // restore the default color
  });
};

/**
 * Hide all sections and attach 2 observers, 1 to each section to reveal 
 * the sections and 1 to change the nav links color, as sections are intersected.
 * @param {Object} section - HTML section element
 */
function attachObserver(section) {
  section.classList.add("section--hidden");
  sectionObserver.observe(section);
  linkObserver.observe(section);
};

/**
 * Remove the blur filter from the image as they are intersected and change the 
 * image src from low to high resolution (path stored in data-src).
 * @param {Object} entry - IntersectionObserverEntry returned from the forEach
 * @param {Object} observer - IntersectionObserver returned from the forEach
 * @returns 
 */
function loadImg(entry, observer) {
  const [image] = entry;
  if (!image.isIntersecting) return;
  // Replace src with data-src -> initially src = low res, data-src = high res
  image.target.src = image.target.dataset.src;
  // Remove the 'lazy-img' class only when the loading of the image is complete
  // to avoid showing the low resolution image that was initially assigned to src
  image.target.addEventListener("load", ()=> image.target.classList.remove("lazy-img"));
  observer.unobserve(image.target); // remove the observer once the image is loaded
};

/** Slider Constructor Object */
function Slider() {
  /** Initialize the slider */
  this.init = function() {
    this.createDot();
    this.goToSlide();
  };

  /** Create dot elements */
  this.createDot = function() {
    slides.forEach((_, index)=> {
      dotContainer.insertAdjacentHTML("beforeend", `<button class="dots__dot" data-slide="${index}"></button>`)})
  };

  /** Add the active class corresponding to the image is currently displaying */
  this.activeDot = function() {
    let dotIndex;
    const active = "dots__dot--active";
    document.querySelectorAll(".dots__dot").forEach(dot => {
      dotIndex = Number(dot.dataset.slide);
      dotIndex === currentSlideIndex ? dot.classList.add(active) : dot.classList.remove(active);
    });
  };

  /**
   * Slide the current image to the corresponding dot selected
   * @param {Object} event - IntersectionObserverEntry returned from the dotContainer listener
   * @returns null
   */
  this.dotSliding = function(event) {
    if (!event.target.classList.contains("dots__dot")) return;
    // assign the dataset number from the clicked dot to the currentSlideIndex
    currentSlideIndex = Number(event.target.dataset.slide);
    // slide the current image to the current selected
    this.goToSlide();
  };

  /** Move the slides with translateX. Each image is moved at position 100 * (image index - index of the image to show), accordingly */
  this.goToSlide = function() {
    slides.forEach((slide, index)=> slide.style.transform = `translateX(${100 * (index - currentSlideIndex)}%)`);
    this.activeDot();
  };

  /** Move the slides to the left */
  this.slideLeft = function() {
    if (currentSlideIndex === 0) currentSlideIndex = maxSlide -1;
    else currentSlideIndex --; // Increment the image index to display   
    // move all the images accordingly to the currentSlideIndex
    this.goToSlide();
  };

  /** Move the slide to the right */
  this.slideRight = function() {
    if (currentSlideIndex === maxSlide -1) currentSlideIndex = 0;
    else currentSlideIndex ++; // Increment the image index to display   
    // move all the images accordingly to the currentSlideIndex
    this.goToSlide();
  };

  /** Slide images to the left or right accordingly when pressed the left or right keyboard button */
  this.slideKeyPressed = function(event) {
    if (event.key === "ArrowLeft") this.slideLeft(); // with if statement
    event.key === "ArrowRight" && this.slideRight(); // with short circuiting
  };
};