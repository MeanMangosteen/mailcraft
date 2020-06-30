import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { RiZoomInLine } from "react-icons/ri";
export const MailThumbnail = ({ parentH, parentW, html, onClick }) => {
  const [iframeStyles, setIframeStyles] = useState<any>(null);
  const [containerStyles, setContainerStyles] = useState<any>(null);
  const [contentDim, setContentDim] = useState<any>(null);
  // const [expandIframe, setExpandIframe] = useState<boolean>(false);

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

  const handleClick = (event) => {
    event.preventDefault();
    event.stopPropagation(); // don't uncheck the card
    onClick();
  };

  return (
    <MailThumbnailContainer
      style={containerStyles && { ...containerStyles }}
      onClick={handleClick}
    >
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

const ThumbnailOverlay = () => {
  return (
    <ThumbnailOverlayContainer>
      <ZoomIcon />
    </ThumbnailOverlayContainer>
  );
};
const ThumbnailOverlayContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  transition: background 0.4s ease-in-out;
  border-radius: 5%;

  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    background: #00000085;
  }
`;

const ZoomIcon = styled(RiZoomInLine)`
  height: 50%;
  width: 50%;
  color: #e4e0e0;

  transition: opacity 0.45s;
  opacity: 0;
  ${ThumbnailOverlayContainer}:hover & {
    opacity: 1;
  }
`;
