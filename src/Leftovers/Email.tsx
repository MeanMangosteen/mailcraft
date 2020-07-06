import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { RiZoomInLine } from "react-icons/ri";

export const Email = ({
  parentH,
  parentW,
  html,
  onClick,
  expandable = false,
  className = "",
}) => {
  const [contentDim, setContentDim] = useState<any>(null);
  const [scaleFactor, setScaleFactor] = useState<any>(0);

  useEffect(() => {
    if (!contentDim) return; // iframe hasn't loaded yet

    const contentW = contentDim.width;
    const contentH = contentDim.height;
    const scaleFactor = Math.min(parentH / contentH, 1);
    setScaleFactor(scaleFactor);
  }, [contentDim, parentH, parentW]);

  const handleLoad = (something) => {
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
    <EmailContainer
      scaleFactor={scaleFactor}
      contentDim={contentDim}
      parentDim={{ height: parentH, width: parentW }}
      className={className}
    >
      <ThumbnailIframe
        title="Hey, look an iframe!"
        srcDoc={html}
        width="100%"
        height="100%"
        onLoad={handleLoad}
      />
      {expandable && <ThumbnailZoomOverlay onClick={handleExpandClick} />}
    </EmailContainer>
  );
};

const EmailContainer = styled.div<{
  scaleFactor: number;
  parentDim: { height: number; width: number };
  contentDim: { height: number; width: number };
}>`
  position: absolute;
  transform-origin: top left;
  top: 50%;
  left: 50%;

  /** Scale downt to fit mail in parent */
  transform: ${({ scaleFactor }) =>
    `scale(${scaleFactor}) translate(-50%, -50%)`};

  /**
   * Height ->
   * Height of the email content
   *
   * Width ->
   * Grow to take as much room the parent gives it.
   * We want the email content to be scaled up,
   * since this value is not of the content,
   * but of the parent we have to counteract the scaling down.
  */
  height: ${({ contentDim }) => contentDim?.height}px;
  width: ${({ parentDim, scaleFactor }) =>
    parentDim?.width * (1 / scaleFactor)}px;
`;

const ThumbnailIframe = styled.iframe`
  display: block;
  border: none;
`;

const ThumbnailZoomOverlay = ({ onClick }) => {
  return (
    <ThumbnailOverlayContainer onClick={onClick}>
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
