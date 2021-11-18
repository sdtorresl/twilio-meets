window.onload = function() {
    console.log("Window loaded");

    document.getElementById("join-meeting").onclick = joinMeeting;

    var createMeetingModal = document.getElementById('createMeetingModal')
    createMeetingModal.addEventListener('show.bs.modal', function(event) {
        var modalTitle = createMeetingModal.querySelector('.modal-title')
        var modalBody = createMeetingModal.querySelector('.modal-body')

        const Http = new XMLHttpRequest();
        const url = '/api/rooms';
        Http.open("POST", url);
        Http.send();

        Http.onreadystatechange = (e) => {
            const response = JSON.parse(Http.responseText)
            console.log(response)
            modalTitle.textContent = `Tu reunión se ha generado`
            modalBody.textContent = `http://localhost:3001/${response.sid}`
        }


    })

};

function createMeeting(event) {
    console.log("Create meeting");
}

function joinMeeting(event) {
    console.log("Join meeting");
}