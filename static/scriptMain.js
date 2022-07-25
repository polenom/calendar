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
    if (i == day && new Date().getMonth() == date.getMonth() && new Date().getFullYear() == date.getFullYear()) {
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

function token() {
    this.response = [];
    this.time = 2;
    this.checkAvailabilityToken = function() {
        if (localStorage.getItem('keyrefresh')  && localStorage.getItem('keyaccess')) {
            return true
        }
        return false
    };
    this.checkTokenAccessExp = function(token) {
        if (!token) {
            token = localStorage['keyrefresh']
        }
        const data= JSON.parse(atob(token.split('.')[1]))
        console.log(data, data['exp'] , '====', (new Date().getTime()+3)/1000)
        if (data['exp'] > (new Date().getTime()+3)/1000) {
            return true;
        }
        return false;
    };

    this.login = function() {

    }

    this.request = function(url, method, head) {
        let xhr = new XMLHttpRequest();
        xhr.timeout = 10000
        xhr.open(method, url)
        xhr.setRequestHeader('Content-Type', 'application/json')
        xhr.send(JSON.stringify(head))
        xhr.onload = function() {
            if (xhr.status == 200) {
                let text= JSON.parse(xhr.response)
                console.log('update date ', text, 11111111111111111111)
                localStorage['keyrefresh'] = text['refresh']
                localStorage['keyaccess'] = text['access']
                console.log(localStorage)
            }
        }
        xhr.onerror = function() {
            console.log('miss connect')
        }

    }
    this.getNewToken = function() {
        let url = 'http://localhost:8000/api/token/refresh/'
        let method = "POST"
        let head = {'refresh': localStorage['keyrefresh']}
        this.request(url, method, head)
    }

    this.getdate = function(urldate) {
        if (!this.checkAvailabilityToken() ) {
            console.log(1)
            this.getNewToken()
        }
        if (!this.checkTokenAccessExp()) {
             console.log(2)
            if (this.time == 2 ) {
                this.getNewToken();
            }
            if (this.time < 120) {
                setTimeout(()=> this.getdate(urldate), 100*this.time);
                this.time = this.time*2;

            } else {
                this.time = 2;
            }
            return
        }

    }
}



renderCalendar();
let rqst = new token();
rqst.getdate('http://localhost:8000/api/country/holidays/Belarus/');



