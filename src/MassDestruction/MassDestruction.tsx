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
import ReactPageScroller from "react-page-scroller";

// TODO: come back to page based scrolling
/*
A note was the designed was.
Basically detect whether we're scrolling up or down.#
Which increments or decrements a page number
Each page of mail cards has a ref
When the page number changes, we scrollIntoView() that page ^^
*/
const MassDestruction = () => {
  // const [refs, setRefs] = useState<any[]>([]);
  // const [page, setPage] = useState<number>(0);
  // const [scrollCurr, setScrollCurr] = useState<any>(0);
  // const [scrollPrev, setScrollPrev] = useState<any>(0);
  const location = useLocation();
  const qParams = queryString.parse(location.search);
  const { mail } = useMail();
  const [victimEmails, setVictimEmails] = useState<any[]>([]);
  const [mailPages, setMailPages] = useState<any[]>([]);
  const [selected, setSelected] = useState<Object>({});

  useEffect(() => {
    // Filter all mail down to the ones from the victim
    if (!qParams.victim) throw Error("Victim needed to destroy!");
    if (!mail) return;
    const filteredMail = mail.filter(
      (m) => m.envelope.from[0].address.split("@")[1] === qParams["victim"]
    );
    setVictimEmails(filteredMail);
    for (let i = 0; i < filteredMail.length; i++) {
      selected[i] = true;
    }
    setSelected({ ...selected });
  }, [mail]);

  useEffect(() => {
    // Use the filtered mail and convert to pages
    const newMailPages: any[] = [];
    const numMailPerPage = 9;
    for (let i = 0; i <= (victimEmails?.length || -1); i += numMailPerPage) {
      const mailCards = victimEmails
        ?.slice(i, i + numMailPerPage)
        .map((mail, idx) => {
          return (
            <MailCard
              selected={selected[i + idx]}
              index={i + idx}
              key={idx}
              subject={mail["envelope"].subject}
              html={mail["body[]"].html}
              onClick={handleCardClick}
            />
          );
        });
      // const ref = React.createRef<any>();
      // refs.push(ref);
      const page = <PageContainer /* ref={ref} */>{mailCards}</PageContainer>;
      newMailPages.push(page);
    }
    setMailPages([...newMailPages]);
    // setRefs([...refs]);
  }, [victimEmails, selected]);

  const handleCardClick = (index) => (event) => {
    console.log(index, event, "hi!");
    selected[index] = !selected[index];
    setSelected({ ...selected });
  };
  // useEffect(() => {
  //   window.addEventListener("scroll", handleScroll);
  // }, []);

  // useEffect(() => {
  //   if (scrollCurr < scrollPrev) {
  //     // scrolling up
  //     setPage(page - 1);
  //   } else if (scrollCurr > scrollPrev) {
  //     // scrolling down
  //     setPage(page + 1);
  //   }
  //   setScrollPrev(scrollCurr);
  // }, [scrollCurr]);

  // useEffect(() => {
  //   // Scrolls the page into view. Has debouncing issues.
  //   console.log("page", page);
  //   refs[page]?.current.scrollIntoView({ behavior: "smooth" });
  // }, [page, refs]);

  // const handleScroll = (e) => {
  //   // note we don't have access to state here, but we can setState
  //   const window: any = e.currentTarget;

  //   setScrollCurr(window?.scrollY);
  // };

  // SOTODO: remove slice
  return <div>{mailPages.slice(0, 2)}</div>;
};

const MailCard = ({ html, subject, selected, index, onClick }) => {
  return (
    <SizeMe monitorHeight>
      {({ size }) => (
        <MailCardContainer selected={selected} onClick={onClick(index)}>
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
  /* display: flex;
  flex-wrap: wrap; */
  display: grid;
  grid-gap: 2rem;
  grid-template-columns: repeat(3, 1fr);
  height: 100%;
  padding: 2rem;
  box-sizing: border-box;
`;

const MailCardContainer = styled.div`
  /* display: flex; */
  flex-direction: column;
  flex: 0 0 32%;
  margin: 1px;
  /* border: black 1px solid; */
  box-shadow: 2px 4px 10px #848484;
  border-radius: 10px;
  border: ${({ selected }: { selected: boolean }) =>
    selected ? "2px red solid" : undefined};
`;

export { MassDestruction };
