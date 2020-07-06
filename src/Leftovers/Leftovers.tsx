import React, { useState, useRef, useEffect } from "react";
import { SizeMe } from "react-sizeme";
import { useMail } from "../reducers/mail";
import styled, { css } from "styled-components";
import { Email } from "./Email";
import {
  FaArrowUp,
  FaArrowLeft,
  FaArrowRight,
  FaArrowDown,
} from "react-icons/fa";
import { CSSDividerTop, centerContent } from "../utils";

export const Leftovers = () => {
  const { mail, readMail, spamMail, trashMail } = useMail();
  const containerRef = useRef<any>();
  //   const [curr, setCurr] = useState<any>(mail[0]);

  const handleKeyPress = (event) => {
    if (event.key === "a") {
      readMail([mail[0].uid]);
    }
    if (event.key === "s") {
      spamMail([mail[0].uid]);
    }
    if (event.key === "d") {
      trashMail([mail[0].uid]);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      containerRef.current?.focus();
      console.log("gimer");
    }, 3000);
  }, [mail]);
  if (!mail || !mail.length) return null;
  return (
    <LeftoversContainer>
      <SubjectContainer>{mail[0].envelope.subject}</SubjectContainer>
      <SizeMe monitorHeight>
        {({ size }) => (
          <EmailContainer
            onKeyDown={handleKeyPress}
            tabIndex={-1}
            ref={containerRef}
          >
            {!mail || !mail.length ? null : (
              <Email
                parentH={size?.height && size.height * 0.85}
                parentW={size.width}
                html={mail[0]["body[]"].html}
                onClick={() => {}}
              />
            )}
            {/* <SubjectText
                style={{
                  maxHeight: size?.height ? size.height * 0.15 : undefined,
                }}
              >
                {mail[0].envelope.subject}
              </SubjectText> */}
            {/* {
(!mail || !mail.length) ? null :
          (<MailThumbnail
            parentH={size?.height && size.height * 0.85}
            parentW={size.width}
            html={mail[0]["body[]"].html}
          />
          <SubjectText
            style={{
              maxHeight: size?.height ? size.height * 0.15 : undefined,
            }}
          >
            {mail[0].envelope.subject}
        </SubjectText> )
        } */}
          </EmailContainer>
        )}
      </SizeMe>
      <ControlsContainer>
        <Control>
          <KBD>
            <LeftArrow />
          </KBD>
          <ControlText>Spam</ControlText>
        </Control>
        <Control>
          <KBD>
            <DownArrow />
          </KBD>
          <ControlText>Read</ControlText>
        </Control>
        <Control>
          <KBD>
            <RightArrow />
          </KBD>
          <ControlText>Trash</ControlText>
        </Control>
      </ControlsContainer>
    </LeftoversContainer>
  );
};

const Control = styled.div`
  ${centerContent}
  margin-right: 2rem;
  border: 1px solid #ccc;
  padding: 1rem 2rem;
  border-radius: 20px;
  box-shadow: 6px 3px 13px -7px #000000;
`;
const ControlText = styled.div`
  font-size: 2rem;
  margin-left: 1rem;
`;
const LeftArrow = styled(FaArrowLeft)``;
const DownArrow = styled(FaArrowDown)``;
const RightArrow = styled(FaArrowRight)``;

const KBD = styled.kbd`
  ${centerContent}
  padding: 0.5rem;
  background-color: #eee;
  border-radius: 3px;
  border: 1px solid #b4b4b4;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2),
    0 2px 0 0 rgba(255, 255, 255, 0.7) inset;
  color: #333;
  display: inline-block;
  font-size: 0.85em;
  font-weight: 700;
  line-height: 1;
  padding: 2px 4px;
  white-space: nowrap;
`;

const EmailContainer = styled.div`
  ${CSSDividerTop({ width: "30%" })}
`;

const SubjectText = styled.div`
  font-size: 2.5rem;
  text-align: center;
  font-weight: bold;
  width: 100%;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  position: absolute;
  margin: 0;
  margin-left: 1rem;
  bottom: 0;
`;

const SubjectContainer = styled.div`
  ${centerContent}
  /* display: flex;
  justify-content: center;
  align-items: center; */
  font-size: 4rem;
`;

const ControlsContainer = styled.div`
  ${centerContent}
  font-size: 4rem;
`;

const LeftoversContainer = styled.div`
  display: flex;
  flex-direction: column;

  ${SubjectContainer} {
    flex-basis: 10%;
  }

  ${EmailContainer} {
    flex-basis: 80%;
  }

  ${ControlsContainer} {
    flex-basis: 10%;
  }
`;
