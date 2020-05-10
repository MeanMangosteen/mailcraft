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
import { SizeMe } from "react-sizeme";

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

  return (
    <PageContainer>
      <MailCard></MailCard>
      <SizeMe monitorHeight>
        {({ size }) => (
          <MailCard>
            <MailThumbnail parentH={size.height} parentW={size.width} />
          </MailCard>
        )}
      </SizeMe>
      <MailCard></MailCard>
      <MailCard></MailCard>
      <MailCard></MailCard>
      <MailCard></MailCard>
      <MailCard></MailCard>
      <MailCard></MailCard>
      <MailCard></MailCard>
    </PageContainer>
  );
};

const MailThumbnail = ({ parentH, parentW }) => {
  const [iframeStyles, setIframeStyles] = useState<any>(null);
  const [contentDim, setContentDim] = useState<any>(null);

  useEffect(() => {
    if (!contentDim) return; // iframe hasn't loaded yet

    const contentW = contentDim.width;
    const contentH = contentDim.height;
    const scaleVal =
      contentH > contentW ? parentH / contentH : parentW / contentW;
    setIframeStyles({
      width: contentW,
      height: contentH,
      transform: `scale(${scaleVal})`,
    });
  }, [contentDim, parentH, parentW]);

  const handleLoad = (something) => {
    // Here, to the react gods, I ask for forgiveness.
    // I will plant many many trees.

    // If it's too much of a tall boy, chop it's legs. Otherwise the thumbnail looks retarded.
    const contentH = Math.min(
      something.target.contentWindow.document.body.scrollHeight,
      800
    );
    const contentW = something.target.contentWindow.document.body.scrollWidth;
    setContentDim({
      width: contentW,
      height: contentH,
    });
    // Remove the scroll bar in iframe cause by content margins
    something.target.contentWindow.document.body.style.overflow = "hidden";
  };

  return (
    <ThumbnailIframe
      title="Hey, look an iframe!"
      srcDoc="<h1>hi</h1><h1>hi</h1><h1>hi</h1><h1>hi</h1><h1>hi</h1><h1>hi</h1><h1>hi</h1><h1>hi</h1><h1>hi</h1><h1>hi</h1><h1>hi</h1><h1>hi</h1><h1>hi</h1><h1>hi</h1><h1>hi</h1><h1>hi</h1><h1>hi</h1><h1>hi</h1><h1>hi</h1><h1>hi</h1><h1>hi</h1><h1>hi</h1><h1>hi</h1><h1>hi</h1>"
      width="100%"
      height="100%"
      style={iframeStyles && { ...iframeStyles }}
      onLoad={handleLoad}
    />
  );
};
const ThumbnailIframe = styled.iframe`
  /* flex: 0 0 32%; */
  display: block;
  position: absolute;
  transform-origin: top;
`;
const PageContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const MailCard = styled.div`
  /* display: flex; */

  flex: 0 0 32%;
  margin: 1px;
  border: black 1px solid;
`;

export { MassDestruction };
