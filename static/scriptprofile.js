const search = document.querySelector('.selected');
const option = document.querySelector('.options-container');
const inputbox = document.querySelector('.search-box');
const user= {};
const username = document.getElementById('username')
const firstname = document.getElementById('firstname')
const lastname = document.getElementById('lastname')
const email = document.getElementById('email')
const butSave = document.getElementById('button-save')
const butBack = document.getElementById('button-back')

butBack.addEventListener('click', ()=>{document.location.href = `http://localhost:8000/user/${localStorage['username']}`})

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


async function requestF() {
    if (localStorage['keyrefresh'] == undefined) {
        messegeSent("You don't login")
        return
    }
    if (!checkToken()) {
        if (!getNewToken()) {
            messegeSent("You must relogin")
            return
        }
    }
    let res = await fetch(`http://localhost:8000/api/user/get/${localStorage['username']}/`,{
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'tk ' + localStorage['keyaccess']
            }
        })
    if (res.url == `http://localhost:8000/api/user/get/${localStorage['username']}/` && res.status == 200 ) {
        let obj = await res.json()
        for (let i of Object.keys(obj)) {
            user[i] = obj[i]
        }
        search.innerHTML = user.country
        username.value = localStorage['username']
        firstname.value = user.first_name
        lastname.value = user.last_name
        email.value = user.email
    }
}

async function getNewToken() {
    if (!checkToken(localStorage['keyrefresh'])){
        return false;
    }
    let res = await fetch('localhost:8000/api/token/refresh/',{
        method: "POST",
        headers: {
                'Content-Type': 'application/json'
            },
        body: `{ "refresh": "${localStorage}" }`
        })
    if (res.status == 200 ) {
       let newKey = await res.json();
       localStorage['keyrefresh'] = newKey['refresh']
       localStorage['keyaccess'] = newKey['access']
       localStorage['username'] = JSON.parse(atob(newKey['access'].split('.')[1]))['username']
    } else {
        return false
    }


    return true;
}

function checkToken(tok) {
        if (tok == undefined) {
            tok = localStorage['keyaccess']
        }
        const data= JSON.parse(atob(tok.split('.')[1]));
        if (data['exp'] > (new Date().getTime()+1)/1000) {
            return true;
        }
        return false;
    };

function sendMessage(text) {
    console.log(text)
}

async function saveChange() {
    if (user.first_name == firstname.value &&
        user.last_name == lastname.value &&
        user.email == email.value &&
        user.country == search.innerHTML
        ) {
       console.log('not change in form')
       return
    }
     if (localStorage['keyrefresh'] == undefined) {
            messegeSent("You don't login")
            return
        }
    if (!checkToken()) {
            if (!getNewToken()) {
                    messegeSent("You must relogin")
                    return
                }
        }
    let body = {
                "email": email.value ,
                "country": search.innerHTML,
                "first_name": firstname.value,
                "last_name": lastname.value
            }
    let  res = await fetch(`http://localhost:8000/api/user/get/${user.username}/`,{
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'tk ' + localStorage['keyaccess']
        },
        body: JSON.stringify(body)
    })
    if (res.status == 200) {
        let date = await res.json()
        for (let i of Object.keys(date)) {
            user[i] = date[i]
        }
        sendMessage('Change saved')
    }

}


requestF()
butSave.addEventListener('click', saveChange)
