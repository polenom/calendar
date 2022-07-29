const date = new Date();
const sleep = ms => new Promise(ms => setTimeout(r, ms))
const placeHolidays = document.getElementById('holidays')
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
    "December",
]
const monthDays = document.querySelector(".days")
console.log('month', date.getMonth())
document.querySelector('.date h1').innerHTML = months[date.getMonth()]
document.querySelector('.date p').innerHTML = date.toDateString()

let days = "";

const prevLastDay = daysInMonth(date.getFullYear(), date.getMonth())
let firstDayIndex = new Date(date.getFullYear(), date.getMonth()).getDay();
let firstDayNext =  new Date(date.getFullYear(), date.getMonth()+1).getDay();
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
    let month = date.getMonth()?date.getMonth():12
    if (rqst.checkHolidayIn(prevLastDay - i + 1,month)) {
        days += `<div class='prev-date holiday' onclick='viewHolidaysAndNotes(${prevLastDay - i + 1}, ${month}, ${date.getFullYear()}>${prevLastDay - i + 1 }</div> `
    } else {
        days += `<div class='prev-date'>${prevLastDay - i + 1 }</div> `
    }
}



for  (let i = 1; i <= daysFull;i++) {
    let today = false;
    if (i == day && new Date().getMonth() == date.getMonth() && new Date().getFullYear() == date.getFullYear()) {
        today = true;
    }
    if (rqst.checkHolidayIn(i,date.getMonth()+1)) {
        days += `<div class='holiday ${today?"today":""}' onclick='viewHolidaysAndNotes(${i}, ${date.getMonth() + 1})'> ${i}</div>`;
    } else {
        days += `<div ${today?'class="today"':''}>${i}</div>`;
    }
}

for ( let i  = 1; i<=7 - firstDayNext ; i++) {
    if (rqst.checkHolidayIn(i ,(date.getMonth()+2) <= 12?date.getMonth()+2:1)) {
        days += `<div class="next-date holiday">${i}</div>`
    } else {
        days += `<div class="next-date">${i}</div>`
    }
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

function viewHolidaysAndNotes(day, month, year) {
    let res = '';
    if (rqst.holidays) {
            for (let hoday of rqst.holidays['holidaycountry']) {
                let dt = hoday['datebegin'].split('/')
                if (parseInt(dt[0]) === month && parseInt(dt[1]) === day ) {
                    console.log(hoday)
                   res += `<div><h5> ${hoday['datebegin']} - ${hoday['dateend']} ${hoday['name']} </h5>
                          ${hoday['description']}
                   </div>`
                }
            }
        }
    placeHolidays.innerHTML = res
}

function token(div) {
    this.notes;
    this.holidays;
    this.div = div
    this.responseapi = [];
    this.country = 123;
    this.checkAvailabilityToken = function() {
        if (localStorage.getItem('keyrefresh')  && localStorage.getItem('keyaccess')) {
            return true;
        }
        return false;
    };
    this.checkTokenAccessExp = function(tok) {
        if (tok == undefined) {
            tok = localStorage['keyaccess']
        }
        const data= JSON.parse(atob(tok.split('.')[1]));
        if (data['exp'] > (new Date().getTime()+1)/1000) {
            return true;
        }
        return false;
    };

    this.checkHolidayIn = function(day, month){
        if (this.holidays) {
            for (let hoday of this.holidays['holidaycountry']) {
                let dt = hoday['datebegin'].split('/')
                if (parseInt(dt[0]) === month && parseInt(dt[1]) === day ) {
                    return true;
                }
            }
        }
        return false
    }

    this.login = function() {

    }

    this.request = function(url, method, head) {
        let xhr = new XMLHttpRequest();
        xhr.responseapi = this.responseapi
        xhr.timeout = 10000
        xhr.open(method, url)
        xhr.setRequestHeader('Content-Type', 'application/json')
        if (localStorage['keyaccess']) {
            xhr.setRequestHeader('Authorization', `tk ${localStorage['keyaccess']}`)
        }
        xhr.send(JSON.stringify(head))
        xhr.onload = function() {
            if (xhr.status == 200 &&  xhr.responseURL == "http://localhost:8000/api/token/refresh/") {
                let text= JSON.parse(xhr.response)
                console.log(text)
                if (text['refresh'] && text['access']) {
                    localStorage['keyrefresh'] = text['refresh'];
                    localStorage['keyaccess'] = text['access'];
                    };
                 return;
            } else if ( xhr.status == 200 ) {
                this.responseapi.push(xhr)
            } else if (xhr.status == 401) {
                this.getNewToken()

            }
        }
        xhr.onerror = function() {
            console.log('miss connect')
        }
        xhr.timeout = 55000;

    }
    this.getNewToken = function() {
        let url = 'http://localhost:8000/api/token/refresh/'
        let method = "POST"
        let head = {'refresh': localStorage['keyrefresh']}
        this.request(url, method, head)
    }

    this.getCountry = function() {
        this.country = JSON.parse(atob(localStorage['keyrefresh'].split('.')[1]))['country']
        return this.country
    }

    this.checkresponse = function(url) {
        for (let i of this.responseapi) {
            if( i.responseURL == url) {
                return true;
            }
        }
        return false;
    }

    this.bild = function(url) {
        for ( let i of this.responseapi) {
            if ( i.responseURL == url && url.slice(0,43) == 'http://localhost:8000/api/country/holidays/' ) {
                this.holidays = JSON.parse(i.response);
                renderCalendar();
                break;
            } else if ( i.responseURL == url && url== 'http://localhost:8000/api/user/notes/') {
                this.notes = JSON.parse(i.response)
                this.responseapi.splice(this.responseapi.indexOf(i),1)
                renderCalendar()
                break;
            }
        }
    }

    this.getdate = function(urldate, time , mythis) {
        console.log(urldate, time , mythis)
        console.log(this,1111111111111)
        if (!time) {
            time = 2
        }
        if (!mythis) {
            mythis = this
        }
        if (!this.checkAvailabilityToken()) {
            this.login()
        }
        if (!this.checkTokenAccessExp(localStorage['keyrefresh'])) {
            this.login()
        }
        if (!this.checkTokenAccessExp(localStorage['keyaccess'])) {
            if (time == 2 ) {
                this.getNewToken()
            }
            if (time < 600) {
                time *=4;
                setTimeout(function() {mythis.getdate(urldate, time, mythis)}, 100*time)
            } else {
                this.getNewToken();
                setTimeout(function() {mythis.getdate(urldate, time, mythis)}, 100*time)
            }
            return
        } else {
        time = 2;}
        this.getCountry();
        if (typeof urldate === 'function' && this.country ) {
                urldate = urldate(this);
            } else if ( this.country === '') {
                return
            }
        if ( !this.checkresponse(urldate)) {
            console.log('check country', time)
            console.log('checkresponse', this.checkresponse(urldate))
            if (time == 2 ) {
                this.request(urldate,'GET',{});
                }
            if (time < 600) {
                let fc = function() {
                    console.log('this', this)
                }
                time *=4;
                setTimeout(function() {mythis.getdate(urldate, time, mythis)}, 100*time)
            } else {
                this.request(urldate,'GET',{});
                setTimeout(function() {mythis.getdate(urldate, time, mythis)}, 100*time)
            }
            return;
        } else {
            time = 2;
            this.bild(urldate)
        }

    }
}

function getTokenFromCookie() {
    let res = document.cookie.split(';').map(a => a.split('=')).filter(a=> a[0] === ' access' || a[0] === ' refresh')
    for (let i of res ) {
        localStorage.setItem(`key${i[0].trim()}`, i[1])
    }
}

getTokenFromCookie()
let rqst = new token(holidays);
rqst.getdate((r)=>  {return `http://localhost:8000/api/country/holidays/${r['country']}/`});
rqst.getdate('http://localhost:8000/api/user/notes/');
renderCalendar();


