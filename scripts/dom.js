// This file is a module that deals with modifying the DOM directly
// Import API requests and formatted responses
const api = require('./requests.js');

// Define the loader object (Material-style spinner) and its functions
let spinner = {
  // hide the spinner by calling dom.spinner.hide()
  hide: function() {
    document.getElementsByClassName('spinner')[0].style.display = 'none';
    return 0;
  },
  // show the spinner by calling dom.spinner.show()
  show: function() {
    document.getElementsByClassName('spinner')[0].style.display = 'block';
    return 0;
  }
}

// Define the function used for visually rendering project thumbs and titles
// The variable projectArray must be an array of project objects (most often returned by the API)
let renderProjects = (projectArray) => {
  // Loop over the project objects
  for (let i = 0; i < projectArray.length; i++) {
    // Set variables to be used in rendering
    let id = projectArray[i].id;
    let title = projectArray[i].title;
    let user = projectArray[i].user;
    // Create the parent div, which contains the image, title, and author
    let div = document.createElement('div');
    // Add the project class for styling
    div.classList.add('project');
    // Create the image element
    let img = document.createElement('img');
    // Add the project__img class for styling
    img.classList.add('project__img');
    // Set the image source to the thumbnail from the API request
    img.setAttribute('src', 'https://cdn2.scratch.mit.edu/get_image/project/' + id + '_480x360.png');
    // Place the image inside the div
    div.appendChild(img);
    // Create the second div for the title and author
    let divTwo = document.createElement('div');
    // Add the project__title class for styling
    divTwo.classList.add('project__title');
    // Input the HTML for the title and author
    divTwo.innerHTML = title + ' by <a href="#">' + user + '</a>';
    // Place the second div inside the first
    div.appendChild(divTwo);
    // Add the <mat-ripple> element for the Material ripple animation
    div.appendChild(document.createElement('mat-ripple'));
    // Place the original parent div inside the project rendering section (a div with the ID of "projects")
    document.getElementById('projects').appendChild(div);
    // Trigger event on click
    div.addEventListener('click', (event) => {
      // Prevent going to the top of the page
      event.preventDefault();
      // Open the project in a new window
      window.open('https://scratch.mit.edu/projects/' + id);
    })
  }
  // Hide the loader - notice how we don't need to prefix this function with "dom"
  spinner.hide();
  return 0;
}

// Initialize the tag scroller
// The scrollerEl variable must be a reference to a div
let scrollerInit = (scrollerEl) => {
  // Set the scroller options to the children of scrollerEl
  let scrollOptions = scrollerEl.childNodes;
  // Loop through each option
  for (let i = 0; i < scrollOptions.length - 1; i++) {
    // Trigger event on click
    scrollOptions[i].addEventListener('click', (event) => {
      // Prevent going to top of page
      event.preventDefault();
      // Check if the option is currently selected via the class
      if (scrollOptions[i].classList.contains('scroller__link--unselected')) {
        // If it is selected then loop through the options again
        for (let j = 0; j < scrollOptions.length - 1; j++) {
          // Make each option unselected
          scrollOptions[j].classList.replace('scroller__link--selected', 'scroller__link--unselected');
        }
        // Then set the desired option to be selected
        scrollOptions[i].classList.replace('scroller__link--unselected', 'scroller__link--selected');
        // Remove all projects from the project render div
        projects.destroy();
        // The following 5 if statements are for specific, non-tag options
        // If the selected option is the "Featured" option
        if (scrollOptions[i].innerText == 'Featured') {
          // Show the loader
          spinner.show();
          // Use the API request module to get featured projects
          api.projects.featured(0).then((data) => {
            // After the result has been recieved, render the projects
            projects.render(data);
            // Hide the loader
            spinner.hide();
          });
          // If the selected option is the "Top Loved" option
        } else if (scrollOptions[i].innerText == 'Top Loved') {
          // Show the loader
          spinner.show();
          // Use the API request module to get top loved projects
          api.projects.topLoved(0).then((data) => {
            // After the result has been recieved, render the projects
            projects.render(data);
            // Hide the loader
            spinner.hide();
          });
          // If the selected option is the "Trending" option
        } else if (scrollOptions[i].innerText == 'Trending') {
          // Show the loader
          spinner.show();
          // Use the API request module to get trending projects
          api.projects.trending(0).then((data) => {
            // After the result has been recieved, render the projects
            projects.render(data);
            // Hide the loader
            spinner.hide();
          });
          // If the selected option is the "Recent" option
        } else if (scrollOptions[i].innerText == 'Recent') {
          // Show the loader
          spinner.show();
          // Use the API request module to get recent projects
          api.projects.recent(0).then((data) => {
            // After the result has been recieved, render the projects
            projects.render(data);
            // Hide the loader
            spinner.hide();
          });
          // If the selected option is the "Messages" option
        } else if (scrollOptions[i].innerText == 'Messages') {
          // Show the loader
          spinner.show();
          // Open Scratch messages in a new window
          window.open('https://scratch.mit.edu/messages');
          // Hide the loader
          spinner.hide();
          // If the selected option is none of the above
        } else {
          // Show the loader
          spinner.show();
          // Use the API request module to get projects tagged with the value of the option's innerText
          api.projects.tagged(scrollOptions[i].innerText.toLowerCase(), 0).then((data) => {
            // After the result has been recieved, render the projects
            projects.render(data);
            // Hide the loader
            spinner.hide();
          });
        }
      }
    })
  }
}

// Define the project object and its functions
let projects = {
  // The rendering function
  render: renderProjects,
  // The destroy function
  destroy: function() {
    // When called, erase all content of the projects div
    document.getElementById('projects').innerHTML = "";
  }
}

// Define the scroller object and its functions
let scroller = {
  // The initialization function
  init: scrollerInit
}

// Set the orientation correctly
let orientation = () => {
  // Check if the screen orientation is landscape
  // We get this event from the Cordova device object
  if (screen.orientation.type.includes('landscape')) {
    // If so, fit two projects on the screen (left to right) via CSS
    document.getElementById('projects').style.gridTemplateColumns = "auto auto";
    document.getElementById('projects').style.gridColumnGap = "3%";
    // We also get this event from the Cordova device object
  } else if (screen.orientation.type.includes('portrait')) {
    // If so, fit only one project on the screen (left to right) via CSS
    document.getElementById('projects').style.gridTemplateColumns = "auto";
    document.getElementById('projects').style.gridColumnGap = "0";
  }
}

// Export all functions
module.exports = {
  projects: projects,
  spinner: spinner,
  scroller: scroller,
  setOrientation: orientation
};