const simpleParser = require("mailparser").simpleParser;

const source = `MIME-Version: 1.0
Date: Thu, 30 Apr 2020 15:46:29 +0530
Message-ID: <CAJhzi6qsfYQz7KXownws8u96D31UTtcNVyhkOygRGrO+H3ctTA@mail.gmail.com>
Subject: test2
From: Aashwin Varshney <aashwin.varshney@gmail.com>
To: john.newell2@gmail.com
Content-Type: multipart/alternative; boundary="000000000000ce124905a47f5b0e"

--000000000000ce124905a47f5b0e
Content-Type: text/plain; charset="UTF-8"

asdfsdfsdf

--000000000000ce124905a47f5b0e
Content-Type: text/html; charset="UTF-8"

<div dir="ltr">asdfsdfsdf</div>

--000000000000ce124905a47f5b0e--`;
simpleParser(source)
  .then((parsed) => {
    console.log(parsed);
  })
  .catch((err) => {
    throw err;
  });
