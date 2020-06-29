import React from "react";
import { SizeMe } from "react-sizeme";
import { MailThumbnail } from "./MailThumbnail";
import styled from "styled-components";

export const MailCard = ({ html, subject, selected, index, onClick }) => {
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

const LuckyDuckyAura = styled.div`
  background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 1) 0%,
      rgba(133, 255, 231, 1) 15%,
      rgba(106, 255, 226, 1) 50%,
      rgba(157, 255, 236, 1) 85%,
      rgba(255, 255, 255, 1) 100%
    ),
    linear-gradient(
      0deg,
      rgba(255, 255, 255, 1) 0%,
      rgba(133, 255, 231, 1) 15%,
      rgba(106, 255, 226, 1) 50%,
      rgba(157, 255, 236, 1) 85%,
      rgba(255, 255, 255, 1) 100%
    );
  background-blend-mode: hard-light;
`;

const MegaWrapper = styled.div`
  display: flex;
  > * {
    flex-grow: 1;
  }
  padding: 6rem;
  box-shadow: inset 0px 0px 9px 10px #ffffff;
`;

const Background = styled.div`
  background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 1) 0%,
      rgba(133, 255, 231, 1) 15%,
      rgba(106, 255, 226, 1) 50%,
      rgba(157, 255, 236, 1) 85%,
      rgba(255, 255, 255, 1) 100%
    ),
    linear-gradient(
      0deg,
      rgba(255, 255, 255, 1) 0%,
      rgba(133, 255, 231, 1) 15%,
      rgba(106, 255, 226, 1) 50%,
      rgba(157, 255, 236, 1) 85%,
      rgba(255, 255, 255, 1) 100%
    );
  background-blend-mode: hard-light;
`;

export const MailCardContainer = styled.div`
  margin: 1px;
  /* box-shadow: 2px 4px 10px #848484; */
  /* box-shadow: inset -1px 3px 8px 5px #1f87ff, 2px 5px 16px 0px #0b325e,
    5px 5px 15px 5px rgba(0, 0, 0, 0); */
  border-radius: 10px;
  /* box-shadow: ${({ selected }: { selected: boolean }) =>
    selected
      ? "2px 5px 16px 0px #0b325e, 5px 5px 15px 5px rgba(0, 0, 0, 0)"
      : "none"}; */
  box-shadow: ${({ selected }: { selected: boolean }) =>
    selected
      ? "2px 2px 5px 0px rgba(0,0,0,0.75)"
      : "8px 7px 14px 3px rgba(0,0,0,0.75)"};
  transition: all 0.3s;
  &:hover{
    box-shadow: 8px 7px 14px 3px rgba(0,0,0,0.75);
  }
`;
const SubjectText = styled.div`
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
