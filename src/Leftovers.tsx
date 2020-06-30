import React, { useState, useRef, useEffect } from "react";
import { SizeMe } from "react-sizeme";
import { MailThumbnail } from "./MassDestruction/MailThumbnail";
import { useMail } from "./reducers/mail";
import styled from "styled-components";

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
    <SizeMe monitorHeight>
      {({ size }) => (
        <Container onKeyDown={handleKeyPress} tabIndex={-1} ref={containerRef}>
          {!mail || !mail.length ? null : (
            <div>
              <MailThumbnail
                parentH={size?.height && size.height * 0.85}
                parentW={size.width}
                html={mail[0]["body[]"].html}
                onClick={() => {}}
              />
              <SubjectText
                style={{
                  maxHeight: size?.height ? size.height * 0.15 : undefined,
                }}
              >
                {mail[0].envelope.subject}
              </SubjectText>
            </div>
          )}
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
        </Container>
      )}
    </SizeMe>
  );
};
const Container = styled.div`
  margin: 4rem;
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
