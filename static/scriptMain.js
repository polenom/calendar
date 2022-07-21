const date = new Date();

const  renderCalendar = () =>{
const day = date.getDate();
const daysFull = daysInMonth(date.getFullYear(), date.getMonth()+1);
const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "January",
    "December",
]
const monthDays = document.querySelector(".days")
document.querySelector('.date h1').innerHTML = months[date.getMonth()]
document.querySelector('.date p').innerHTML = date.toDateString()

let days = "";

const prevLastDay = daysInMonth(date.getFullYear(), date.getMonth())
const firstDayIndex = new Date(date.getFullYear(), date.getMonth()).getDay();
let firstDayNext =  new Date(date.getFullYear(), date.getMonth()+1).getDay();
console.log(firstDayIndex,111)
if (firstDayIndex == 0) {
    firstDayIndex = 6;
} else if (firstDayIndex == 1) {
    firstDayIndex = 0;
} else {
    firstDayIndex;
}
if (firstDayNext == 0) {
    firstDayNext =  6
} else if (firstDayNext == 1) {
    firstDayNext =  7
} else {
    firstDayNext--;
}

function daysInMonth (year, month) {
    return new Date(year, month, 0).getDate()
}
for (let i = firstDayIndex-1; i > 0 ; i--) {
    days += `<div class='prev-date'>${prevLastDay - i + 1 }</div> `

}



for  (let i = 1; i <= daysFull;i++) {
    if (i == day && new Date().getMonth() == date.getMonth()) {
        days += `<div class='today'>${i}</div>`;
        continue;
    }
    days += `<div>${i}</div>`;
}

for ( let i  = 1; i<=7 - firstDayNext ; i++) {
    days += `<div class="next-date">${i}</div>`
}
monthDays.innerHTML = days;
}
document.querySelector('.prev').addEventListener('click', ()=>{
    date.setMonth(date.getMonth()-1);
    renderCalendar()
});document.querySelector('.next').addEventListener('click', ()=>{
    date.setMonth(date.getMonth()+1);
    renderCalendar()
})


renderCalendar()