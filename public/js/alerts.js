const hideAlert = () => {
  const alertMsg = document.querySelector('.alert');
  if (alertMsg) alertMsg.parentElement.removeChild(alertMsg);
};

export const showAlert = (type, message) => {
  const alertMarkup = `<div class="alert alert--${type}">${message}</div>`;
  document.body.insertAdjacentHTML('afterbegin', alertMarkup);
  window.setTimeout(hideAlert, 3000);
};