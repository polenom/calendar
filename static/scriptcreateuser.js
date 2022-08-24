const butReg = document.getElementById('button-reg');
const butBac = document.getElementById('button-back')
const fieldUsername = document.getElementById('floatingInput');
const response  = [];
const message = document.getElementById('message');
const mesPass = document.getElementById('password-mes');
const password1 = document.getElementById("floatingPassword1");
const password2 = document.getElementById("floatingPassword2");
const email = document.getElementById('floatingEmail');
const search = document.querySelector('.selected');
const option = document.querySelector('.options-container');
const inputbox = document.querySelector('.search-box');
const searchBox = document.querySelector(".search-box input");


butBac.addEventListener('click', ()=> document.location.href='http://localhost:8000/')


option.querySelectorAll('div').forEach(a=>{
    a.addEventListener('click', (e)=>{
        search.innerHTML = a.querySelector('label').innerHTML
        option.classList.remove('active');
    })
})

search.addEventListener('click', ()=>{
    inputbox.querySelector('input').value = ''
    option.classList.toggle('active');
    if (option.classList.contains('active')) {
        searchCountry('');
        inputbox.querySelector('input').focus()
    }
})

inputbox.addEventListener('keyup',(e)=>{
    const partWord=inputbox.querySelector('input').value;
    searchCountry(partWord.toLowerCase());
})

function searchCountry(text) {
    option.querySelectorAll('div').forEach(a=>{
        let namecountry = a.firstElementChild.nextElementSibling.innerHTML.toLowerCase()
        if(namecountry.indexOf(text) != -1) {
                a.style.display = "block";
            } else {
                a.style.display = "none";
            }
        }
        )
}

let user = false;
let username = 'users';

function messageSent(text) {
    message.innerHTML = `<p>${text}</p>
                        <i class="fa-solid fa-xmark"></i>`
    message.lastElementChild.addEventListener('click', ()=> message.innerHTML = '')
}

async function app() {
    if (!checkfields) {
        return
    }
    let url = 'http://localhost:8000/api/user/create/';
    let head = {
            "username": fieldUsername.value,
            "email": email.value,
            "password": password1.value,
            "country": search.innerHTML
        };
    try {
        let r = await fetch(url, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(head),
                })
        console.log(r.status , 'status')
        if (r.status <300 && r.status >= 200) {
            let a = await r.json();
            localStorage['keyaccess'] = a['access'];
            localStorage['keyrefresh'] = a['refresh'];
            localStorage['username'] = a['username'];
            location.replace(`/user/${localStorage['username']}/`)

        } else if ( r.status === 400) {
            let res = await r.json();
            let text= ''
            for (let i of Object.keys(res)) {
                text += `${i}: ${res[i]}\n`
            }
            messageSent(text)
        } else {
            messageSent("Serves don't available")
        }
    } catch {
        messageSent("Serves don't available")
    }
}



function checkusername() {
    let users = new Map();
    let time = new Date();
    let text= 0;
    let qe = 0;
    let sent =  function(e) {
        if (e === 'delete') {
            qe--
            console.log(qe, 'qe')
            if (qe == 0) {
                time = new Date();
                text= 0;
                qe = 0;
                console.log(sent.cash)
                if (fieldUsername.value === '') return;
                if (sent.cash.has(fieldUsername.value)) {
                  messageSent(`Name ${sent.cash.get(fieldUsername.value)?'not':''} free`)
                } else {
                 console.log('sent request ' , fieldUsername.value)
                 fetch('http://localhost:8000/api/user/check/', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json'
                      },
                      body: `{"username" : "${fieldUsername.value}"}`
                    })
                    .then(r =>{console.log(r.status); if (r.status) return r.json()})
                    .then(r =>{
                        checkUserNameSent.cash.set(r.name, r.status);
                        messageSent(`Name ${r.status?'not':''} free`);
                        })
                }
            }
            return;
        }
        let timeNow = new Date();
        if( (timeNow - time) < 1000 &&
            text != 0 &&
            fieldUsername.value != ''
            ) {
            qe++
            setTimeout(()=> {
            checkUserNameSent('delete')} , 1100)
        } else {
            setTimeout(()=> {
            checkUserNameSent()} , 500)
        }
         text = fieldUsername.value
         time = timeNow;
    }
    sent.cash = new Map()
    return sent
}

let checkUserNameSent = checkusername();
fieldUsername.addEventListener('keyup', (e)=>checkUserNameSent(e))


password1.addEventListener('keyup', (e)=>checkPassword(e))
password2.addEventListener('keyup', (e)=>checkPassword(e))

function checkPassword() {
    if (password1.value != '' && password2.value != '' ) {
        if (password1.value == password2.value) {
            messageSent('Passwords matches')
        } else {
            messageSent('Passwords not matches')
        }
    }
}

function checkfields() {
    if (
        password1.value &&
        password2.value &&
        password1.value == password2.value &&
        !checkUserNameSent.cash.get(fieldUsername.value) &&
        email.value &&
        (search.innerHTML != 'Select Country')
        ) {
            butReg.disabled = false;
            return true
        } else {
            butReg.disabled = true;
            return false
        }
}

setInterval(checkfields, 1000)
butReg.addEventListener('click', app);
