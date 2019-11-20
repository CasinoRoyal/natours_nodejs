import axios from 'axios';
import { showAlert } from './alerts';


export const bookTour = async (tourId) => {
const stripe = Stripe('pk_test_aCysFaE4TPSgOWvqNDa25ORN00AAnSaNRV');
  try {
    const session = await axios(
      `/api/v1/booking/checkout-session/${tourId}`
    );

    console.log(session);
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch(err) {
      console.log(err);
      showAlert('error', err)
  }
}