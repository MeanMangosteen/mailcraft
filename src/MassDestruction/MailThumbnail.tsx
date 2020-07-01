import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { RiZoomInLine } from "react-icons/ri";

export const MailThumbnail = ({ parentH, parentW, html, onClick }) => {
  const [iframeStyles, setIframeStyles] = useState<any>(null);
  const [containerStyles, setContainerStyles] = useState<any>(null);
  const [contentDim, setContentDim] = useState<any>(null);

  useEffect(() => {
    if (!contentDim) return; // iframe hasn't loaded yet

    const contentW = contentDim.width;
    const contentH = contentDim.height;
    const scaleFactor = parentH / contentH;
    setIframeStyles({
      /**
       * Height ->
        * Height of the email content, or trimmed amount. 
        * We want this to be scaled down
        * 
       * Width -> 
        * Grow to take as much room the parent gives it. 
        * We want the email content to be scaled down,
        * since this value is not of the content,
        * but of the parent we have to counteract the scaling down.
       */
      height: contentH, 
      width: parentW * (1 / scaleFactor),
    });

    /** 
     * Allow the iframe to grow like a mad giant.
     * Then cast the scale spell to shrink.
     * Cast the translate spell to move it to it's allocated space.
     * This all looks very unintuitive... that's because it is.
     * I've tried all the obvious methods of making this happen,
     * This is the one that ended making that vision come true.
     */
    setContainerStyles({
      transform: `scale(${scaleFactor}) translate(-50%, -50%)`,
    });
  }, [contentDim, parentH, parentW]);

  const handleLoad = (something) => {
    // Here, to the react gods, I ask for forgiveness.
    // I will plant many many trees.

    
    /**
     * Okay so what we're doing here:
     * We want to squeeze a big iframe into a small space.
     * To do that we need to scale it down.
     * To scale it down the right amount we need to know 
     * the email content's dimensions.
     * 
     * If it's a tall boy, 
     * and we try to fit it all within the space,
     * it doesn't look all that great, it's scaled
     * down way too much.
     * 
     * So we set an upper limit for the height, in 
     * this case we will see a window/segment of the 
     * email in the thumbnail. Sad, but we will get
     * through these tough times.
     * */ 
    
    const contentH = Math.min(
      something.target.contentWindow.document.body.scrollHeight,
      800
    );

    const contentW = something.target.contentWindow.document.body.scrollWidth;
    setContentDim({
      width: contentW,
      height: contentH,
    });

    // Tis just a thumbnail, no scrolling allowed!
    something.target.contentWindow.document.body.style.overflow = "hidden";
  };

  const handleExpandClick = (event) => {
    event.preventDefault();

    /**
     * Underneath this boi, is another click listener.
     * We don't want both going off, just this one.
     */
    event.stopPropagation(); // don't uncheck the card
    onClick();
  };

  return (
    <MailThumbnailContainer
      style={containerStyles && { ...containerStyles }}
      onClick={handleExpandClick}
    >
      <ThumbnailIframe
        title="Hey, look an iframe!"
        srcDoc={html}
        width="100%"
        height="100%"
        style={iframeStyles && { ...iframeStyles }}
        onLoad={handleLoad}
      />
      <ThumbnailZoomOverlay />
    </MailThumbnailContainer>
  );
};

const MailThumbnailContainer = styled.div`
  position: absolute;
  transform-origin: top left;
  top: 50%;
  left: 25%;

  /* Below makes one hell of a vertical divider */
  /* Credit: https://stackoverflow.com/questions/19069943/css-vertical-border-with-horizontal-gradients */
  &::before,
  &::after {
    content: "";
    position: absolute;
    display: block;
    right: -10px;
    width: 1px;
    height: 50%;
  }

  &::before {
    top: 0;
    background: linear-gradient(to top, #333 0%, transparent 100%);
  }

  &::after {
    bottom: 0;
    background: linear-gradient(to bottom, #333 0%, transparent 100%);
  }
`;

const ThumbnailIframe = styled.iframe`
  display: block;
  border: none;
`;


const ThumbnailZoomOverlay = () => {
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
  border-radius: 5%;

  display: flex;
  justify-content: center;
  align-items: center;
  background: #00000085;

  transition: opacity 0.2s ease-in-out;
  opacity: 0;
  &:hover {
    opacity: 1;
  }
`;

const ZoomIcon = styled(RiZoomInLine)`
  height: 30%;
  width: 30%;
  color: #e4e0e0;

  transition: opacity 0.4s ease-in-out;
  opacity: 0;
  ${ThumbnailOverlayContainer}:hover & {
    opacity: 1;
  }
`;
