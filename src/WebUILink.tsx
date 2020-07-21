import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useCookies } from "react-cookie";
import { MdOpenInNew } from "react-icons/md";

export const WebUILink = styled(({ threadId, className = "web-ui-link" }) => {
  const [cookies] = useCookies(["profile"]);
  const [link, setLink] = useState<string>();
  useEffect(() => {
    const threadIDHex = BigInt(threadId.toString()).toString(16);
    const webUILink = `https://mail.google.com/mail?authuser=${cookies?.profile}#all/${threadIDHex}`;
    setLink(webUILink);
    console.log(webUILink);
  }, [threadId]);
  return (
    <WebUILinkContainer
      className={className}
      onClick={() => window.open(link, "_blank")}
    >
      <OpenIcon />
      <IconText>OPEN IN WEB UI </IconText>
    </WebUILinkContainer>
  );
})``;

const OpenIcon = styled(MdOpenInNew)`
  font-size: 3.5rem;
`;
const WebUILinkContainer = styled.div`
  position: fixed;
  top: 10%;
  right: 15%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #7c7c7c;
`;

const IconText = styled.div`
  font-size: 1.3rem;
  font-weight: bold;
`;
