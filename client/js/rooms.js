const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const roomSid = urlParams.get("id")

console.log(`Joining room with SID ${roomSid}`)