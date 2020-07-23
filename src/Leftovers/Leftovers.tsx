import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
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
import { CSSDividerTop, centerContent, CSSDividerBottom } from "../utils";
import { ProgressBar } from "../Declutter/ChooseVictim";
import { WebUILink } from "../WebUILink";

export const Leftovers = ({}) => {
  const { mail, readMail, spamMail, trashMail, info } = useMail();
  const containerRef = useRef<any>();
  const [activeButton, setActiveButton] = useState<any>(null);
  const [mailCopy, setMailCopy] = useState<any>(null);
  const [offset, setOffset] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      containerRef.current?.focus();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (mail && !mailCopy) {
      setMailCopy(mail);
    }
  }, [mail, mailCopy]);

  const buffer = useMemo(
    () =>
      mailCopy &&
      mailCopy.slice(offset, offset + 5).map((mail) => (
        <EmailContainer key={mail.uid}>
          <SubjectContainer>{mail.envelope.subject}</SubjectContainer>
          <SenderContainer>
            {mail.envelope.from[0].address.split("@")[1]}
          </SenderContainer>
          <SizeMe monitorHeight>
            {({ size }) => (
              <EmailBodyContainer
                tabIndex={-1}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <Email
                  parentH={size?.height && size.height * 0.85}
                  parentW={size.width}
                  html={mail["body[]"].html || mail["body[]"].textAsHtml}
                  className="email"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                />
                <StyledWebUILink threadId={mail["x-gm-thrid"]} />
              </EmailBodyContainer>
            )}
          </SizeMe>
        </EmailContainer>
      )),
    [mailCopy, offset]
  );
  const handleKeyPress = useCallback(
    (event) => {
      if (activeButton) return; // You gotta let go of key before we deal with the next email
      const [left, down, right] = [37, 40, 39]; // Keycodes
      console.log(event.keyCode);
      if (event.keyCode === down) {
        readMail([mailCopy[offset].uid], (err) => err && console.error(err));
        setActiveButton("read");
        setOffset(offset + 1);
      } else if (event.keyCode === left) {
        spamMail([mailCopy[offset].uid], (err) => err && console.error(err));
        setActiveButton("spam");
        setOffset(offset + 1);
      } else if (event.keyCode === right) {
        trashMail([mailCopy[offset].uid], (err) => err && console.error(err));
        setActiveButton("trash");
        setOffset(offset + 1);
      }
    },
    [activeButton, offset, mailCopy]
  );

  const handleKeyLift = useCallback(
    (event) => {
      const keysToButton = { 37: "spam", 40: "read", 39: "trash" };
      if (keysToButton[event.keyCode] === activeButton) setActiveButton(null);
    },
    [activeButton]
  );

  if (!mail || !mail.length) return null;
  return (
    <LeftoversContainer>
      <UsefulThings
        onKeyDown={handleKeyPress}
        onKeyUp={handleKeyLift}
        ref={containerRef}
        tabIndex={-1}
      >
        <EmailBuffer>{buffer}</EmailBuffer>
        <ControlsContainer>
          <Control id="spam" activeButton={activeButton}>
            <KBD>
              <LeftArrow />
            </KBD>
            <ControlText>Spam</ControlText>
          </Control>
          <Control id="read" activeButton={activeButton}>
            <KBD>
              <DownArrow />
            </KBD>
            <ControlText>Read</ControlText>
          </Control>
          <Control id="trash" activeButton={activeButton}>
            <KBD>
              <RightArrow />
            </KBD>
            <ControlText>Trash</ControlText>
          </Control>
        </ControlsContainer>
      </UsefulThings>
      <ProgressContainer>
        <StyledProgressBar
          progress={info?.progress}
          total={info?.total}
          className="progress-bar"
        />
      </ProgressContainer>
    </LeftoversContainer>
  );
};

const SubjectContainer = styled.div`
  ${centerContent}
  font-size: 4rem;
  position: relative;
  ${CSSDividerBottom({ width: "30%", IHaveSetRelativePosition: true })}
`;
const SenderContainer = styled.div`
  ${centerContent}
  font-size: 2rem;
  color: #a6a6a6;
`;

const EmailBodyContainer = styled.div`
  overflow-y: scroll;
  overflow-x: hidden;
`;

const StyledWebUILink = styled(WebUILink)`
  z-index: 2;
  transition: opacity 0.2s ease-in-out;
  opacity: 0;
  ${EmailBodyContainer}:hover & {
    opacity: 1;
  }
`;

const EmailContainer = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  ${SubjectContainer} {
    height: 10%;
  }

  ${SenderContainer} {
    height: 5%;
  }

  ${EmailBodyContainer} {
    height: 85%;
  }
`;
const EmailBuffer = styled.div`
  position: relative;
  ${EmailContainer} {
    opacity: 0;
    transition: opacity 0.2s ease-in-out;
    z-index: -1;
  }
  & ${EmailContainer}:nth-child(1) {
    opacity: 1;
    z-index: 1;
  }
`;
const StyledProgressBar = styled(ProgressBar)`
  position: absolute;

  top: 50%;
  right: 50%;
  transform: rotate(-90deg) translate(55%, 50%);

  width: 80vh;
  height: 5%;
  transform-origin: right bottom;
  /* transform: rotate(-90deg); */
  z-index: -1;
`;

const Control = styled.div<{ id: string; activeButton: string }>`
  ${centerContent}
  margin-right: 2rem;
  border: 1px solid #ccc;
  padding: 1rem 2rem;
  border-radius: 20px;
  /* box-shadow: 6px 3px 13px -7px #000000; */
  box-shadow: ${({ id, activeButton }) =>
    activeButton === id ? "none" : "6px 3px 13px -7px #000000"};
  transform: ${({ id, activeButton }) => activeButton === id && "scale(0.9)"};
  transition: transform 0.05s;
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

const ControlsContainer = styled.div`
  position: relative;
  ${CSSDividerTop({ width: "20%", IHaveSetRelativePosition: true })}
  ${centerContent}
  font-size: 4rem;
  padding-top: 10px;
`;

const UsefulThings = styled.div`
  outline: none;
  display: flex;
  flex-direction: column;

  ${EmailBuffer} {
    flex-basis: 90%;
  }
  ${ControlsContainer} {
    flex-basis: 10%;
  }
`;

const ProgressContainer = styled.div`
  position: relative;
`;
const LeftoversContainer = styled.div`
  display: flex;

  ${UsefulThings} {
    flex-grow: 1;
  }

  ${ProgressContainer} {
    flex-basis: 8%;
  }
`;
