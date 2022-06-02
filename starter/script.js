'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [
    200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300, 400, 500, -200,
  ],
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
    '2022-05-12T10:51:36.790Z',
    '2022-05-12T10:51:36.790Z',
    '2022-05-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
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
const currentDate = acc => {
  let date = new Date();
  // let day = `${date.getDate()}`.padStart(2, 0);
  // let month = `${date.getMonth() + 1}`.padStart(2, 0);
  // let year = date.getFullYear();
  // let hour = `${date.getHours()}`.padStart(2, 0);
  // let minutes = `${date.getMinutes()}`.padStart(2, 0);
  // labelDate.textContent = `As of ${day}/${month}/${year}, ${hour}:${minutes}`;
  const options = {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    weekday: 'long',
  };
  labelDate.textContent = new Intl.DateTimeFormat(acc.locale, options).format(
    date
  );
};
const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) => {
    const timePassed = Math.floor(
      Math.abs((date1 - date2) / 1000 / 60 / 60 / 24)
    );
    return timePassed;
  };
  const daysPassed = calcDaysPassed(new Date(), date);
  if (daysPassed === 0) return 'Today';
  else if (daysPassed === 1) return 'Yesterday';
  else if (daysPassed < 8) return `${day} days ago`;
  // else {
  //   const day = `${date2.getDate()}`.padStart(2, '0');
  //   const month = `${date2.getMonth() + 1}`.padStart(2, '0');
  //   const year = date2.getFullYear();
  //   return `${day}/${month}/${year}`;
  // }
  return new Intl.DateTimeFormat(locale).format(date);
};
const formatMoney = function (movement, local, currency) {
  const options = {
    style: 'currency',
    currency: currency,
  };
  return new Intl.NumberFormat(local, options).format(movement);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const displayDate = formatMovementDate(
      new Date(acc.movementsDates[i]),
      acc.locale
    );
    const displayMoney = formatMoney(mov, acc.locale, acc.currency);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${displayMoney}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  const convertBalance = formatMoney(acc.balance, acc.locale, acc.currency);
  labelBalance.textContent = `${convertBalance}`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  const convertIncomes = formatMoney(incomes, acc.locale, acc.currency);
  labelSumIn.textContent = `${convertIncomes}`;

  const out = Math.abs(
    acc.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0)
  );
  const convertOut = formatMoney(out, acc.locale, acc.currency);
  labelSumOut.textContent = `${convertOut}`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  const convertIntrest = formatMoney(interest, acc.locale, acc.currency);
  labelSumInterest.textContent = `${convertIntrest}`;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  //Display Date
  currentDate(acc);
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);

  //Display Timer
  if (timer) clearInterval(timer);
  timer = startLogOutTimer();
};
/////TIMER//////////////
const startLogOutTimer = () => {
  let timeOut = 100;
  const tick = () => {
    let minutes = Math.floor(timeOut / 60);
    let seconds = timeOut % 60;
    labelTimer.textContent = `${`${minutes}`.padStart(
      2,
      '0'
    )} : ${`${seconds}`.padStart(2, '0')}`;
    //log out if timer hit 0
    if (timeOut === 0) {
      clearInterval(timer);
      containerApp.style.opacity = 0;
      labelWelcome.textContent = 'Log in to get started';
    }
    timeOut -= 1;
  };
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

///////////////////////////////////////
// Event handlers
let currentAccount, timer;

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movements.push(amount);
    receiverAcc.movementsDates.push(new Date().toISOString());
    // Update UI
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(Number(inputLoanAmount.value));

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
      // Add movement
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUI(currentAccount);
    }, 2000);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// console.log(0.11+0.2)
//
// console.log()
// let list3 = []
// const mergeList = function(list1,list2){
//   for(let i = 0; i < list1.length; i++){
//     list3.push(list1[i])
//     list3.push(list2[i])
//   }
// }
// mergeList([1,2,3],[1,2,3])
// console.log(list3)

// let numbers = []
// var twoSum = function(nums, target) {
//   if(nums.length > 0){
//     for(let i = 0; i < nums.length-1; i++){
//       if (nums[i]+nums[i+1] === target){
//         console.log('in')
//         numbers.push(i)
//         numbers.push(i+1)
//        break;
//       }
//     }
//   }return numbers;
// };
// console.log(twoSum([3,2,4],6) )

// var plusOne = function(digits) {
//   for (let i = digits.length - 1; i >= 0; i--) {
//     if(digits[i] <= 9){
//       digits[i] +=1
//       return digits
//     }else{
//       digits[i] = 0
//     }
//   }
//   digits.unshift(1);
//   return digits
// };

// let counter = 0;
// var numberOfSteps = function(num) {
//   while (num !== 0){
//     if (num % 2 === 0) {
//       num /=2
//       counter ++
//     }
//   else{
//       num -=1
//       counter ++
//     }
//   }
//   return counter
// };
// console.log(numberOfSteps(8))
//
//
// var numberOfSteps = function(num){
//   let count = 0;
//   while (num!==0){
//     num % 2 === 0 ? num/=2:num-=1;
//     count++
//   }
//   return count
// }
// var mergeTwoLists = function(list1, list2) {
//   let list3 = []
//   if(list1.length === 0) return list2
//   if (list2.length ===0) return list1
//   if (list1.length <= list2.length){
//     for(let i = 0; i < list1.length; i++){
//       list3.push(list1[i])
//       list3.push(list2[i])
//     }
//   }else{
//     for(let i = 0; i < list2.length; i++){
//       list3.push(list1[i])
//       list3.push(list2[i])
//     }
//   }return list3
// };
// var mergeTwoLists = function (list1, list2) {
//   let list3 = [];
//   if (list1.length === 0) return list2;
//   if (list2.length === 0) return list1;
//   if (list1.length <= list2.length) {
//     for (let i = 0; i < list1.length; i++) {
//       list3.push(list1[i]);
//       list3.push(list2[i]);
//     }
//   } else {
//     for (let i = 0; i < list2.length; i++) {
//       list3.push(list1[i]);
//       list3.push(list2[i]);
//     }
//   }
//   return list3;
// };
//
// console.log(mergeTwoLists([1, 2, 4], [1, 3, 4]));

/////////////////

// var mergeTwoLists = function (list1, list2) {
//   const list3 = [];
//   while (list1 && list2) {
//     if (list1.value < list2.value) {
//       list3.next = list1.value;
//       console.log(list3);
//       list1 = list1.next;
//     } else {
//       list3.next = list2.value;
//       list2 = list2.next;
//     }
//     if (list1) {
//       list3.next = list1;
//     } else {
//       list3.next = list1;
//     }
//     return list3;
//   }
// };
// console.log(mergeTwoLists([1, 2, 3], [4, 5, 6]));
//
// /////////////////
// const arr = [1, 2, 3];
// console.log(arr.val);
// const randomInt = function (min, max) {
//   return Math.trunc(Math.random() * (max - min + 1) + min);
// };
// console.log(randomInt(3, 5));
// console.log(Math.floor('-23.3'));
// console.log(Math.trunc('-23.3'));
// console.log(Math.round(23.7));
// console.log(Number((23.354648).toFixed(3)));
// const length = 287_000_000_000_000_000;
// console.log(BigInt(3333333333333333333333333334444444444444444));
// console.log(20n == 20);
// console.log(16n ** (1/2)n);
// console.log(16 ** 0.5);

/////////////////////////////CREATE DATE/////////////////////////
// const now = new Date();
// console.log(now);
// console.log(
//   new Date('Tue May 31 2022 10:41:07 GMT+0300 (Israel Daylight Time)')
// );
// console.log(new Date(account1.movementsDates[0]));
//
// const future = new Date();
// console.log(future.getFullYear(), future.getMonth(), future.getDate());
// console.log(future.toISOString(), future);
// console.log(Date.now());
/////////////////////////////////////////

// const future = new Date(2088, 10, 10, 20, 22);
// const today = new Date();
//
// const gap = Number(future) - Number(today);
// console.log(gap / 24 / 60 / 60 / 1000 / 360);
// console.log(2088 - 2022);
//
// const calcDaysPassed = (date1, date2) => {
//   return Math.floor(Math.abs((date1 - date2) / 1000 / 60 / 60 / 24));
// };
// const pass = calcDaysPassed(new Date(2030, 4, 20), new Date(2030, 4, 22, 20));
// console.log(pass);
// //////////////////

// const now = new Date();
// const options = {
//   month: 'numeric',
//   day: 'numeric',
//   year: 'numeric',
//   hour: 'numeric',
//   minute: 'numeric',
//   weekday: 'long',
// };
// console.log(new Intl.DateTimeFormat(navigator.language, options).format(now));
// console.log(navigator.language);
// const num = 2000;
// const options = {
//   style: 'currency',
//   unit: 'celsius',
//   currency: 'ILS',
// };
// console.log(new Intl.NumberFormat(navigator.language, options).format(num));
//}

//
// setInterval(() => {
//   const now = new Date();
//   const options = {
//     hour: 'numeric',
//     minute: 'numeric',
//     second: 'numeric',
//   };
//   console.log(new Intl.DateTimeFormat('en-US', options).format(now));
// }, 1000);
// const twoSum = function (nums, target) {
//   let arr = [];
//   if (nums) {
//     for (let i = 0; i < nums.length - 1; i++) {
//       let num = nums[i];
//       for (let j = i + 1; j < nums.length; j++) {
//         if (num + nums[j] === target) {
//           arr.push[i];
//           arr.push[j];
//           return arr;
//         }
//       }
//     }
//   }
// };

// const climbStairs = function (n) {
//   let options = [];
//   //how many ways to climbe 0 stairs
//   options[1] = 1;
//   //how many ways to clime 1 stair
//   options[2] = 2;
//
//   //we can see that 0 + 1 will give us the amout of steps for 2 which is 2.
//   //creating a for loop that will do the same thing for n steps.
//   for (let i = 3; i <= n; i++) {
//     options[i] = options[i - 1] + options[i - 2];
//     console.log(options);
//   }
//   return options.reduce((acc, ways) => acc + ways, 0);
// };
// console.log(climbStairs(2));

// var maxProfit = function (prices) {
//   let profit = 0;
//   for (let i = 0; i < prices.length - 1; i++) {
//     for (let j = i + 1; j < prices.length; j++) {
//       if (profit < prices[j] - prices[i]) {
//         profit = prices[j] - prices[i];
//       }
//     }
//   }
//   return profit;
// };
// console.log(
//   maxProfit([80, 96, 461, 972,
//   ])
// );

// var merge = function (nums1, m, nums2, n) {
//   //Slicing the array for the needed array
//   let nums1Final = nums1.slice(0, m);
//   let nums2Final = nums2.slice(0, n);
//   console.log(nums1Final);
//   console.log(nums2Final);
//   let sortedArr = [];
//   if (nums1Final.length >= nums2Final.length) {
//     for (let i = 0; i < m + n; i++) {
//       if (nums1Final[i] <= nums2Final[i]) {
//         sortedArr.push(nums1Final[i]);
//         nums2Final.unshift(0);
//       } else {
//         sortedArr.push(nums2Final[i]);
//         nums1Final.unshift(0);
//       }
//     }
//   } else {
//     for (let i = 0; i < m + n; i++) {
//       if (nums1Final[i] < nums2Final[i]) {
//         sortedArr.push(nums1Final[i]);
//         nums2Final.unshift(0);
//       } else {
//         sortedArr.push(nums2Final[i]);
//         nums1Final.unshift(0);
//       }
//     }
//   }
//   nums1 = sortedArr;
//   return nums1;
// };
// console.log(merge([1, 2, 3, 0, 0, 0], 3, [2, 5, 6], 3));
// var merge = function (nums1, m, nums2, n) {
//   let lastIndex = m + n - 1;
//   while (m > 0 && n > 0) {
//     if (nums1[m - 1] > nums2[n - 1]) {
//       nums1[lastIndex] = nums1[m - 1];
//       m--;
//       lastIndex--;
//     } else {
//       nums1[lastIndex] = nums2[n - 1];
//       n--;
//       lastIndex--;
//     }
//   }
//   while (n > 0) {
//     nums1[lastIndex] = nums2[n - 1];
//     lastIndex--;
//     n--;
//   }
//   return nums1;
// };
// var reverseString = function (s) {
//   return s.reverse();
// };
// console.log(reverseString(['h', 'e', 'l', 'l', 'o']));

// var mergerTwoLists = function (list1, list2) {
//   let mergeLists = [];
//   let n = list1.length;
//   let m = list2.length;
//   while (n > 0 && m > 0) {
//     for (let i = 0; i < m + n; i++) {
//       if (list1[n - 1] > list2[m - 1]) {
//         mergeLists.unshift(list1[n - 1]);
//         n--;
//       } else {
//         mergeLists.unshift(list2[m - 1]);
//         m--;
//       }
//     }
//   }
//   if (n > 0) {
//     mergeLists.unshift(...list1.slice(0, n));
//   } else {
//     mergeLists.unshift(...list2.slice(0, m));
//   }
//   return mergeLists;
// };
// console.log(mergerTwoLists([1, 2, 4], [1, 3, 4]));

// const list1 = [0, 1, 2];
// const list2 = [3, 4, 5];
// console.log(list2.slice(0, 3).concat(list1));
