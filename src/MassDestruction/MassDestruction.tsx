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
import html2canvas from "html2canvas";

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

  const mailCards = victimEmails
    ?.slice(0, 9)
    .map((mail, idx) => (
      <MailCard
        key={idx}
        subject={mail["envelope"].subject}
        html={mail["body[]"].html}
      />
    ));
  console.log(victimEmails);

  return <PageContainer>{mailCards}</PageContainer>;
};

const MailCard = ({ html, subject }) => {
  return (
    <SizeMe monitorHeight>
      {({ size }) => (
        <MailCardContainer>
          <MailThumbnail
            parentH={size?.height && size.height * 0.85}
            parentW={size.width}
            html={html}
          />
          <SubjectText
            style={{
              maxHeight: size?.height ? size.height * 0.15 : undefined,
            }}
          >
            {subject}
          </SubjectText>
        </MailCardContainer>
      )}
    </SizeMe>
  );
};

const SubjectText = styled.div`
  /* display: flex;
  justify-content: center;
  align-items: center; */

  width: 90%;
  box-sizing: border-box;

  font-size: 1.8rem;
  font-weight: bold;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  position: absolute;
  margin: 0;
  margin-left: 1rem;
  bottom: 0;
`;
const MailThumbnail = ({ parentH, parentW, html }) => {
  const [iframeStyles, setIframeStyles] = useState<any>(null);
  const [contentDim, setContentDim] = useState<any>(null);

  console.log("styles", iframeStyles);
  useEffect(() => {
    if (!contentDim) return; // iframe hasn't loaded yet

    const contentW = contentDim.width;
    const contentH = contentDim.height;
    const scaleFactor = parentH / contentH;
    // contentH > contentW ? parentH / contentH : parentW / contentW;
    const lMargin = (parentW - contentW * scaleFactor) / 2;
    setIframeStyles({
      width: contentW,
      height: contentH,
      transform: `scale(${scaleFactor})`,
      marginLeft: lMargin,
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
      srcDoc={html}
      width="100%"
      height="100%"
      style={iframeStyles && { ...iframeStyles }}
      onLoad={handleLoad}
    />
    // </ThumbnailIframeWrapper>
  );
};

const ThumbnailIframeWrapper = styled.div`
  /* display: flex;
  justify-content: center;
  align-items: center; */
`;

const ThumbnailIframe = styled.iframe`
  /* flex: 0 0 32%; */
  display: block;
  position: absolute;
  transform-origin: top left;
`;
const PageContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const MailCardContainer = styled.div`
  /* display: flex; */
  flex-direction: column;
  flex: 0 0 32%;
  margin: 1px;
  /* border: black 1px solid; */
  box-shadow: 2px 4px 10px #848484;
  border-radius: 10px;
`;

export { MassDestruction };
