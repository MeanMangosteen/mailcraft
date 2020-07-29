import { css } from "styled-components";
import Axios from "axios";
import { useRef, useEffect, useCallback } from "react";

export const CSSDividerTop = ({ width, IHaveSetRelativePosition = false }) => {
  if (!IHaveSetRelativePosition) return;
  return css`
    &::before,
    &::after {
      content: "";
      position: absolute;
      display: block;
      top: 0px;
      height: 1px;
      width: ${width};
    }

    &::before {
      left: 50%;
      background: linear-gradient(to right, #333 0%, transparent 100%);
    }

    &::after {
      left: 50%;
      background: linear-gradient(to left, #333 0%, transparent 100%);
      transform: translateX(-100%);
    }
  `;
};

export const CSSDividerBottom = ({
  width,
  IHaveSetRelativePosition = false,
}) => {
  if (!IHaveSetRelativePosition) return;
  return css`
    &::before,
    &::after {
      content: "";
      position: absolute;
      display: block;
      bottom: -0px;
      height: 1px;
      width: ${width};
    }

    &::before {
      left: 50%;
      background: linear-gradient(to right, #333 0%, transparent 100%);
    }

    &::after {
      left: 50%;
      background: linear-gradient(to left, #333 0%, transparent 100%);
      transform: translateX(-100%);
    }
  `;
};

export const CSSDividerRight = ({
  height,
  IHaveSetRelativePosition = false,
}) => {
  if (!IHaveSetRelativePosition) return;
  return css`
    &::before,
    &::after {
      content: "";
      position: absolute;
      display: block;
      right: -0px;
      width: 1px;
      height: ${height};
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
};

export const centerContent = css`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const api = Axios.create();
export const setupInterceptors = (setLoggedIn) => {
  api.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      if (error.response.status === 401) {
        setLoggedIn(false);
      }
      return Promise.reject(error);
    }
  );

  api.interceptors.request.use((request) => {
    console.log("Starting Request", request);
    return request;
  });

  // api.interceptors.response.use((response) => {
  //   console.log("Recieved Response: ", response);
  //   return response;
  // });
};

// Kindly provided by:
// https://stackoverflow.com/questions/55187563/determine-which-dependency-array-variable-caused-useeffect-hook-to-fire
const usePrevious = (value, initialValue) => {
  const ref = useRef(initialValue);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};
export const useEffectDebugger = (
  effectHook,
  dependencies,
  dependencyNames = []
) => {
  const previousDeps = usePrevious(dependencies, []);

  const changedDeps = dependencies.reduce((accum, dependency, index) => {
    if (dependency !== previousDeps[index]) {
      const keyName = dependencyNames[index] || index;
      return {
        ...accum,
        [keyName]: {
          before: previousDeps[index],
          after: dependency,
        },
      };
    }

    return accum;
  }, {});

  if (Object.keys(changedDeps).length) {
    console.log("[use-effect-debugger] ", changedDeps);
  }

  useEffect(effectHook, dependencies);
};

export const cb = useCallback;
