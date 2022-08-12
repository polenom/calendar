let reg = document.getElementById('reg');
let button = document.getElementById('button-singin');
let mes = document.getElementById('message')



function Message(text) {
    mes.innerHTML = `<p>${text}</p>
                     <i class="fa-solid fa-xmark" id='buttondelmes'></i>`
    document.getElementById('buttondelmes').addEventListener('click', ()=> {mes.innerHTML = ''});
}

function registration(username, password) {
    let  post = new XMLHttpRequest();
    let  head = {
            "username": username,
            "password": password,
        };

    post.open("POST", "http://localhost:8000/api/token/obtain/", true);
    post.setRequestHeader("Content-Type", "application/json");
    post.responseType = 'json';
    post.onload = () => {
        if (post.status == 200) {
            localStorage['keyaccess'] = post.response['access'];
            localStorage['keyrefresh'] = post.response['refresh'];
            localStorage['username'] = username;
            location.replace(`/user/${username}/`)
        }
        else if (post.status == 401) {
                Message('Username or password incorrect')
        }

    };
    post.onerror = () => {
        console.log('aller');
    };
    post.send(JSON.stringify(head));
}


function postapi() {
    let username = document.getElementById('floatingInput').value;
    let password = document.getElementById('floatingPassword').value;
    if (username && password) {
      registration(username, password);
    } else {
        Message('Input username and password')
    }
}
button.addEventListener('click', postapi);


