window.onload = function () {
    console.log("Window loaded");

    document.getElementById("join-meeting").onclick = joinMeeting;

    var createMeetingModal = document.getElementById('createMeetingModal')
    createMeetingModal.addEventListener('show.bs.modal', function (event) {
        var modalTitle = createMeetingModal.querySelector('.modal-title')
        var modalBodyInput = createMeetingModal.querySelector('.modal-body input')

        modalTitle.textContent = 'New message to ' + "Test"
        modalBodyInput.value = recipient
    })

};

function createMeeting(event) {
    console.log("Create meeting");
}

function joinMeeting(event) {
    console.log("Join meeting");
}

