import React, { useState, useEffect, Fragment, useCallback as cb } from "react";
import { Transition } from "react-transition-group";
import styled from "styled-components";

type ShowTextWithStyleProps = {
  children: React.ReactElement<StylishItemProps>[];
  onFinish?: () => void;
};

export const ShowTextWithStyle = ({
  children,
  onFinish,
}: ShowTextWithStyleProps) => {
  const [childCount, setChildCount] = useState<number>(0);
  const [tickingClock, setTickingClock] = useState<any>();
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
    setTimeout(() => {
      visibleChildren[childCount] = true;
      setVisibleChildren([...visibleChildren]);
      setChildCount(childCount + 1);
    }, 2000);
  }, [childCount, children]);

  const childs = children.map((C, idx) => {
    return (
      <Transition
        in={visibleChildren[idx]}
        timeout={0}
        key={idx}
        onEnter={cb(() => C.props.onShow && C.props.onShow(), [])}
      >
        {(state) => (
          <Fade state={state}>
            {React.isValidElement(C) ? React.cloneElement(C) : C}
          </Fade>
        )}
      </Transition>
    );
  });
  return <WithStyleContainer>{childs}</WithStyleContainer>;
};

type StylishItemProps = {
  onShow?: () => void;
  state?: any;
  children: React.ReactNode;
};

export const StylishItem = ({ onShow, children }: StylishItemProps) => {
  return <Fragment>{children}</Fragment>;
};

const WithStyleContainer = styled.div``;

const Fade = styled.div`
  transition: 0.5s;
  opacity: ${(props: { state?: any }) => (props.state === "entered" ? 1 : 0)};
  will-change: opacity;
`;
