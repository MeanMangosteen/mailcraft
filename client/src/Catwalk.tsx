import React, { useState, useEffect } from "react";
import { Transition, SwitchTransition } from "react-transition-group";
import styled from "styled-components";

type ShowTextWithStyleProps = {
  children: React.ReactElement<WalkingCatProps>[];
  onFinish?: () => void;
  timings?: number[];
  className?: string;
};

export const Catwalk = ({
  children,
  onFinish,
  className = "catwalk",
}: ShowTextWithStyleProps) => {
  const [childCount, setChildCount] = useState<number>(0);
  const [visibleChildren, setVisibleChildren] = useState(
    Array(children.length).fill(false) // the indexes represent each child, the value: whether it's visible.
  );
  const [isFinished, setIsFinished] = useState<boolean>(false);

  useEffect(() => {
    if (isFinished) return;
    if (childCount > children.length) {
      onFinish && onFinish();
      setIsFinished(true);
      return;
    }
    const timer = setTimeout(() => {
      visibleChildren[childCount] = true;
      setVisibleChildren([...visibleChildren]);
      childCount < children.length - 1 && setChildCount(childCount + 1);
    }, children[childCount].props?.duration || 3000);

    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [childCount]);

  return (
    <CatwalkContainer className={className}>
      <SwitchTransition>
        <Transition
          onEnter={children[childCount].props?.onShow}
          key={childCount}
          timeout={200}
        >
          {(state) => <Fade state={state}>{children[childCount]}</Fade>}
        </Transition>
      </SwitchTransition>
    </CatwalkContainer>
  );
};

type WalkingCatProps = {
  children: React.ReactNode;
  duration?: number;
  onShow?: () => void;
  className?: string;
};

/**
 * Wrap each child/cat of the catwalk with this component
 */
export const WalkingCat = styled(
  ({
    children,
    duration,
    onShow,
    className = "walking-cat",
  }: WalkingCatProps) => {
    return <span className={className}>{children}</span>;
  }
)``;

const CatwalkContainer = styled.div``;

const Fade = styled.div`
  transition: 0.5s;
  opacity: ${(props: { state?: any }) => (props.state === "entered" ? 1 : 0)};
  will-change: opacity;
`;
