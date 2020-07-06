import React, { useState } from "react";
import { SizeMe } from "react-sizeme";
import { MailThumbnail, MailThumbnailContainer } from "./MailThumbnail";
import styled from "styled-components";
import { Transition } from "react-transition-group";

export const MailCard = ({ html, subject, selected, index, onClick }) => {
  const [expandIframe, setExpandIframe] = useState<boolean>(false);

  return (
    <MailCardContainer selected={selected} onClick={onClick(index)}>
      <SizeMe monitorHeight>
        {({ size }) => (
          <ContentWrapper>
            <StyledMailThumbnail
              parentH={size?.height && size.height}
              parentW={size.width && size.width / 2}
              html={html}
              onClick={() => setExpandIframe(true)}
              expandable
            />
            <SubjectText>{subject}</SubjectText>
          </ContentWrapper>
        )}
      </SizeMe>
      <ExpandedIframe
        show={expandIframe}
        html={html}
        onClose={(e) => {
          e.stopPropagation();
          setExpandIframe(false);
        }}
      />
    </MailCardContainer>
  );
};

const ExpandedIframe = ({ html, onClose, show }) => {
  return (
    <Transition appear mountOnEnter unmountOnExit in={show} timeout={300}>
      {(state) => (
        <ExpandedIframeContainer className={state} onClick={onClose}>
          <Iframe srcDoc={html} />
        </ExpandedIframeContainer>
      )}
    </Transition>
  );
};

const Iframe = styled.iframe`
  height: 90%;
  width: 75%;
`;
const ExpandedIframeContainer = styled.div`
  position: fixed;
  height: 100vh;
  width: 100vw;
  top: 0;
  left: 0;
  background: #00000085;
  z-index: 100;

  display: flex;
  justify-content: center;
  align-items: center;

  will-change: opacity;
  transition: opacity 0.3s ease-in-out;
  /* Hidden init state */
  opacity: 0;
  &.enter,
  &.entered {
    /* Animate in state */
    opacity: 1;
  }
  &.exit,
  &.exited {
    /* Animate out state */
    opacity: 0;
  }
`;

export const MailCardContainer = styled.div`
  margin: 1px;
  border-radius: 10px;
  box-shadow: ${({ selected }: { selected: boolean }) =>
    selected
      ? "4px 4px 10px 4px rgba(0, 28, 132, 0.75)"
      : "2px 2px 5px 0px rgba(0,0,0,0.75)"};
  transition: all 0.3s;
  &:hover {
    box-shadow: ${({ selected }: { selected: boolean }) =>
      selected
        ? "10px 9px 14px 3px rgba(0, 28, 132, 0.75)"
        : "10px 9px 14px 3px rgba(0,0,0,0.75)"};
  }
  display: flex;
  justify-content: center;
  align-items: stretch;
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
