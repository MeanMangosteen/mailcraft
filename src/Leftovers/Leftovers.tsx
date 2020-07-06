import React, { useState, useRef, useEffect } from "react";
import { SizeMe } from "react-sizeme";
import { useMail } from "../reducers/mail";
import styled, { css } from "styled-components";
import { Email } from "./Email";

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
      <ControlsContainer></ControlsContainer>
    </LeftoversContainer>
  );
};

// OMGTODO: move these to utils
const CSSDividerTop = ({ width }) => {
  return css`
    &::before,
    &::after {
      content: "";
      position: absolute;
      display: block;
      top: -10px;
      height: 1px;
      width: ${width};
    }

    &::before {
      left: 50%;
      background: linear-gradient(to right, #333 0%, transparent 100%);
    }

    &::after {
      left: 50%;
      background: linear-gradient(to left, #333 0%, transparent 100%);
      transform: translateX(-100%);
    }
  `;
};

const centerContent = css`
  display: flex;
  justify-content: center;
  align-items: center;
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
  background: blue;
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
