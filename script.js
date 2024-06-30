'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Ali Mashaee',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jane Doe',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////

// Functions
const dateFormatter = function (date) {
  const day = `${date.getDate()}`.padStart(2, 0);
  const month = `${date.getMonth() + 1}`.padStart(2, 0);
  const year = `${date.getFullYear()}`;
  const hours = `${date.getHours()}`.padStart(2, 0);
  const minutes = `${date.getMinutes()}`.padStart(2, 0);
  const seconds = `${date.getSeconds()}`.padStart(2, 0);
  const formattedDate = `${day}/${month}/${year},   ${hours}:${minutes}:${seconds}`;
  return formattedDate;
};

const displayMovement = function (acc, sort = false) {
  const movementsDateFormatter = function (date) {
    const calcDaysPassed = (date1, date2) =>
      Math.abs((date1 - date2) / (1000 * 60 * 60 * 24));
  };
  const option = {
    hour: 'numeric',
    minute: 'numeric',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    // weekday: 'long',
  };

  containerMovements.innerHTML = '';
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  const now = new Date();
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(acc.movementsDates[i]);
    const formattedMov = new Intl.NumberFormat(acc.locale, {
      style: 'currency',
      currency: acc.currency,
    }).format(Math.abs(mov));
    const formattedDate = movementsDateFormatter(date);
    let daysPassed;
    if (formattedDate === 0) daysPassed = 'Today';
    if (formattedDate === 1) daysPassed = 'Yesterday';
    if (formattedDate <= 7) daysPassed = `${daysPassed} days ago`;
    else {
      daysPassed = new Intl.DateTimeFormat(currentAcc.locale, option).format(
        date
      );
    }
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
    <div class="movements__date">${daysPassed}</div>
      <div class="movements__value">${formattedMov}</div>
    </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
// displayMovement(account1.movements);

// Create user names
const createUsername = function (accs) {
  accs.forEach(
    acc =>
      (acc.userName = acc.owner
        .toLowerCase()
        .split(' ')
        .map(name => name.at(0))
        .join(''))
  );
};
createUsername(accounts);

const calcPrintBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = `${new Intl.NumberFormat(acc.locale, {
    style: 'currency',
    currency: acc.currency,
  }).format(acc.balance)}`;
};

const calcDisplaySummary = function (acc) {
  const option = {
    style: 'currency',
    currency: acc.currency,
  };
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${new Intl.NumberFormat(acc.locale, option).format(
    incomes
  )}`;
  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${new Intl.NumberFormat(acc.locale, option).format(
    out
  )}`;
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(mov => mov * (acc.interestRate / 100))
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${new Intl.NumberFormat(
    acc.locale,
    option
  ).format(interest)}`;
};

// Update UI function
const updateUI = function (acc) {
  displayMovement(currentAcc);
  calcPrintBalance(currentAcc);
  calcDisplaySummary(currentAcc);
};

// Implementing the login
let currentAcc;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAcc = accounts.find(acc => acc.userName === inputLoginUsername.value);

  if (currentAcc?.pin === Number(inputLoginPin.value)) {
    // Display UI and massage
    labelWelcome.textContent = `Welcome back, ${currentAcc.owner.slice(
      0,
      currentAcc.owner.indexOf(' ')
    )}`;
    containerApp.style.opacity = '1';
    updateUI(currentAcc);

    // Date
    const now = new Date();
    const option = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      // weekday: 'long',
    };

    // const language = navigator.language; // My system language is en-US
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAcc.locale,
      option
    ).format(now);

    // Clear input fields
    inputLoginUsername.value = '';
    inputLoginPin.value = '';
    inputLoginPin.blur();

    const timer = function () {
      let time = 300;

      setInterval(function () {
        const min = String(Math.trunc(time / 60)).padStart(2, 0);
        const sec = String(time % 60).padStart(2, 0);
        labelTimer.textContent = `${min}:${sec}`;
        if (time === 0) {
          labelWelcome.textContent = 'Log in to get started';
          containerApp.style.opacity = '0';
        }
        time--;
      }, 1000);
    };
    timer();
  }
});

// Implementing transfer
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const date = new Date();

  // Reciving data
  const transferTo = accounts.find(
    acc => acc.userName === inputTransferTo.value
  );
  const transferAmount = Number(inputTransferAmount.value);
  if (
    transferAmount > 0 &&
    transferTo &&
    currentAcc.balance >= transferAmount &&
    transferTo.userName !== currentAcc.userName
  ) {
    // Withdrawal to current account
    currentAcc.movements.push(transferAmount * -1);
    transferTo.movements.push(transferAmount);
    currentAcc.movementsDates.push(date);
    transferTo.movementsDates.push(date);
    updateUI(currentAcc);

    // Deposit to destination account
  }
  // Cleaning the inputs
  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferAmount.blur();
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAcc.userName &&
    Number(inputClosePin.value) === currentAcc.pin
  ) {
    // Find index
    const index = accounts.findIndex(
      acc => acc.userName === currentAcc.userName
    );

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  // Clear the input foelds
  inputCloseUsername.value = '';
  inputClosePin.value = '';
});

// Implementing loan
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const date = new Date();

  const loanAmount = Number(inputLoanAmount.value);
  if (
    loanAmount > 0 &&
    currentAcc.movements.some(mov => mov >= loanAmount * 0.1)
  ) {
    setTimeout(function () {
      currentAcc.movements.push(loanAmount);
      currentAcc.movementsDates.push(date);
      updateUI(currentAcc);
    }, 2500);
  }
  inputLoanAmount.value = '';
  inputLoanAmount.blur();
});

// sort movements
let isSorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovement(currentAcc.movements, !isSorted);
  isSorted = !isSorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// console.log(0.1 + 0.2);

// // Converting to number (Cleaner)
// console.log(+'455');

// // Parsing
// console.log(Number.parseInt('2002Ali')); // Returns 2002 in number type
// console.log(Number.parseFloat('2.5rem'));

// // Checking if the value is a number or not

// console.log(Number.isNaN(22)); // F
// console.log(Number.isNaN('22')); // F
// console.log(Number.isNaN(+'22px')); // T
// console.log(Number.isNaN(23 / 0)); // F (The resault will be infinite)

// // Better way of checking
// console.log(Number.isFinite(22)); // T
// console.log(Number.isFinite('22')); // F

// // Math namespace
// console.log(Math.sqrt(25));
// console.log(25 ** (1 / 2));

// console.log(Math.cbrt(8));
// console.log(8 ** (1 / 3));

// console.log(Math.max(1, 3, 5, 9, 7, 56, 40));
// console.log(Math.min(1, 3, 5, 9, 7, 56, 40));

// // Creating a random number in a specefic range
// console.log('random f()');
// const randomInt = (max, min) =>
//   Math.floor(Math.random() * (max - min) + 1) + min;

// console.log(randomInt(20, 40));

// // Rounding integers
// console.log('round');
// console.log(Math.round(23.4));
// console.log(Math.round(23.5));

// console.log('ceil');
// console.log(Math.ceil(23.4));
// console.log(Math.ceil(23.5));

// console.log('floor');
// console.log(Math.floor(23.4));
// console.log(Math.floor(23.5));

// // Rounding decimals
// console.log((2.7).toFixed(0)); // 3
// console.log((2.345).toFixed(2)); // 2.35
// console.log(+(2.7).toFixed(0));

// // Numeric separators
// const money = 450_320_000;
// console.log(money);
// const num = '250_00';
// console.log(Number.parseFloat('250_99'));

// // Big int
// const b = 123459683495872368968735698734625n;
// const a = 84584756723871982347837827567365n;
// console.log(a + b);

// const huge = 12323932857873459238747898776n;
// const num2 = 23;
// console.log(huge + BigInt(num2));

// console.log(12 > 11n);
// true;
// console.log(typeof huge);
// console.log(typeof num2);
// console.log(20n === 20); // False

// console.log(1 + ' Ali is the best');
// console.log(BigInt(Math.round(12.23)));
// console.log(10n / 3n);

// // create dates
// const now = new Date();
// // console.log(now);
// // console.log(new Date(2002, 1, 20, 20, 45, 30));
// // console.log(new Date(3 * 24 * 60 * 60 * 1000));

// // working with dates
// const future = new Date(2002, 1, 20, 4, 20, 0);
// console.log(future.getFullYear());
// console.log(future.getMonth());
// console.log(future.getDate());
// console.log(future.getDay());
// console.log(future.getHours());
// console.log(future.getMinutes());
// console.log(future.getSeconds());
// console.log(future.toJSON());
// const option = {
//   style: 'currency',
//   unit: 'mile-per-hour',
//   currency: 'usd',
// };

// const future = new Date(2028, 1, 20, 4, 20);
// console.log(new Intl.DateTimeFormat('en-UK').format(future));

// const num = 222333455.56;
// console.log(
//   navigator.language,
//   new Intl.NumberFormat(navigator.language, option).format(num)
// );

const name = 'Ali Best';
const hello = function (firstName, lastName = 'Mashaee') {
  console.log(`Hello ${firstName} ${lastName}`);
};
const timerPizza = setTimeout(hello, 3000, ...name.split(' '));
if (true) clearTimeout(timerPizza);

// setInterval(function () {
//   const now = new Date();
//   const hour = now.getHours();
//   const minute = now.getMinutes();
//   const second = now.getSeconds();
//   console.log(`${hour}:${minute}:${second}`);
// }, 1000);
