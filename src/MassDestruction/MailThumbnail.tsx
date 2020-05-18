import React, { useState, useEffect } from "react";
import styled from "styled-components";
export const MailThumbnail = ({ parentH, parentW, html }) => {
  const [iframeStyles, setIframeStyles] = useState<any>(null);
  const [contentDim, setContentDim] = useState<any>(null);

  console.log("styles", iframeStyles);
  useEffect(() => {
    if (!contentDim) return; // iframe hasn't loaded yet

    const contentW = contentDim.width;
    const contentH = contentDim.height;
    const scaleFactor = parentH / contentH;
    // contentH > contentW ? parentH / contentH : parentW / contentW;
    const lMargin = (parentW - contentW * scaleFactor) / 2;
    setIframeStyles({
      width: contentW,
      height: contentH,
      transform: `scale(${scaleFactor})`,
      marginLeft: lMargin,
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
    <ThumbnailIframe
      title="Hey, look an iframe!"
      srcDoc={html}
      width="100%"
      height="100%"
      style={iframeStyles && { ...iframeStyles }}
      onLoad={handleLoad}
    />
    // </ThumbnailIframeWrapper>
  );
};

const ThumbnailIframe = styled.iframe`
  /* flex: 0 0 32%; */
  display: block;
  position: absolute;
  transform-origin: top left;
`;
