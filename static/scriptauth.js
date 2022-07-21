console.log('123');
let reg = document.getElementById('reg');
let button = document.getElementById('button-singin');
let mes = document.getElementById('message')



function Message(text) {
    const newMes = document.createElement('p')
    const buttonmes = document.createElement('button')
    newMes.innerHTML = text
    buttonmes.innerHTML = 'X'
    buttonmes.id = 'button-message'
    mes.appendChild(newMes)
    mes.appendChild(buttonmes)
    buttonmes.addEventListener('click', ()=> {buttonmes.remove() ; newMes.remove();});
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
            localStorage['username'] = username
            location.replace(`/user/${username}/`)
        }
        else if (post.status == 401) {
            console.log('message')
            if ( !document.getElementById('button-message')) {
                Message('User not authorization ')
            }
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
    registration(username, password);
}

button.addEventListener('click', postapi);
console.log(localStorage);