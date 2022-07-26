const date = new Date();
const sleep = ms => new Promise(ms => setTimeout(r, ms))
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

function token(div) {
    this.div = div
    this.responseapi = [];
    this.time = 2;
    this.country = 123;
    this.checkAvailabilityToken = function() {
        if (localStorage.getItem('keyrefresh')  && localStorage.getItem('keyaccess')) {
            return true;
        }
        return false;
    };
    this.checkTokenAccessExp = function(tok) {
        if (!tok) {
            tok = localStorage['keyrefresh']
        }
        const data= JSON.parse(atob(tok.split('.')[1]));
        if (data['exp'] > (new Date().getTime()+3)/1000) {
            return true;
        }
        return false;
    };

    this.login = function() {

    }

    this.request = function(url, method, head) {
        let xhr = new XMLHttpRequest();
        xhr.responseapi = this.responseapi
        xhr.timeout = 10000
        xhr.open(method, url)
        xhr.setRequestHeader('Content-Type', 'application/json')
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
        console.log(url, method, head, 22222222222222222222)
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
        let obj ;
        for ( let i of this.responseapi) {
            if ( i.responseURL == url ) {
                obj = i;
                break;
            }
        }
        console.log(obj)
    }

    this.getdate = function(urldate) {
        console.log(this)
        console.log(this.time , 'time')
        if (!this.checkAvailabilityToken()) {
            login()
        }
        if (!this.checkTokenAccessExp()) {
            if (this.time == 2 ) {
                this.getNewToken()
            }
            if (this.time < 600) {
                this.time = this.time*4;
                setTimeout(()=> this.getdate(urldate), 100* this.time)


            } else {
                this.getNewToken();
                setTimeout(()=> checkfunc, 100*this.time);
            }
            return
        } else {
            this.time == 2;
        }
        this.getCountry();
        if (typeof urldate === 'function' ) {
                urldate = urldate(this);
            }
        if ( !this.checkresponse(urldate)) {
            if (this.time == 2 ) {
                this.request(urldate,'GET',{});
                }
            if (this.time < 600) {
                this.time = this.time*4;
                setTimeout(()=> this.getdate(urldate), 100* this.time)
            } else {
                this.request(urldate,'GET',{});
                setTimeout(()=> checkfunc, 100*this.time);
            }
        } else {
            this.time = 2;
            this.bild(urldate)
        }


    }
}



renderCalendar();
const holidays = document.getElementById('')
let rqst = new token(holidays);
rqst.getdate((r)=>  {return `http://localhost:8000/api/country/holidays/${r['country']}/`});



