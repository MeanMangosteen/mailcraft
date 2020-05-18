
import React from 'react';
import { SizeMe } from 'react-sizeme';
import { MailThumbnail } from './MailThumbnail';
import styled from 'styled-components';

export const MailCard = ({ html, subject, selected, index, onClick }) => {
  return (
    <SizeMe monitorHeight>
      {({ size }) => (
        <MailCardContainer selected={selected} onClick={onClick(index)}>
          <MailThumbnail
            parentH={size?.height && size.height * 0.85}
            parentW={size.width}
            html={html}
          />
          <SubjectText
            style={{
              maxHeight: size?.height ? size.height * 0.15 : undefined,
            }}
          >
            {subject}
          </SubjectText>
        </MailCardContainer>
      )}
    </SizeMe>
  );
};

const MailCardContainer = styled.div`
  /* display: flex; */
  flex-direction: column;
  flex: 0 0 32%;
  margin: 1px;
  /* border: black 1px solid; */
  box-shadow: 2px 4px 10px #848484;
  border-radius: 10px;
  border: ${({ selected }: { selected: boolean }) =>
    selected ? "2px red solid" : undefined};
`;
const SubjectText = styled.div`
  /* display: flex;
  justify-content: center;
  align-items: center; */

  width: 90%;
  box-sizing: border-box;

  font-size: 1.8rem;
  font-weight: bold;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  position: absolute;
  margin: 0;
  margin-left: 1rem;
  bottom: 0;
`;