// Copyright 2018 Google LLC
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const { google } = require("googleapis");
const auth = require("./auth");

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const ImapClient = require("emailjs-imap-client").default;
//Here we are configuring express to use body-parser as middle-ware.
const port = 4000;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// const scopes = ["https://www.googleapis.com/auth/gmail.readonly"];
const scopes = ["https://mail.google.com/"];
let gmail = null;
let profile = null;

app.get("/OAuthUrl", (req, res) => {
  const { pathname } = req.query;
  const loginUrl = auth.oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes.join(" "),
  });

  res.cookie("redirect", pathname);
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

    res.sendStatus(200);
  } catch (err) {
    res.status(400).send(err);
    console.error(err);
  }
});

app.get("/mail", async (req, res) => {
  if (!gmail) {
    res.sendStatus(401);
    return;
  }

  const client = new ImapClient("imap.gmail.com", 993, {
    auth: {
      user: profile.emailAddress,
      // xoauth2: Buffer.from(accessToken).toString("base64"),
      xoauth2: auth.oAuth2Client.credentials.access_token,
      requireTLS: true,
    },
  });

  await client.connect();

  console.log("connected!");

  const mailboxes = await client.listMailboxes();
  console.log(mailboxes);

  const messages = await client.listMessages("INBOX", "1:100", [
    "uid",
    "flags",
    "body[]",
    "X-GM-MSGID",
    "envelope",
  ]);

  console.log(messages);
  await client.close();

  res.status(200).send(messages);
  // try {
  //   const mail = [];
  //   let npt = null;
  //   while (true) {
  //     const res = await gmail.users.messages.list({
  //       userId: "me",
  //       maxResults: 1000,
  //       pageToken: npt,
  //     });
  //     mail.push(...res.data.messages);
  //     npt = res.data.nextPageToken;
  //     // if (!res.data.nextPageToken) break;
  //     break;
  //   }
  //   const messages = [];
  //   const promises = mail.map(async (m) => {
  //     const msg = await gmail.users.messages.get({
  //       id: mail[0].id,
  //       userId: "me",
  //     });
  //     messages.push(msg);
  //     console.log(messages.length);
  //   });
  //   await Promise.all(promises);
  //   res.status(200).send(mail);
  // } catch (err) {
  //   res.status(400).send(err);
  // }
});

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);

// async function runSample() {
//   const res = await gmail.users.messages.list({ userId: "me" });
//   console.log(res.data);
//   return res.data;
// }

// if (module === require.main) {
//   const scopes = ["https://www.googleapis.com/auth/gmail.readonly"];
//   auth.authenticate(scopes).then(runSample).catch(console.error);
// }
