const butReg = document.getElementById('button-reg');
const response  = [];
const message = document.getElementById('message');
const mesPass = document.getElementById('password-mes');
const password1 = document.getElementById("floatingPassword1");
const password2 = document.getElementById("floatingPassword2");
const fieldUsername = document.getElementById('floatingInput');
const email = document.getElementById('floatingEmail');
let user = false;

let username = 'users';
function app () {
    const url = 'http://localhost:8000/api/user/create/';
    const head = {
        "username": fieldUsername.value,
        "email": email.value,
        "password": password1.value
    };
    connect(url, "POST", head)
}



function connect(url, method, head){
    const conPost = new XMLHttpRequest();
    conPost.open(method, url, true)
    conPost.setRequestHeader("Content-Type", "application/json");
    conPost.responseType = 'json';
    conPost.onload = () =>{
        response.push(conPost);
    }
    conPost.send(JSON.stringify(head));

}

function checkusername() {
    const fieldUsername = document.getElementById('floatingInput');
    if (fieldUsername.value && username != fieldUsername.value ) {
        username = fieldUsername.value
        connect('http://localhost:8000/api/user/check/', "POST", {"username": username})
    }
}

function checkResponse() {
    if (response) {
       for (let i = 0; i < response.length; i++)
       {
           if (response[i].responseURL == "http://localhost:8000/api/user/check/") {
                if( response[i].status == 200) {
                    message.innerHTML = response[i].response['status']? 'username busy': 'username free'
                    user = response[i].response['status']?false:true;
                    response.splice(i,1);
                }
           } else if (response[i].responseURL == "http://localhost:8000/api/user/create/" && response[i].status == 201) {
                    console.log(response[i])
                    localStorage['keyaccess'] = response[i].response['access'];
                    localStorage['keyrefresh'] = response[i].response['refresh'];
                    localStorage['username'] = response[i].response['username'];
                    location.replace(`/user/${localStorage['username']}/`)
                }
       }
    }
}



function checkPassword() {
    if (password1.value != '' && password2.value != '' ) {
        if (password1.value == password2.value) {
            mesPass.innerHTML = ''
        } else {
            mesPass.innerHTML = "Passwords does't matches"
        }
    }
    else {
        mesPass.innerHTML = ''
    }
}

function checkfields() {
    if (
        password1.value &&
        password2.value &&
        password1.value == password2.value &&
        fieldUsername.value &&
        email.value  &&
        user
        ) {
            butReg.disabled = false;
        } else {
            butReg.disabled = true;
        }
}

setInterval(checkfields, 1000)
setInterval(checkPassword, 1000)
setInterval(checkusername, 2000)
setInterval(checkResponse, 2000)
butReg.addEventListener('click', app);
