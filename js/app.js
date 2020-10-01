// global variables
let employees = [];
const urlAPI = `https://randomuser.me/api/?results=12&inc=name, picture,
email, location, phone, dob &noinfo &nat=US`;
const gridContainer = document.querySelector('.grid-container');
const searchBar = document.getElementById('searchBar');
const overlay = document.querySelector('.overlay');
const modalContainer = document.querySelector('.modal-content');
const modalClose = document.querySelector('.modal-close');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

// ***********Search Bar********************

searchBar.addEventListener('keyup', (e) => {
  const searchString = e.target.value.toLowerCase();
  const profile = document.getElementsByClassName('card');

  for (let i = 0; i < profile.length; i++) {
    const employeeNames = document.querySelectorAll('.name');
    const name = employeeNames[i].innerText.toLowerCase();

    if (name.includes(searchString)) {
      profile[i].style.display = '';
    } else {
      profile[i].style.display = 'none';
    }
  }
});

// ****************** fetch data from API ****************

fetch(urlAPI)
  .then((res) => res.json())
  .then((res) => res.results)
  .then(displayEmployees)
  .catch((err) =>
    console.log('Sorry, directory did not load. Try refreshing the page')
  );

// ********** Display employee details**********************

function displayEmployees(employeeData) {
  employees = employeeData;
  console.log(employees);
  // store the employee HTML as we create it
  let employeeHTML = '';
  // loop through each employee and create HTML markup
  employees.forEach((employee, index) => {
    let name = employee.name;
    let email = employee.email;
    let city = employee.location.city;
    let picture = employee.picture;

    employeeHTML += `
    <div class="card" data-index="${index}">
    <img class="avatar" src="${picture.large}" />
    <div class="text-container">
    <h2 class="name">${name.first} ${name.last}</h2>
    <p class="email">${email}</p>
    <p class="address">${city}</p>
    </div>
    </div>
    `;
  });
  gridContainer.innerHTML = employeeHTML;
}

// ********** Display Modal **********************

gridContainer.addEventListener('click', (e) => {
  if (e.target !== gridContainer) {
    // select the card element based on its proximity to actual element
    const card = e.target.closest('.card');
    const index = card.getAttribute('data-index');
    displayModal(index);
  }
});

modalClose.addEventListener('click', () => {
  overlay.classList.add('hidden');
});

function displayModal(index) {
  // use object destructuring make our template literal cleaner
  let {
    name,
    dob,
    phone,
    email,
    location: { city, street, state, postcode },
    picture,
  } = employees[index];

  let date = new Date(dob.date);

  const modalHTML = `
    <img class="avatar" src="${picture.large}" />
    <div class="text-container">
        <h2 class="name">${name.first} ${name.last}</h2>
        <p class="email">${email}</p>
        <p class="address">${city}</p>
    <hr />
        <p>${phone}</p>
        <p class="address-m">${street.number} ${
    street.name
  }, ${state}, ${postcode} </p>
        <p>Birthday:
        ${date.getMonth()}/${date.getDate()}/${date.getFullYear()}</p>
    </div>
    `;

  overlay.classList.remove('hidden');
  modalContainer.innerHTML = modalHTML;
}

// *************** switch back and forth ******************

let currentIndex = 0;

nextBtn.addEventListener('click', (e) => {
  if (currentIndex < employees.length - 1) {
    currentIndex++;
    displayModal(currentIndex);
  }
});

prevBtn.addEventListener('click', () => {
  if (currentIndex > 0) {
    currentIndex--;
    displayModal(currentIndex);
  }
});
