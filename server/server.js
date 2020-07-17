const { google } = require("googleapis");
const auth = require("./auth");

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const app = express();
const ImapClient = require("emailjs-imap-client").default;
const simpleParser = require("mailparser").simpleParser;
const cookieParser = require('cookie-parser')

const port = 4000;
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());

const authMiddleware = async (req, res, next) => {
  const authDeets = {
    user: req.cookies.profile,
    xoauth2: req.cookies.access_token,
    requireTLS: true,
  };

  console.log('in middleware', authDeets);
  req['authDeets'] = authDeets;
  next();
};


const scopes = ["https://mail.google.com/"];
let gmail = null;
let profile = null;
let client = null; // TODO: change name to imap

const demo = false;

app.get("/OAuthUrl", (req, res) => {
  const loginUrl = auth.oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes.join(" "),
  });

  res.status(200).send(loginUrl);
});

app.post("/OAuthConfirm", async (req, res) => {
  const { code } = req.body;

  if (!code) {
    res.status(400).send("Missing 'code' parameter");
  }

  const { tokens } = await auth.oAuth2Client.getToken(code);
  auth.oAuth2Client.credentials = tokens;
  console.log(tokens);

  try {
    gmail = google.gmail({
      version: "v1",
      auth: auth.oAuth2Client,
    });

    profile = (
      await gmail.users.getProfile({
        userId: "me",
      })
    ).data;

    res.cookie('access_token', tokens.access_token, {
      expires: new Date(Date.now() + 8 * 3600000), // cookie will be removed after 8 hours
      httpOnly: true,
      sameSite: true,
      // secure: true,
    }).cookie('profile', profile.emailAddress, {
      expires: new Date(Date.now() + 8 * 3600000), // cookie will be removed after 8 hours
      httpOnly: true,
      sameSite: true,
    });

    res.status(200).send({});

  } catch (err) {
    res.status(400).send(err);
    console.error(err);
  }
});

app.post("/trash-mail", authMiddleware, async (req, res) => {
  const { uids } = req.body;
  if (!uids) {
    res.status(400).send("Missing 'uids' parameter");
  }

  try {
    client = new ImapClient("imap.gmail.com", 993, { auth: req.authDeets });
    await client.connect();
    const response = await client.moveMessages(
      "INBOX",
      uids.join(","),
      "[Gmail]/Trash",
      { byUid: true }
    );
    console.log(response);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(400).send(err);
  } finally {
    await client.close()
  }
});

app.post("/spam-mail", authMiddleware, async (req, res) => {
  const { uids } = req.body;
  if (!uids) {
    res.status(400).send("Missing 'uids' parameter");
  }

  client = new ImapClient("imap.gmail.com", 993, { auth: req.authDeets });
  try {
    await client.connect();
    const response = await client.moveMessages(
      "INBOX",
      uids.join(","),
      "[Gmail]/Spam",
      { byUid: true }
    );
    console.log(response);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(400).send(err);
  }
});

app.post("/read-mail", authMiddleware, async (req, res) => {
  if (demo) {
    return res.sendStatus(200);
  }

  const { uids } = req.body;
  if (!uids) {
    res.status(400).send("Missing 'uids' parameter");
  }

  client = new ImapClient("imap.gmail.com", 993, { auth: req.authDeets });
  try {
    await client.connect();
    const response = await client.setFlags(
      "INBOX",
      uids.join(","),
      {
        remove: ["\\Seen"], // OMGTODO: change to add.
      },
      { byUid: true }
    );
    console.log(response);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
  }
});

app.get("/mail", authMiddleware, async (req, res) => {
  if (demo) {
    const messages = fs.readFileSync('demo.json');
    return res.status(200).send(messages);
  }


  client = new ImapClient("imap.gmail.com", 993, {
    auth: req.authDeets,
  });

  try {
    await client.connect();

    console.log("connected!");

    const mailboxes = await client.listMailboxes();
    console.log(mailboxes);

    const inbox = await client.selectMailbox("INBOX");

    // OMGTODO:
    // const messageIds = await client.search("INBOX", { unseen: true });
    // const messages = await client.listMessages("INBOX", messageIds.join(","), [
    const messages = await client.listMessages(
      "INBOX",
      `${inbox.exists - 100}:${inbox.exists}`,
      ["uid", "flags", "body.peek[]", "X-GM-MSGID", "X-GM-THRID", "envelope"]
    );

    await client.close();

    const parsePromises = messages.map((m) => {
      return new Promise((resolve, reject) => {
        simpleParser(m["body[]"])
          .then((goodStuff) => {
            m["body[]"] = goodStuff;
            resolve();
          })
          .catch((err) => {
            reject(err);
          });
      });
    });

    await Promise.all(parsePromises);

    const data = JSON.stringify(messages);
    fs.writeFileSync('demo.json', data);
    res.status(200).send(messages);
  } catch (err) {
    console.error(err);
    if (err.code === "AUTHENTICATIONFAILED") {
      res.status(401).send("Try logging in again m8y");
    }
  }
});

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);