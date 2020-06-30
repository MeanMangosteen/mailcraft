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
            parentH={size?.height && size.height * 0.95}
            parentW={size.width}
            html={html}
          />
          <Divider />
          <SubjectText>{subject}</SubjectText>
        </MailCardContainer>
      )}
    </SizeMe>
  );
};

export const MailCardContainer = styled.div`
  margin: 1px;
  border-radius: 10px;
  box-shadow: ${({ selected }: { selected: boolean }) =>
    selected
      ? "2px 2px 5px 1px rgba(138,0,0,0.75)"
      : "2px 2px 5px 0px rgba(0,0,0,0.75)"};
  transition: all 0.3s;
  &:hover {
    box-shadow: ${({ selected }: { selected: boolean }) =>
      selected
        ? "10px 9px 14px 3px rgba(104,28,0,0.75)"
        : "10px 9px 14px 3px rgba(0,0,0,0.75)"};
  }
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

const Divider = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 90%;
  width: 0;
  border-right: 1px solid;
  border-radius: 50%;
`;
