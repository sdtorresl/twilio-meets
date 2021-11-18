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

    // Add the specified audio device ID to ConnectOptions.
    connectOptions.audio = { deviceId: { exact: deviceIds.audio } };

    // Add the specified Room name to ConnectOptions.
    connectOptions.name = roomName;

    // Add the specified video device ID to ConnectOptions.
    connectOptions.video.deviceId = { exact: deviceIds.video };
}

joinRoom()