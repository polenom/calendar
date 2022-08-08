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
    let month = date.getMonth()?date.getMonth():12;
    let click = '';
    let classday = '';
    if (rqst.checkHolidayIn(prevLastDay - i + 1,month)) {
        classday += 'holiday';
    }
    if (rqst.checkNote(date.getFullYear(), month, prevLastDay - i + 1)) {
        classday += ' noteday'
    }
    if ( classday.length > 0) {
        click = `onclick='viewHolidaysAndNotes( ${prevLastDay - i + 1 }, ${month}, ${date.getFullYear()})'`
    }
    days += `<div class='prev-date ${classday}' ${click} ondblclick='addNote(${date.getMonth() == 0?date.getFullYear()-1:date.getFullYear()}, ${date.getMonth() == 0?12:date.getMonth()}, ${prevLastDay - i + 1 })'>${prevLastDay - i + 1 }</div> `

}



for  (let i = 1; i <= daysFull;i++) {
    let today = false;
    let month = date.getMonth() + 1;
    if (i == day && new Date().getMonth() == date.getMonth() && new Date().getFullYear() == date.getFullYear()) {
        today = true;
    }
    let click ='';
    let classday = '';
    if (rqst.checkHolidayIn(i,month)) {
        classday += 'holiday';
    }
    if (rqst.checkNote(date.getFullYear(), month,i)) {
        classday += ' noteday'
    }
    if ( classday.length > 0) {
        click = `onclick='viewHolidaysAndNotes( ${i}, ${month}, ${date.getFullYear()})'`
    }
    days += `<div class='${today?"today":""} ${classday}' ${click} ondblclick='addNote(${date.getFullYear()}, ${date.getMonth()+1}, ${i})'> ${i}</div>`;
}

for ( let i  = 1; i<=7 - firstDayNext ; i++) {
    let month = date.getMonth() == 11?1:date.getMonth() + 2;
    let year = date.getMonth() == 11?date.getFullYear()+1:date.getFullYear();
    let click ='';
    let classday = '';
    if (rqst.checkHolidayIn(i,month)) {
        classday += 'holiday';
    }
    if (rqst.checkNote(year, month,i)) {
        classday += ' noteday'
    }
    if ( classday.length > 0) {
        click = `onclick='viewHolidaysAndNotes( ${i}, ${month}, ${year})'`
    }
    days += `<div class="next-date ${classday}" ${click} ondblclick='addNote(${year}, ${month}, ${i})'>${i}</div>`
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
                   res += `<div><h5> ${hoday['datebegin']} - ${hoday['dateend']} ${hoday['name']} </h5>
                          ${hoday['description']}
                   </div>`
                }
            }
        }
    if (placeHolidays.hidden ) {
        placeHolidays.hidden = false;
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

    this.checkNote = function(Y, M, D) {
        if (this.notes == undefined) {
            return false
        }
        for (let i of this.notes['markday']) {
            let dt = i['startdate'].slice(0,10).split('-');
            if (dt[0] == Y && dt[1] == M && dt[2] == D) {
                return true
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
                if (text['refresh'] && text['access']) {
                    localStorage['keyrefresh'] = text['refresh'];
                    localStorage['keyaccess'] = text['access'];
                    };
                 return;
            } else if ( xhr.status == 200 ) {
                this.responseapi.push(xhr)
            } else if (xhr.status == 401) {
                this.getNewToken()
            } else if (xhr.status == 201  && xhr.responseURL.slice(0,40) == 'http://localhost:8000/api/user/note/add/') {
                this.responseapi.push(xhr)
                removeElem(document.getElementById('con-popup-id'));
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
        let head = {'refresh': localStorage['keyrefresh']};
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

    this.getdate = function(urldate, head={},method="GET", time , mythis) {
        if (!time) {
            time = 2
        }
        if (!mythis) {
            mythis = this
        }
        if (!this.checkAvailabilityToken()) {
            console.log('login AVALIB')
            this.login()
        }
        if (!this.checkTokenAccessExp(localStorage['keyrefresh'])) {
            console.log('login refresh')
            this.login()
        }
        if (!this.checkTokenAccessExp(localStorage['keyaccess'])) {
            if (time == 2 ) {
                this.getNewToken()
            }
            if (time < 600) {
                time *=4;
                setTimeout(function() {mythis.getdate(urldate, head, method, time, mythis, )}, 100*time)
            } else {
                this.getNewToken();
                setTimeout(function() {mythis.getdate(urldate, head,method, time, mythis)}, 100*time)
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
            console.log(urldate, time)
            if (time == 2 ) {
                this.request(urldate, method,head);
                }
            if (time < 600) {
                time *=4;
                setTimeout(function() {mythis.getdate(urldate, head, method, time, mythis)}, 100*time)
            } else {
                this.request(urldate,method,{});
                setTimeout(function() {mythis.getdate(urldate, head, method, time, mythis)}, 100*time)
            }
            return;
        } else {
            console.log(urldate, time, "billlllllllllllllllllllllllllllllllld")
            time = 2;
            this.bild(urldate)
        }
        return console.log(urldate)
    }
}

function addNote(Y, M, D) {
    let intext = `<div class="popup">
                    <div class="row-input">
                        <div class="r-1">
                            <label for="titlenote">Title</label>
                            <input type="text" id="titlenote" name="title">
                        </div>
                        <div class="r-2">
                            <div>
                                <label for="date">from</label>
                                <input type="datetime-local" id="datefrom" value="${Y}-${M<10?'0'+(M).toString():M}-${D < 10?'0' + (D).toString():D}T00:00" name="startdate">
                            </div>
                            <div>
                                <label for="dateto">to</label>
                                <input type="datetime-local" id="dateto" value="${Y}-${M<10?'0'+(M).toString():M}-${D < 10?'0' + (D).toString():D}T23:59" name="finishdate">
                            </div>
                        </div>
                        <div class="r-3">
                            <label for="descnote">Description</label>
                            <textarea type="text" id="descnote" name='description'></textarea>
                        </div>
                    </div>
                    <div class="row-button">
                        <input type="button" value="SAVE" id="input-save-popup">
                        <input type="button" value="BACK" id="input-back-popup">
                    </div>
                </div>`
    let popup = document.createElement('div')
    popup.setAttribute('id', 'con-popup-id')
    popup.setAttribute('class', 'con-popup')
    popup.innerHTML = intext
    document.body.insertBefore(popup, document.querySelector('script'))
    document.getElementById('input-back-popup').addEventListener('click', ()=> removeElem(document.getElementById('con-popup-id')));
    document.getElementById('input-save-popup').addEventListener('click', ()=> sendNote(document.querySelector('.row-input')));
}

function sendNote(elem) {
    let head = {};
    for ( let  i of elem.querySelectorAll('input')) {
        head[i.name] = i.value
    }
    head[elem.querySelector('textarea').name] = elem.querySelector('textarea').value
    rqst.getdate(`http://localhost:8000/api/user/note/add/${(new Date()).getTime()}/`, head, 'POST')
}

function removeElem(elem) {
    elem.remove()
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


