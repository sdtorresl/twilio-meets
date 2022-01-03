'use strict';

const Video = require('twilio-video');

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const roomSid = urlParams.get("roomId")
const identity = urlParams.get("identity")

let roomP1 = null;

console.log(`Joining room with SID ${roomSid}`)
console.log(`Identity ${identity}`)

/**
 * Mute/unmute your media in a Room.
 * @param {Room} room - The Room you have joined
 * @param {'audio'|'video'} kind - The type of media you want to mute/unmute
 * @param {'mute'|'unmute'} action - Whether you want to mute/unmute
 */
 function muteOrUnmuteYourMedia(room, kind, action) {
    const publications = kind === 'audio'
      ? room.localParticipant.audioTracks
      : room.localParticipant.videoTracks;
  
    publications.forEach(function(publication) {
      if (action === 'mute') {
        publication.track.disable();
      } else {
        publication.track.enable();
      }
    });
  }
  
  /**
 * Unmute your video in a Room.
 * @param {Room} room - The Room you have joined
 * @returns {void}
 */
function unmuteYourVideo(room) {
    muteOrUnmuteYourMedia(room, 'video', 'unmute');
  }
  
  /**
   * Mute your video in a Room.
   * @param {Room} room - The Room you have joined
   * @returns {void}
   */
  function muteYourVideo(room) {
    muteOrUnmuteYourMedia(room, 'video', 'mute');
  }

  /**
 * Get the Room credentials from the server.
 * @param {string} [identity] identitiy to use, if not specified use random name.
 * @returns {Promise<{identity: string, token: string}>}
 */
async function getRoomCredentials(identity) {
    const response = await fetch(`/api/token?identity${identity}`);
    const token = await response.text();
    return { identity, token };
  }

const muteVideoBtn = document.getElementById("btn-video");

muteVideoBtn.onclick = function() {
    
    const mute = !muteVideoBtn.classList.contains('muted');

    if(mute) {
      muteYourVideo(roomP1);
      console.log('Video disabled')

      muteVideoBtn.classList.add('muted');
      muteVideoBtn.innerText = 'Enable Video';
    } else {
      unmuteYourVideo(roomP1);
      console.log('Video enabled')

      muteVideoBtn.classList.remove('muted');
      muteVideoBtn.innerText = 'Disable Video';
    }
}; 

async function joinRoom() {
    // Fetch an AccessToken to join the Room.
    
    const response = await fetch(`/api/token?identity=${identity}`);
    const token = await response.text();
    console.log(`Token: ${token}`)

    const connectOptions = {}
    connectOptions.name = roomSid;
    connectOptions.preferredVideoCodecs = ['H264']
    //connectOptions.tracks = localVideoTrack; 

    console.log(`Connecting with parameters ${JSON.stringify(connectOptions)}`)

    Video.connect(token, connectOptions).then(room => {

        roomP1 = room;
        console.info('Connected to room "%s"', roomP1.name);

        let localVideoTrack = Array.from(room.localParticipant.videoTracks.values())[0].track;
        

        participantConnected(room.localParticipant);

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
    div.className = 'participant'
    //div.innerText = participant.identity;

    const participantName = document.createElement('div')
    participantName.innerText = participant.identity
    participantName.className = 'participant-name'

    div.appendChild(participantName)

    participant.on('trackSubscribed', track => trackSubscribed(div, track));
    participant.on('trackUnsubscribed', trackUnsubscribed);

    participant.tracks.forEach(publication => {
        console.log(publication);
        // If the TrackPublication is already subscribed to, then attach the Track to the DOM.
        if (publication.track) {
            trackSubscribed(div, publication.track);
        }
    });

    const participantContainer = document.getElementById("participants")

    participantContainer.appendChild(div);
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

(() => {
  console.log('add twilio video monitor');
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/@twilio/video-room-monitor/dist/browser/twilio-video-room-monitor.min.js';
  
  document.body.appendChild(script);
})();


joinRoom()