import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.form');

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const delay = Number(form.elements.delay.value);
  const state = form.elements.state.value;

  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state === 'fulfilled') {
        resolve(delay);
      } else {
        reject(delay);
      }
    }, delay);
  });

  promise
    .then((delayValue) => {
      iziToast.show({
        title: 'Success',
        message: `✅ Fulfilled promise in ${delayValue}ms`,
        color: 'green',
        position: 'topRight',
      });
      console.log(`✅ Fulfilled promise in ${delayValue}ms`);
    })
    .catch((delayValue) => {
      iziToast.show({
        title: 'Error',
        message: `❌ Rejected promise in ${delayValue}ms`,
        color: 'red',
        position: 'topRight',
      });
      console.log(`❌ Rejected promise in ${delayValue}ms`);
    });

  form.reset();
});
