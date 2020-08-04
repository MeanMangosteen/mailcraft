import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useCookies } from "react-cookie";
import { MdOpenInNew } from "react-icons/md";

export const WebUILink = styled(({ threadId, className = "web-ui-link" }) => {
  const [cookies] = useCookies(["profile"]);
  const [link, setLink] = useState<string>();

  useEffect(() => {
    if (!threadId) return;
    const threadIDHex = BigInt(threadId.toString()).toString(16);
    const webUILink = `https://mail.google.com/mail?authuser=${cookies?.profile}#all/${threadIDHex}`;
    setLink(webUILink);
  }, [cookies, threadId]);

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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #7c7c7c;

  transition: transform 0.2s ease-in;
  &:hover {
    transform: scale(1.15);
  }
`;

const IconText = styled.div`
  font-size: 1.3rem;
  font-weight: bold;
`;
