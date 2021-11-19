'use strict';

const Video = require('twilio-video');

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const roomSid = urlParams.get("roomId")
const identity = urlParams.get("identity")

console.log(`Joining room with SID ${roomSid}`)
console.log(`Identity ${identity}`)

async function joinRoom() {
    // Fetch an AccessToken to join the Room.
    const response = await fetch(`/api/token?identity=${identity}`);
    const token = await response.text();
    console.log(`Token: ${token}`)

    const connectOptions = {}
    connectOptions.name = roomSid;

    console.log(`Connecting with parameters ${JSON.stringify(connectOptions)}`)

    Video.connect(token, connectOptions).then(room => {
        console.info('Connected to room "%s"', room.name);

        room.participants.forEach(participantConnected);
        room.on('participantConnected', participantConnected);
        room.on('participantDisconnected', participantDisconnected);
        room.once('disconnected', error => room.participants.forEach(participantDisconnected));
    }).catch(error => {
        console.error(error)
    });
}

function participantConnected(participant) {
    console.log('Participant "%s" connected', participant.identity);

    const div = document.createElement('div');
    div.id = participant.sid;
    div.innerText = participant.identity;

    participant.on('trackSubscribed', track => trackSubscribed(div, track));
    participant.on('trackUnsubscribed', trackUnsubscribed);

    participant.tracks.forEach(publication => {
        if (publication.isSubscribed) {
            trackSubscribed(div, publication.track);
        }
    });

    document.body.appendChild(div);
}

function participantDisconnected(participant) {
    console.log('Participant "%s" disconnected', participant.identity);
    document.getElementById(participant.sid).remove();
}

function trackSubscribed(div, track) {
    div.appendChild(track.attach());
}

function trackUnsubscribed(track) {
    track.detach().forEach(element => element.remove());
}

joinRoom()