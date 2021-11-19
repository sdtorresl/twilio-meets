document.getElementById("join-meeting").onclick = joinMeeting;

var createMeetingModal = document.getElementById('createMeetingModal')
createMeetingModal.addEventListener('show.bs.modal', createMeeting)

function createMeeting(event) {
    var modalTitle = createMeetingModal.querySelector('.modal-title')
    var modalBody = createMeetingModal.querySelector('.modal-body')

    const url = '/api/rooms';

    postData(url)
        .then(data => {
            modalTitle.textContent = `Tu reunión se ha generado`
            modalBody.innerHTML = `<a href="${getBasePath()}/room/${data.sid}" target="_blank">Haz click aquí</a>`
        })
        .error(error => {
            console.error(error)
            modalTitle.textContent = `No se ha podido generar tu reunión`
        });
}

function getBasePath() {
    return window.location.protocol + '//' + window.location.host;
}

function joinMeeting(event) {
    console.log("Join meeting");
}

async function postData(url = '', data = {}) {
    // Opciones por defecto estan marcadas con un *
    const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
}