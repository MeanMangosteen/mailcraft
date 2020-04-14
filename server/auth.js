// Copyright 2016 Google LLC
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

"use strict";

/**
 * This is used by several samples to easily provide an oauth2 workflow.
 */

// [START auth_oauth2_workflow]
const { google } = require("googleapis");
const http = require("http");
const url = require("url");
const opn = require("open");
const destroyer = require("server-destroy");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const invalidRedirectUri = `The provided keyfile does not define a valid
redirect URI. There must be at least one redirect URI defined, and this sample
assumes it redirects to 'http://localhost:3000/oauth2callback'.  Please edit
your keyfile, and add a 'redirect_uris' section.  For example:

"redirect_uris": [
  "http://localhost:3000/oauth2callback"
]
`;

class SampleClient {
  constructor(options) {
    this._options = options || { scopes: [] };

    // validate the redirectUri.  This is a frequent cause of confusion.
    if (!process.env.OAUTH2_REDIRECT_URI) {
      throw new Error(invalidRedirectUri);
    }
    const redirectUri = process.env.OAUTH2_REDIRECT_URI;
    const parts = new url.URL(redirectUri);
    if (
      redirectUri.length === 0 ||
      parts.port !== "3000" ||
      parts.hostname !== "localhost" ||
      parts.pathname !== "/"
    ) {
      throw new Error(invalidRedirectUri);
    }

    // create an oAuth client to authorize the API call
    this.oAuth2Client = new google.auth.OAuth2(
      process.env.GMAIL_CLIENT_ID,
      process.env.GMAIL_CLIENT_SECRET,
      redirectUri
    );
  }

  // Open an http server to accept the oauth callback. In this
  // simple example, the only request to our webserver is to
  // /oauth2callback?code=<code>
  async authenticate(scopes) {
    return new Promise((resolve, reject) => {
      // grab the url that will be used for authorization
      const test = this.oAuth2Client.generateAuthUrl({
        access_type: "offline",
        scope: scopes.join(" "),
      });
      const server = http
        .createServer(async (req, res) => {
          try {
            if (req.url.indexOf("/") > -1) {
              const qs = new url.URL(req.url, "http://localhost:3000")
                .searchParams;
              res.end(
                "Authentication successful! Please return to the console."
              );
              server.destroy();
              const { tokens } = await this.oAuth2Client.getToken(
                qs.get("code")
              );
              this.oAuth2Client.credentials = tokens;
              resolve(this.oAuth2Client);
            }
          } catch (e) {
            reject(e);
          }
        })
        .listen(3000, () => {
          // open the browser to the authorize url to start the workflow
          console.log(test);
        });
      destroyer(server);
    });
  }
}
// [END auth_oauth2_workflow]
module.exports = new SampleClient();
