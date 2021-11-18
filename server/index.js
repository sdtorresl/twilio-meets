const express = require('express');

require('dotenv').config()

const PORT = process.env.PORT || 3001;
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

const app = express();

app.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
});

app.post("/api/rooms", (req, res) => {
    client.video.rooms.create('DailyStandup')
        .then(room => res.json(room))
        .catch(error => res.json({ message: error }));
})

app.get("/api/rooms/:id", (req, res) => {
    const roomId = req.params.id;
    client.video.rooms(roomId)
        .fetch()
        .then(room => res.json(room))
        .catch(error => res.json({ message: error }));;
})

/* app.get("/", (req, res) => {
    res.redirect("index.html");
});

app.get("/room/:id", (req, res) => {
    const id = req.params.id;
    console.log(`Joinning room with id ${id}`);
    res.redirect(`/room.html?id=${id}`);
});

app.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
});

app.get("/api/token", (req, res) => {


    const { identity } = request.query;

    // Create an access token which we will sign and return to the client,
    // containing the grant we just created.
    const token = new AccessToken(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_API_KEY,
        process.env.TWILIO_API_SECRET,
        { ttl: MAX_ALLOWED_SESSION_DURATION }
    );

    // Assign the generated identity to the token.
    token.identity = identity;

    // Grant the access token Twilio Video capabilities.
    const grant = new VideoGrant();
    token.addGrant(grant);

    res.json({ token });
});

 */
app.use(express.static('client'));

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});