function scrollToSection(sectionId) {
    if (sectionId === 'consultation') {
        loadConsultationPage();
    } else {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
        closeMenu();
    }
}

function loadConsultationPage() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'consultation.html', true);

    xhr.onload = function () {
        if (xhr.status === 200) {
            document.body.innerHTML = xhr.responseText;
        }
    };

    xhr.send();
}

function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('show');
}

function closeMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.remove('show');
}


// Selecting the contact form and its input elements
const contactForm = document.querySelector('.contact-form');
const nameInput = contactForm.querySelector('input[type="text"]');
const emailInput = contactForm.querySelector('input[type="email"]');
const messageInput = contactForm.querySelector('textarea')

const getMapBtn = document.querySelector('#map_button') // get map button

//map box
const map = document.querySelector('#map')

// Adding a submit event listener to the form
contactForm.onsubmit =(event) =>{
  event.preventDefault()  
   // Example data to send in the request
    const requestData = {
        "message": messageInput.value,
        "name": nameInput.value,
        "email": emailInput.value 
    };

    // Make a POST request to the API endpoint to send email 
    fetch('https://clients-website-api.vercel.app/send_email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
    })
    .then(response => response.json())
    .then(data => {
        alert('Thanks for your feedback!')
        // Handle the response as needed
    })
    .catch((error) => {
        console.error('Error:', error);
        // Handle errors
    });  
};

function get_map(lat,lon){
var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({
  "latitude": lat,
  "longitude": lon
});

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch("https://clients-website-api.vercel.app/locate", requestOptions)
  .then(response => response.text())
  .then(result =>{
    result = JSON.parse(result)
    map.innerHTML = result.message.location
  })
  .catch(error => console.log('error', error));
}

getMapBtn.onclick = () => {
  try {

  navigator.geolocation.getCurrentPosition(function(position) {

    let lat = position.coords.latitude;
    let lon = position.coords.longitude;

    // Pass location to function 
    get_map(lat, lon);

  });

} catch (error) {

  // Catch any errors
  let message;
  
  switch(error.code) {
    case error.PERMISSION_DENIED:
      message = "User denied the request for Geolocation.";
      break;
    case error.POSITION_UNAVAILABLE:
      message = "Location information is unavailable.";
      break;
    case error.TIMEOUT:
      message = "The request to get user location timed out.";
      break;
    case error.UNKNOWN_ERROR:
    default: 
      message = "An unknown error occurred.";  
  }

  alert(message);

}
}

    function toggleMenu() {
        var nav = document.querySelector('nav');
        nav.style.display = (nav.style.display === 'none' || nav.style.display === '') ? 'flex' : 'none';
    }
