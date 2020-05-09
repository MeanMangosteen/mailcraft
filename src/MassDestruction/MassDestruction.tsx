import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import Axios from "axios";
import { useMail } from "../reducers/mail";
import styled from "styled-components";
import htmlToReactParser from "html-to-react";
import htmlToImage from "html-to-image";
import IframeResizer from "iframe-resizer-react";
import Measure from "react-measure";

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

  const [americanDimensions, setAmericanDimensions] = useState<any>(null);

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

  const handleResize = (rect) => {
    console.log(rect);
    setAmericanDimensions({
      width: rect.scroll.width,
      height: rect.scroll.height,
    });
  };

  const handleLoad = (something) => {
    console.log(something);
    setAmericanDimensions({
      width: something.target.contentWindow.document.body.scrollWidth,
      height: something.target.contentWindow.document.body.scrollHeight,
    });
  };
  return (
    <PageContainer>
      {/* <Measure
        bounds
        scroll
        onResize={handleResize}
        innerRef={(ref) => {
          console.log(ref);
        }}
      >
        {({ measureRef }) => (
          <ThumbnailFrame
            ref={measureRef}
            id="test"
            title="Dr. Nick"
            srcDoc="<h1>hi</h1><h1>hi</h1><h1>hi</h1><h1>hi</h1><h1>hi</h1><h1>hi</h1><h1>hi</h1><h1>hi</h1><h1>hi</h1><h1>hi</h1><h1>hi</h1><h1>hi</h1><h1>hi</h1><h1>hi</h1><h1>hi</h1><h1>hi</h1><h1>hi</h1><h1>hi</h1><h1>hi</h1><h1>hi</h1><h1>hi</h1><h1>hi</h1><h1>hi</h1><h1>hi</h1>"
          />
        )}
      </Measure> */}
      <iframe
        title="Hey, look an iframe!"
        srcDoc="<h1>hi</h1><h1>hi</h1><h1>hi</h1><h1>hi</h1><h1>hi</h1><h1>hi</h1><h1>hi</h1><h1>hi</h1><h1>hi</h1><h1>hi</h1><h1>hi</h1><h1>hi</h1><h1>hi</h1><h1>hi</h1><h1>hi</h1><h1>hi</h1><h1>hi</h1><h1>hi</h1><h1>hi</h1><h1>hi</h1><h1>hi</h1><h1>hi</h1><h1>hi</h1><h1>hi</h1>"
        width="100%"
        height="100%"
        style={americanDimensions && { ...americanDimensions }}
        onLoad={handleLoad}
      />
      {/* <MailCard>
        <Measure bounds scroll onResize={handleResize}>
          {({ measureRef }) => (
            <ThumbnailFrame
              ref={measureRef}
              id="test"
              title="Dr. Nick"
              srcDoc="<h1>hi</h1><h1>hi</h1><h1>hi</h1><h1>hi</h1><h1>hi</h1><h1>hi</h1><h1>hi</h1><h1>hi</h1><h1>hi</h1><h1>hi</h1><h1>hi</h1><h1>hi</h1><h1>hi</h1><h1>hi</h1><h1>hi</h1><h1>hi</h1><h1>hi</h1><h1>hi</h1><h1>hi</h1><h1>hi</h1><h1>hi</h1><h1>hi</h1><h1>hi</h1><h1>hi</h1>"
              // style={{
              //   width: americanDimensions && americanDimensions["width"],
              //   height: americanDimensions && americanDimensions["height"],
              // }}
              // srcDoc={victimEmails ? victimEmails[0]["body[]"].html : ""}
            />
          )}
        </Measure>
      </MailCard>
      <MailCard />
      <MailCard />
      <MailCard /> */}
    </PageContainer>
  );
};

const ThumbnailFrame = styled.iframe`
  /* flex: 0 0 32%; */
  display: block;
  position: absolute;
`;
const PageContainer = styled.div`
  /* display: flex; */
  flex-wrap: wrap;
`;

const MailCard = styled.div`
  /* display: flex; */

  flex: 0 0 32%;
  margin: 1px;
  border: black 1px solid;
`;

export { MassDestruction };
