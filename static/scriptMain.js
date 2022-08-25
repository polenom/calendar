const user = {};
const notesTimeout = {};
const notesElem = document.querySelector('.containerNot')
const date = new Date();
const sleep = ms => new Promise(ms => setTimeout(r, ms))
const placeHolidays = document.getElementById('holidays')
const placeHotes = document.getElementById('notes-palace')
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
    placeHolidays.innerHTML = res
    res = ''
    if (rqst.notes) {

        let mas = rqst.notes['markday'].filter(a => { if (a['startdate'].slice(0,4) >= year && a['finishdate'].slice(0,4) <= year &&
                                                               a['startdate'].slice(5,7) >= month && a['finishdate'].slice(5,7) <= month &&
                                                               a['startdate'].slice(8,10) >= day && a['finishdate'].slice(8,10) <= day
                                                            ) {
                                                                return true
                                                            }
                                                            return false
                                                            }).sort((a,b) => { return (new Date(a['startdate'])) - (new Date(b['startdate']))});
        for ( let i=0; i < mas.length; i++ ) {
            res += `<div class="note" id="note-${i}" name="${mas[i]['id']}" >
                        <div class='row-3'>
                            <div>
                                <label for="note-${i}-title">${i+1}) Title: </label>
                                <span id="note-${i}-title">${mas[i]['title']}</span>
                            </div>
                            <div>
                                <label for="note-${i}-datebegin">From: </label>
                                <span id="note-${i}-datebegin"> ${mas[i]['startdate'].slice(0,10).replaceAll('-', '/')} ${mas[i]['startdate'].slice(11,19)}</span>
                                <label for="note-${i}-dateend">To: </label>
                                <span for="note-${i}-dateend">${mas[i]['startdate'].slice(0,10).replaceAll('-', '/')} ${mas[i]['startdate'].slice(11,19)}</span>
                            </div>
                            <div>
                                <label for="note-2-textarea">Description: </label>
                                <p> ${mas[i]['description']} </p>
                            </div>
                        </div>
                        <div class="row-1">
                            <input type="button" onclick='changeNote("note-${i}",${mas[i]['id']})' value="change">
                            <input type="button" value="del" onclick='deleteNote("note-${i}",${mas[i]["id"]})'>
                        </div>
                    </div>`
        }
    }
    placeHotes.innerHTML = res
}



async function deleteNote(elem, id) {
    await fetch(`http://localhost:8000/api/user/note/delete/${id}/`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'tk ' + localStorage['keyaccess']
            }
        })
        .then(res=> {
            if (res.status == 204) {
                document.getElementById(elem).remove()
                let titles =  document.querySelectorAll('.row-3 div:first-child label');
                let num = 1;
                for (let title of titles) {
                    title.innerHTML = num++ + title.innerHTML.slice(1,)
                }
                for (let i = 0; i < rqst.notes['markday'].length; i++) {
                    if ( rqst.notes['markday'][i]['id'] == id) {
                        rqst.notes['markday'].splice(i,1);
                        break;
                    }
                }
                renderCalendar()
            } else {
                throw "123"
            }
        })
        .catch(err=> console.log("No delete object"));
}

function changeNote(elem, id) {
    let el = document.getElementById(elem)
    let vl = getObjFromId(id);
    let num = elem.slice(5)
    el.innerHTML = `<div class='row-3' id="row-3-note-${num}">
                        <div class="row-3-1">
                            <label for="note-${num}-title">${+num+1}) Title: </label>
                            <input type="text" id="note-${num}-tile" name='title' value='${vl["title"]}'>
                        </div>
                        <div class="row-3-2">
                            <label for="note-${num}-datebegin">From: </label>
                            <input type="datetime-local" id="note-${num}-datebegin" name='startdate' value='${vl["startdate"].slice(0,16)}'>
                            <label for="note-${num}-dateend">To: </label>
                            <input type="datetime-local" id="note-${num}-dateend" name='finishdate' value='${vl["finishdate"].slice(0,16)}'>
                        </div>
                        <div  class="row-3-3">
                            <label for="note-${num}-textarea">Description: </label>
                            <textarea type="text" id="note-${num}-textarea" name='description'>${vl['description']}</textarea>
                        </div>
                    </div>
                    <div class="row-1">
                        <input type="button" value="save" onclick="saveChangeNote('${elem}', ${id})">
                        <input type="button" value="back" onclick="backNotes('${elem}',${id})">
                    </div>`
}

function checkTwoObj(obj1, obj2) {
    if ( obj1['title'] ==  obj2['title'] &&
         obj1['startdate'].slice(0, 16) == obj2['startdate'].slice(0, 16) &&
         obj1['finishdate'].slice(0, 16) == obj2['finishdate'].slice(0, 16) &&
         obj1['description'] == obj2['description']
    ){
        return false;
    }

    return true;
}

function saveChangeNote(elem, id) {
    let vl = getObjFromId(id);
    let head = {};
    elem = document.getElementById(elem);
    for ( let  i of elem.querySelector('.row-3').querySelectorAll('input')) {
        if (i.value ) {
            head[i.name] = i.value
        }
    }
    if (elem.querySelector('textarea').value) {
            head[elem.querySelector('textarea').name] = elem.querySelector('textarea').value
    }
    console.log('456')
    if (checkTwoObj(vl, head)) {
        rqst.getdate(`http://localhost:8000/api/user/note/update/${id}/`, head, 'PUT')
    }

}


function backNotes(elem, id ) {
    let vl = getObjFromId(id);
    let i = elem.slice(5)
    document.getElementById(elem).innerHTML = `
                            <div class='row-3'>
                                <div>
                                    <label for="note-${i}-title">${+i+1}) Title: </label>
                                    <span id="note-${i}-title">${vl['title']}</span>
                                </div>
                                <div>
                                    <label for="note-${i}-datebegin">From: </label>
                                    <span id="note-${i}-datebegin"> ${vl['startdate'].slice(0,10).replaceAll('-', '/')} ${vl['startdate'].slice(11,19)}</span>
                                    <label for="note-${i}-dateend">To: </label>
                                    <span for="note-${i}-dateend">${vl['startdate'].slice(0,10).replaceAll('-', '/')} ${vl['startdate'].slice(11,19)}</span>
                                </div>
                                <div>
                                    <label for="note-2-textarea">Description: </label>
                                    <p> ${vl['description']} </p>
                                </div>
                            </div>
                            <div class="row-1">
                                <input type="button" onclick='changeNote("note-${i}",${vl['id']})' value="change">
                                <input type="button" value="del" onclick='deleteNote("note-${i}",${vl["id"]})'>
                            </div>


    `

}

function getObjFromId(id) {
    if ( rqst.notes['markday']) {
        for ( let i of rqst.notes['markday']) {
            if (i['id'] == id ) {
                return i
            }
        }
    }
    return undefined
}

function createNoteInPage(text, timebefore, id ) {
    if (notesElem.children.length == 0) {
        let textNoti = `
        <div class="notifition">
            <div class="row-3 nottext">
                <div name='${id}'>
                    ${text}:
                    <span class="notitime">${timebefore}</span>
                </div>
            </div>
            <i class="fa-solid fa-xmark row-1"></i>
        </div>
        `
        notesElem.innerHTML = textNoti
        notesElem.querySelector('i').addEventListener('click', ()=>(notesElem.innerHTML = ''))
    } else {
        for (let i of notesElem.querySelectorAll('.row-3.nottext > div')) {
            if (i.getAttribute('name') == id) {
                return
            }
        }
        notesElem.querySelector('.row-3.nottext').insertAdjacentHTML('beforeend', `<div name='${id}'>
                                                                                    ${text}:
                                                                                    <span class="notitime">${timebefore}</span>
                                                                                    </div>
                                                                                    `)
    }
}

function createNotes(notes) {
    let nowdate = new Date();
    console.log(nowdate, 'now date')
    for (let note of notes){
        let dateNote = new Date(note.startdate.slice(0,-1))
        if ( nowdate.getTime() <= (dateNote.getTime() - 15000) &&
             nowdate.getTime() >= (dateNote.getTime() - 86400000)
        ) {
            let deltatime = dateNote.getTime() - nowdate.getTime();
            notesTimeout[note.id] ={
                timeout: [],
                startdate: note.startdate,
            }
            for (let i of [15000, 30000, 60000]) {
                if( (deltatime - i) >= 0) {
                    notesTimeout[note.id].timeout.push(setTimeout(()=>createNoteInPage(note.title, '15 min left', note.id), i))
                }
            }
        }
    }
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
        let t = this;
        xhr.responseapi = this.responseapi;
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
            } else if (xhr.status == 200 && xhr.responseURL.slice(0,43) == 'http://localhost:8000/api/user/note/update/') {
                this.responseapi.push(xhr);
                let vl = getObjFromId(xhr.responseURL.slice(43,47));
                vl['title'] = head['title']
                vl['startdate'] = head['startdate']
                vl['finishdate'] = head['finishdate']
                vl['description'] = head['description']
                console.log( '1111111111111111')
                for (let i of document.getElementById('notes-palace').childNodes) {
                    if (i.getAttribute('name') == vl['id'] ) {
                        backNotes(i.getAttribute('id'),  vl['id'])
                        break;
                    }
                }
            } else if ( xhr.status == 200 ) {
                this.responseapi.push(xhr)
            } else if (xhr.status == 401) {
                this.getNewToken()
            } else if (xhr.status == 201  && xhr.responseURL.slice(0,40) == 'http://localhost:8000/api/user/note/add/') {
                this.responseapi.push(xhr)
                t.getdate('http://localhost:8000/api/user/notes/')
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
        this.country = user.country
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
                return;
            } else if ( i.responseURL == url && url== 'http://localhost:8000/api/user/notes/') {
                this.notes = JSON.parse(i.response)
                this.responseapi.splice(this.responseapi.indexOf(i),1)
                createNotes(this.notes['markday'])
                renderCalendar()
                return;
            } else if (i.responseURL == url && i.responseURL.slice(0,43) == 'http://localhost:8000/api/user/note/update/') {
                 this.responseapi.splice(this.responseapi.indexOf(i),1)
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
    console.log('addddddddddddddddddddddddd')
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
        if (i.value ) {
        head[i.name] = i.value
        }
    }
    if (elem.querySelector('textarea').value) {
            head[elem.querySelector('textarea').name] = elem.querySelector('textarea').value
    }
    if ( Object.keys(head).length == 4) {
        rqst.getdate(`http://localhost:8000/api/user/note/add/${(new Date()).getTime()}/`, head, 'POST');
    }

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

async function requestF(url, method, base, auth) {
    let res;
    if (method == "GET") {
        res = await fetch(url,{
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': auth
            },
        } );
    } else {
        res = await fetch(url,{
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': auth
            },
            body: JSON.stringify(base)
        } )
    }
    if (res.url == `http://localhost:8000/api/user/get/${localStorage['username']}/` && res.status == 200 && method == "GET" ) {
        let obj = await res.json()
        for (let i of Object.keys(obj)) {
            user[i] = obj[i]
        }
        rqst.getdate(`http://localhost:8000/api/country/holidays/${user.country}/`);
        document.getElementById('countryMenu').innerHTML = 'Country: ' + user.country
        let butUs = document.getElementById('usernameMenu')
        butUs.innerHTML = 'Username: ' + user.username
        butUs.addEventListener('click', ()=>{ document.querySelector('.inputuserval').classList.toggle('clickprofile') })
    }
}


getTokenFromCookie()
requestF(`http://localhost:8000/api/user/get/${localStorage['username']}/`,
        "GET",
        '' ,
        'tk '+localStorage['keyaccess']
    )
let rqst = new token(holidays);

rqst.getdate('http://localhost:8000/api/user/notes/');
renderCalendar();


