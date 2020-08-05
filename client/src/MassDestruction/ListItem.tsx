import React, { useState } from "react";
import styled from "styled-components";
import { MdRadioButtonUnchecked } from "react-icons/md";
import { IoMdCheckmarkCircle } from "react-icons/io";
import { centerContent } from "../utils";
import { RiZoomInLine } from "react-icons/ri";
import { ExpandedIframe } from "./ExpandedIframe";

type ListItemProps = {
  mail: Object;
  selected: boolean;
  index: number;
  onClick: (index: number) => () => void;
};

export const ListItem = ({ mail, selected, index, onClick }: ListItemProps) => {
  const [expandIframe, setExpandIframe] = useState<boolean>(false);

  return (
    <>
      <ListItemCotainer selected={selected} onClick={onClick(index)}>
        <SubjectText>{mail["body[]"].subject}</SubjectText>
        <ExpandIcon
          onClick={(e) => {
            e.stopPropagation();
            setExpandIframe(true);
          }}
        />
        <CheckBox selected={selected} />
      </ListItemCotainer>
      <ExpandedIframe
        show={expandIframe}
        mail={mail}
        onClose={(e) => {
          // e.stopPropagation();
          setExpandIframe(false);
        }}
      />
    </>
  );
};

const SubjectText = styled.div`
  width: 40%;
  box-sizing: border-box;

  font-size: 1.8rem;
  font-weight: bold;

  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
  white-space: nowrap;
  margin-left: 1rem;
`;
const CheckBox = ({ selected }) => {
  return (
    <CheckBoxContainer>
      {!selected ? <MdRadioButtonUnchecked /> : <IoMdCheckmarkCircle />}
    </CheckBoxContainer>
  );
};
const CheckBoxContainer = styled.div`
  ${centerContent}
  margin-right: 1rem;
  font-size: 2.5rem;
`;

const ExpandIconContainer = styled.div`
  ${centerContent}
  position: relative;
  z-index: 2;
`;
const ExpandIcon = styled(({ onClick, className = "expand-icon" }) => (
  <ExpandIconContainer className={className}>
    <ZoomIcon onClick={onClick} />
  </ExpandIconContainer>
))``;
const ListItemCotainer = styled.div`
  display: flex;

  z-index: 1;
  border-radius: 4px;
  box-shadow: ${({ selected }: { selected: boolean }) =>
    selected
      ? "2px 2px 3px 3px hsla(216, 54%, 65%, 1)"
      : "2px 2px 3px 0px rgba(0,0,0,0.75)"};

  transition: box-shadow 0.3s, transform 15ms;
  margin: 1rem 0.5rem;
  padding: 0.5rem;

  ${SubjectText} {
    flex-basis: 80%;
  }

  ${ExpandIcon} {
    flex-grow: 1;
  }
`;

const ZoomIcon = styled(RiZoomInLine)`
  color: black;
  position: absolute;
  right: 5%;
  font-size: 2.5rem;

  transition: opacity 0.3s ease-in-out;
  opacity: 0;
  ${ListItemCotainer}:hover & {
    opacity: 1;
  }
`;
