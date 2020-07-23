import React, { useState, useEffect, Fragment, useCallback as cb } from "react";
import { Transition } from "react-transition-group";
import styled from "styled-components";
import { centerContent } from "./utils";

type CatwalkProps = {
  children: React.ReactElement<WalkingCatProps>[];
  onFinish?: () => void;
  timings?: number[];
  className?: string;
};

export const Catwalk = styled(
  ({
    children,
    onFinish,
    timings = undefined,
    className = "catwalk",
  }: CatwalkProps) => {
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
      setTimeout(
        () => {
          visibleChildren[childCount] = true;
          setVisibleChildren([...visibleChildren]);
          setChildCount(childCount + 1);
        },
        timings ? timings[childCount] : 2000
      );
    }, [childCount, children]);

    const childs = children.map((C, idx) => {
      return (
        <Transition
          in={visibleChildren[idx]}
          timeout={0}
          key={idx}
          onEnter={cb(() => C.props.onShow && C.props.onShow(), [])}
          className={className}
        >
          {(state) => (
            <Fade state={state}>
              {React.isValidElement(C) ? React.cloneElement(C) : C}
            </Fade>
          )}
        </Transition>
      );
    });
    return <CatwalkContainer>{childs}</CatwalkContainer>;
  }
)``;

type WalkingCatProps = {
  onShow?: () => void;
  state?: any;
  children: React.ReactNode;
};

/**
 * This component purely serves to expose the `onShow` callback prop.
 * If a component wishes to have a catwalk, then they may wish to know when a
 * certain cat is walking. E.g. trigger lights, or pictures for the cat.
 */
export const WalkingCat = ({ onShow, children }: WalkingCatProps) => {
  return <Fragment>{children}</Fragment>;
};

const CatwalkContainer = styled.div``;

const Fade = styled.div`
  transition: 0.5s;
  opacity: ${(props: { state?: any }) => (props.state === "entered" ? 1 : 0)};
  will-change: opacity;
`;
