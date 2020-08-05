import React, { useState } from "react";
import { SizeMe } from "react-sizeme";
import { MailThumbnail } from "./MailThumbnail";
import styled from "styled-components";
import { ExpandedIframe } from "./ExpandedIframe";

export const MailCard = styled(
  ({
    mail,
    selected,
    index,
    onClick,
    page,
    currPage,
    className = "mailcard",
  }) => {
    const [expandIframe, setExpandIframe] = useState<boolean>(false);

    return (
      <>
        <MailCardContainer
          selected={selected}
          onClick={onClick(index)}
          className={className}
        >
          <SizeMe monitorHeight>
            {({ size }) => (
              <ContentWrapper>
                {Math.abs(currPage - page) < 2 && (
                  <StyledMailThumbnail
                    parentH={size?.height && size.height}
                    parentW={size.width && size.width / 2}
                    html={mail["body[]"].html || mail["body[]"].textAsHtml}
                    onClick={() => setExpandIframe(true)}
                    expandable
                  />
                )}
                <SubjectText>{mail["body[]"].subject}</SubjectText>
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
  }
)``;

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
