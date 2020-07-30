import React, { useState, useCallback } from "react";
import { SizeMe } from "react-sizeme";
import { MailThumbnail, MailThumbnailContainer } from "./MailThumbnail";
import styled from "styled-components";
import { Transition } from "react-transition-group";
import { centerContent } from "../utils";
import { WebUILink } from "../WebUILink";

export const MailCard = ({ mail, selected, index, onClick }) => {
  const [expandIframe, setExpandIframe] = useState<boolean>(false);

  const headerLines = mail["body[]"]["headerLines"];
  let useText: boolean;
  for (let i = 0; i < headerLines.length; i++) {
    const header = headerLines[i];
    if (header.key === "content-type") {
      useText = header.line.match(/Content-Type: text\/plain/g);
    }
  }

  return (
    <>
      <MailCardContainer selected={selected} onClick={onClick(index)}>
        <SizeMe monitorHeight>
          {({ size }) => (
            <ContentWrapper>
              <StyledMailThumbnail
                parentH={size?.height && size.height}
                parentW={size.width && size.width / 2}
                html={mail["body[]"].html || mail["body[]"].textAsHtml}
                onClick={() => setExpandIframe(true)}
                expandable
              />
              <SubjectText>{mail["envelope"].subject}</SubjectText>
            </ContentWrapper>
          )}
        </SizeMe>
      </MailCardContainer>
      <ExpandedIframe
        show={expandIframe}
        mail={mail}
        onClose={(e) => {
          // e.stopPropagation();
          setExpandIframe(false);
        }}
      />
    </>
  );
};

const ExpandedIframe = ({ onClose, show, mail }) => {
  const [iframeHeight, setIframeHeight] = useState<number>();
  const handleIframeLoad = useCallback((event) => {
    console.log(event.target.contentWindow.document.body.scrollHeight);
    setIframeHeight(event.target.contentWindow.document.body.scrollHeight);
  }, []);
  return (
    <Transition appear mountOnEnter unmountOnExit in={show} timeout={300}>
      {(state) => (
        <Background
          onClick={(event) => {
            event.stopPropagation();
            event.preventDefault();
            onClose();
          }}
          state={state}
        >
          <ExpandedIframeContainer className={state}>
            <Iframe
              srcDoc={mail["body[]"].html || mail["body[]"].textAsHtml}
              onLoad={handleIframeLoad}
              iframeHeight={iframeHeight}
            />
          </ExpandedIframeContainer>
          <WebUILink threadId={mail["x-gm-thrid"]} />
        </Background>
      )}
    </Transition>
  );
};

const Iframe = styled.iframe<{ iframeHeight?: number }>`
  position: absolute;
  top: 0;

  height: ${({ iframeHeight }) => iframeHeight}px;
  min-height: 100%;
  width: 100%;

  pointer-events: none; /* Disable links and click to cors */
`;

const Background = styled.div<{ state: any }>`
  ${centerContent}
  position: fixed;
  height: 100vh;
  width: 100vw;
  top: 0;
  left: 0;
  background: #00000085;
  z-index: 100;

  transition: opacity 0.3s ease-in-out;
  /* Hidden init state */
  opacity: ${({ state }) => (state === "entered" ? 1 : 0)};
`;

const ExpandedIframeContainer = styled.div`
  position: relative;
  height: 90vh;
  width: 75vw;

  display: flex;
  justify-content: center;
  align-items: center;

  overflow-y: scroll;
  overflow-x: hidden;

  background: white;
`;

export const MailCardContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: stretch;

  margin: 1px;
  border-radius: 10px;
  box-shadow: ${({ selected }: { selected: boolean }) =>
    selected
      ? "4px 4px 10px 4px hsla(216, 54%, 65%, 1)"
      : "2px 2px 5px 0px rgba(0,0,0,0.75)"};

  &:hover {
    box-shadow: ${({ selected }: { selected: boolean }) =>
      selected
        ? "10px 9px 14px 3px hsla(216, 44%, 35%, 1)"
        : "10px 9px 14px 3px rgba(0,0,0,0.75)"};
  }

  &:active {
    transform: scale(0.975);
  }

  transition: box-shadow 0.3s, transform 15ms;
  z-index: 1;
`;

const SubjectText = styled.div`
  width: 40%;
  box-sizing: border-box;

  font-size: 1.8rem;
  font-weight: bold;

  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;

  position: absolute;
  margin: 0;
  top: 50%;
  left: 75%;

  transform: translate(-50%, -50%);
`;

const StyledMailThumbnail = styled(MailThumbnail)`
  /* Below makes one hell of a vertical divider */
  /* Credit: https://stackoverflow.com/questions/19069943/css-vertical-border-with-horizontal-gradients */
  /* Divider between iframe thumbnail and subject text */
  &::before,
  &::after {
    content: "";
    position: absolute;
    display: block;
    right: -10px;
    width: 1px;
    height: 50%;
  }

  &::before {
    top: 0;
    background: linear-gradient(to top, #333 0%, transparent 100%);
  }

  &::after {
    bottom: 0;
    background: linear-gradient(to bottom, #333 0%, transparent 100%);
  }
`;

const ContentWrapper = styled.div`
  position: relative;
  box-sizing: content-box;
  flex-grow: 1;
  margin: 0.3rem;
`;
