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

const gmail = google.gmail({
  version: "v1",
  auth: auth.oAuth2Client,
});

const express = require("express");
const cors = require("cors");
const app = express();
const port = 4000;

app.use(cors());

app.get("/", (req, res) => res.send("Hello World!"));

app.get("/OAuthUrl", (req, res) => {
  const scopes = ["https://www.googleapis.com/auth/gmail.readonly"];
  const loginUrl = auth.oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes.join(" "),
  });

  res.status(200).send(loginUrl);
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
