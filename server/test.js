var ImapClient = require("emailjs-imap-client").default;

const accessToken =
  "ya29.a0Ae4lvC1n7G7kFa3VQid4We8OhJyv2gfbqeK38JyzxZ0O8FL1lCGNUYhzlGzo08QcXAzpDtcNQhIR06qJ_aW_Dwy-PgxlaMMhGvAybQc66Mao_OxEIo8wXWt7519Ccn1KY1pKw7yVI3ADLmfyNOeo9KXSIORdW_iay9Q";
var client = new ImapClient("imap.gmail.com", 993, {
  auth: {
    user: "john.newell2@gmail.com",
    // xoauth2: Buffer.from(accessToken).toString("base64"),
    xoauth2: accessToken,
    requireTLS: true,
  },
});

const run = async () => {
  try {
    await client.connect();

    console.log("connected!");

    const mailboxes = await client.listMailboxes();
    console.log(mailboxes);

    const messages = await client.listMessages("INBOX", "1:10", [
      "uid",
      "flags",
      "body[]",
      "X-GM-MSGID",
      "envelope",
    ]);

    console.log(messages);
    await client.close();
  } catch (err) {
    throw err;
  }
};

run().then(() => {
  console.log("finished!");
});
