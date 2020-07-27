import { css } from "styled-components";
import Axios from "axios";

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
