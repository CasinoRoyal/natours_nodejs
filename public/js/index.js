import '@babel/polyfill';
import { displayMap } from './mapbox';
import { getLogIn, getLogOut } from './login';
import { updateUserSettings } from './update-user-settings';
import { bookTour } from './stripe';

const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const userDataForm = document.querySelector('.form-user-data');
const changePasswordForm = document.querySelector('.form-user-password');
const logOutBtn = document.querySelector('.nav__el--logout');
const tourBtn = document.getElementById('book-tour');

if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
};

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    getLogIn(email, password);
  });  
};

if (logOutBtn) {
  logOutBtn.addEventListener('click', getLogOut);
};

if (userDataForm) {
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    updateUserSettings(form, 'data');
  });
};

if (changePasswordForm) {
  changePasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const savePassBtn = changePasswordForm.querySelector('.btn');
    savePassBtn.textContent = '...updating';
    const currentPassword = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    
    await updateUserSettings(
      {currentPassword, password, passwordConfirm}, 
      'password'
    );

    savePassBtn.textContent = 'save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
};

if (tourBtn) {
  tourBtn.addEventListener('click', (e) => {
    e.target.textContent = 'Proccesing...';
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });
}