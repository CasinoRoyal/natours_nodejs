import axios from 'axios';
import { showAlert } from './alerts';

export const getLogIn = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/users/login',
      data: {
        email,
        password
      }
    });
    
    if (res.data.status === 'success') {
      showAlert('success', 'You are log in');
      window.setTimeout(() => location.assign('/'), 5000);
    };
  } catch(err) {
    showAlert('error', err.response.data.message);
  };
};

export const getLogOut = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:3000/api/v1/users/logout',
    });
    
    if (res.data.status === 'success') {
      showAlert('success', 'You are log out');
      location.reload(true);
    };
  } catch(err) {
    showAlert('error', 'Something bad happened. Please, try again');
  };
};