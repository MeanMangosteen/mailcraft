require("dotenv").config();
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
const nodemailer = require("nodemailer");
const path = require("path");


const port = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../client/build')));


const authMiddleware = async (req, res, next) => {
  const authDeets = {
    user: req.cookies.profile,
    xoauth2: req.cookies.access_token,
    requireTLS: true,
    useSecureTransport: true
  };

  let client;
  try {
    client = new ImapClient("imap.gmail.com", 993, { auth: authDeets });
    await client.connect();

    req['imap'] = client;
    next();
  } catch (err) {
    console.error(err);
    if (err.code === "AUTHENTICATIONFAILED") {
      res.status(401).send("Try logging in again m8y");
    }
    await client.close()
  }
};


const scopes = ["https://mail.google.com/"];

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

  try {
    const gmail = google.gmail({
      version: "v1",
      auth: auth.oAuth2Client,
    });

    const profile = (
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
    await req.imap.setFlags(
      "INBOX",
      uids.join(","),
      {
        set: ["\\Seen"],
      },
      { byUid: true }
    );
    const response = await req.imap.moveMessages(
      "INBOX",
      uids.join(","),
      "[Gmail]/Trash",
      { byUid: true }
    );
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(400).send(err);
  } finally {
    await req.imap.close()
  }
});

app.post("/spam-mail", authMiddleware, async (req, res) => {
  const { uids, mailbox } = req.body;
  if (!uids) {
    res.status(400).send("Missing 'uids' parameter");
  }

  try {
    await req.imap.setFlags(
      "INBOX",
      uids.join(","),
      {
        set: ["\\Seen"],
      },
      { byUid: true }
    );
    const response = await req.imap.moveMessages(
      "INBOX",
      uids.join(","),
      "[Gmail]/Spam",
      { byUid: true }
    );
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(400).send(err);
  } finally {
    await req.imap.close()
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

  try {
    const response = await req.imap.setFlags(
      "INBOX",
      uids.join(","),
      {
        set: ["\\Seen"],
      },
      { byUid: true }
    );
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
  } finally {
    await req.imap.close()
  }
});

app.get("/unreadUids", authMiddleware, async (req, res) => {
  // let client;
  if (demo) {
    const dummyUids = new Array(1000);
    return res.status(200).send(dummyUids.fill(1));
  }

  try {
    // client = new ImapClient("imap.gmail.com", 993, { auth: req.authDeets, });
    // await client.connect();
    const unreadUids = await req.imap.search('INBOX', { unseen: true }, { byUid: true });
    const unreadMailCount = unreadUids.length;
    res.status(200).send(unreadUids);
  } catch (err) {
    console.error(err);
    res.status(400).send(err);
  } finally {
    await req.imap.close();
  }

});

app.get("/mail", authMiddleware, async (req, res) => {
  if (demo) {
    const messages = fs.readFileSync('server/demo.json');
    return res.status(200).send(messages);
  }

  const { uids } = req.query;



  try {


    const messages = await req.imap.listMessages(
      "INBOX",
      JSON.parse(uids).join(),
      ["uid", "body.peek[]", "X-GM-THRID", "envelope"],
      { byUid: true }
    );

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

    res.status(200).send(messages);
  } catch (err) {
    console.error(err);
    if (err.code === "AUTHENTICATIONFAILED") {
      res.status(401).send("Try logging in again m8y");
    }
  } finally {
    await req.imap.close()
  }
});



app.post("/sendMessage", async (req, res) => {
  try {

    const { message } = req.body
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.CONTACT_EMAIL,
        pass: process.env.CONTACT_EMAIL_APP_PASSWORD,
      },
    });

    let info = await transporter.sendMail({
      from: '"Fred Foo 👻" <say.hi.mailcraft@gmail.com>', // sender address
      to: "say.hi.mailcraft@gmail.com", // list of receivers
      subject: "Hello ✔", // Subject line
      text: message, // plain text body
    });

    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(400).send(err);
  }
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/../client/build/index.html'));
});

app.listen(port, () =>
  console.log(`App listening at http://localhost:${port}`)
);