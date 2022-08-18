const butReg = document.getElementById('button-reg');
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

function app() {
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
    fetch(url, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json'
                      },
                      body: JSON.stringify(head);
                    }).then(res=> if ( res.status) return res.json).then(res=> console.log(res))
}


//function app() {
//    const url = 'http://localhost:8000/api/user/create/';
//    const head = {
//        "username": fieldUsername.value,
//        "email": email.value,
//        "password": password1.value
//    };
//    connect(url, "POST", head)
//}



//function connect(url, method, head){
//    const conPost = new XMLHttpRequest();
//    conPost.open(method, url, true)
//    conPost.setRequestHeader("Content-Type", "application/json");
//    conPost.responseType = 'json';
//    conPost.onload = () =>{
//        response.push(conPost);
//    }
//    conPost.send(JSON.stringify(head));
//
//}


function checkusername() {
    let users = new Map();
    let time = new Date();
    let text= 0;
    let qe = 0;
    let sent =  function(e) {
        if (e === 'delete') {
            qe--
            if (qe == 0) {
                time = new Date();
                text= 0;
                qe = 0;
                console.log(sent.cash)
                if (fieldUsername.value === '') return;
                if (sent.cash.has(fieldUsername.value)) {
                  messageSent(`Name ${sent.cash.get(fieldUsername.value)?'not':''} free`)
                } else {
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
        }
         text = fieldUsername.value
         time = timeNow;
    }
    sent.cash = new Map()
    return sent
}

let checkUserNameSent = checkusername();
fieldUsername.addEventListener('keyup', (e)=>checkUserNameSent(e))



//function checkResponse() {
//    if (response) {
//       for (let i = 0; i < response.length; i++)
//       {
//           if (response[i].responseURL == "http://localhost:8000/api/user/check/") {
//                if( response[i].status == 200) {
//                    message.innerHTML = response[i].response['status']? 'username busy': 'username free'
//                    user = response[i].response['status']?false:true;
//                    response.splice(i,1);
//                }
//           } else if (response[i].responseURL == "http://localhost:8000/api/user/create/" && response[i].status == 201) {
//                    console.log(response[i])
//                    localStorage['keyaccess'] = response[i].response['access'];
//                    localStorage['keyrefresh'] = response[i].response['refresh'];
//                    localStorage['username'] = response[i].response['username'];
//                    location.replace(`/user/${localStorage['username']}/`)
//                }
//       }
//    }
//}

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
    console.log(search.innerHTML != 'Select Country')
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
