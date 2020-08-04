import React, { useState, useCallback } from "react";
import { Transition } from "react-transition-group";
import { WebUILink } from "../WebUILink";
import styled from "styled-components";
import { centerContent } from "../utils";

export const ExpandedIframe = ({ onClose, show, mail }) => {
  const [iframeHeight, setIframeHeight] = useState<number>();
  const handleIframeLoad = useCallback((event) => {
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
          <StyledWebUILink threadId={mail["x-gm-thrid"]} />
        </Background>
      )}
    </Transition>
  );
};

const StyledWebUILink = styled(WebUILink)`
  position: fixed;
  top: 3%;
  right: 4%;
  color: white;
`;

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
