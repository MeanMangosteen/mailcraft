import { css } from "styled-components";

export const CSSDividerTop = ({ width }) => {
  return css`
    &::before,
    &::after {
      content: "";
      position: absolute;
      display: block;
      top: -10px;
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
