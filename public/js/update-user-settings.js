import axios from 'axios';
import { showAlert } from './alerts';

export const updateUserSettings = async (data, type) => {
  const endPoint = type === 'password' ? 'update-password' : 'change-user-data';
  try {
    const res = await axios({
      method: 'PATCH',
      url: `http://127.0.0.1:3000/api/v1/users/${endPoint}`,
      data
    });

    if (res.data.status === 'success') {
      showAlert('success', `Your ${type.toUpperCase()} successfully updated`);
    };  
  } catch(err) {
    showAlert('error', err.response.data.message);
  };
}