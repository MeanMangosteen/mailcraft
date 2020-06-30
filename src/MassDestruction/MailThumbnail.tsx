import React, { useState, useEffect } from "react";
import styled from "styled-components";
export const MailThumbnail = ({ parentH, parentW, html }) => {
  const [iframeStyles, setIframeStyles] = useState<any>(null);
  const [containerStyles, setContainerStyles] = useState<any>(null);
  const [contentDim, setContentDim] = useState<any>(null);

  useEffect(() => {
    if (!contentDim) return; // iframe hasn't loaded yet

    const contentW = contentDim.width;
    const contentH = contentDim.height;
    const scaleFactor = parentH / contentH;
    // contentH > contentW ? parentH / contentH : parentW / contentW;
    const lMargin = (parentW - contentW * scaleFactor) / 2;
    setIframeStyles({
      width: parentW * (1 / scaleFactor),
      height: contentH,
      // transform: `scale(${scaleFactor}) translate(-50%, -50%)`,
      // marginLeft: lMargin,
    });
    setContainerStyles({
      transform: `scale(${scaleFactor}) translate(-50%, -50%)`,
    });
  }, [contentDim, parentH, parentW]);

  const handleLoad = (something) => {
    // Here, to the react gods, I ask for forgiveness.
    // I will plant many many trees.

    // If it's too much of a tall boy, chop it's legs. Otherwise the thumbnail looks retarded.
    const contentH = Math.min(
      something.target.contentWindow.document.body.scrollHeight,
      800
    );
    const contentW = something.target.contentWindow.document.body.scrollWidth;
    setContentDim({
      width: contentW,
      height: contentH,
    });
    // Remove the scroll bar in iframe cause by content margins
    something.target.contentWindow.document.body.style.overflow = "hidden";
  };

  return (
    <MailThumbnailContainer style={containerStyles && { ...containerStyles }}>
      <ThumbnailIframe
        title="Hey, look an iframe!"
        srcDoc={html}
        width="100%"
        height="100%"
        style={iframeStyles && { ...iframeStyles }}
        onLoad={handleLoad}
      />
      <ThumbnailOverlay />
    </MailThumbnailContainer>
  );
};

const MailThumbnailContainer = styled.div`
  position: absolute;
  transform-origin: top left;
  top: 50%;
  left: 25%;
  /* transform: translate(-50%, -50%); */
  /* &:hover::after {
    content: "";
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    position: absolute;
    background: red;
  } */
`;

const ThumbnailIframe = styled.iframe`
  /* flex: 0 0 32%; */
  display: block;
  border: none;

  /* position: absolute;
  transform-origin: top left;
  top: 50%;
  left: 25%;
  transform: translate(-50%, -50%); */
`;

const ThumbnailOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  transition: background 0.4s ease-in-out;
  border-radius: 5%;

  &:hover {
    background: #00000085;
  }
`;
