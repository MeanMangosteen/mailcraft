import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import Axios from "axios";
import { useMail } from "../reducers/mail";
import styled from "styled-components";
import htmlToReactParser from "html-to-react";
import htmlToImage from "html-to-image";
import IframeResizer from "iframe-resizer-react";

const MassDestruction = () => {
  const location = useLocation();
  const qParams = queryString.parse(location.search);
  const { mail } = useMail();
  const htmlParser = new htmlToReactParser.Parser();
  const [victimEmails, setVictimEmails] = useState<any[] | null>(null);
  const [imgUri, setImgUri] = useState<any>(null);
  const testRef = useRef(null);
  const [trigger, setTrigger] = useState<any>(null);

  console.log("parser", htmlParser);
  const TestC = htmlParser.parse("<h1>Hi!</h1>");

  useEffect(() => {
    if (!qParams.victim) throw Error("Victim needed to destroy!");
    if (!mail) return;

    const filteredMail = mail.filter(
      (m) => m.envelope.from[0].address.split("@")[1] === qParams["victim"]
    );
    console.log(mail);
    console.log(filteredMail);
    setVictimEmails(filteredMail);
  }, [mail]);

  //   useEffect(() => {
  //     if (!victimEmails) return;
  //     htmlToImage
  //       //   .toPng(htmlParser.parse(victimEmails[0]["body[]"].html))
  //       .toPng(TestC)
  //       .then((uri) => {
  //         setImgUri(uri);
  //       });
  //   }, [htmlParser, victimEmails]);

  // Render mail

  //   console.log("ref", testRef);
  //   const work = (
  //     <div ref={testRef}>
  //       <h1>hi!</h1>
  //     </div>
  //   );
  //   const parsed = htmlParser.parse(work);
  //   return (
  //     <PageContainer>
  //       <MailCard>
  //         {/* {work} */}
  //         {/* {victimEmails ? htmlParser.parse(victimEmails[0]["body[]"].html) : null} */}
  //         {/* <img src={trigger} alt="Life is beautiful!" /> */}
  //       </MailCard>
  //       <MailCard
  //       // onClick={async () => {
  //       //   const test: any = testRef.current;
  //       //   const parsed = await htmlToImage.toPng(
  //       //     <div>
  //       //       <p>hiya</p>
  //       //     </div>
  //       //   );
  //       //   setTrigger(parsed);
  //       // }}
  //       />
  //       <MailCard>
  //         <IframeResizer
  //           log
  //           title="Dr. Nick"
  //           srcDoc={victimEmails ? victimEmails[0]["body[]"].html : ""}
  //           style={{ width: "1px", minWidth: "100%" }}
  //         />
  //         {/* <ThumbnailFrame
  //           title="Dr. Nick"
  //           srcDoc={victimEmails ? victimEmails[0]["body[]"].html : ""}
  //         /> */}
  //       </MailCard>
  //       <MailCard>
  //         {/* <IframeResizer
  //           log
  //           title="Dr. Nick"
  //           srcDoc={victimEmails ? victimEmails[0]["body[]"].html : ""}
  //           style={{ width: "1px", minWidth: "100%" }}
  //         /> */}
  //         <IframeResizer
  //           log
  //           src="http://example.com/"
  //           style={{ width: "1px", minWidth: "100%" }}
  //         />
  //       </MailCard>
  //     </PageContainer>
  //   );

  return (
    <PageContainer>
      <MailCard>
        <ThumbnailFrame
          title="Dr. Nick"
          srcDoc={victimEmails ? victimEmails[0]["body[]"].html : ""}
        />
      </MailCard>
      <MailCard />
      <MailCard />
      <MailCard />
    </PageContainer>
  );
};
const ThumbnailFrame = styled.iframe`
  flex-grow: 1;
  display: block;
  width: 100%;
`;
const PageContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const MailCard = styled.div`
  /* display: flex; */

  flex-grow: 1;
  flex-basis: 33%;
  margin: 1px;
  border: black 1px solid;
`;

export { MassDestruction };
