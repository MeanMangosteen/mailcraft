import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { MailCard } from "./MailCard";
import { useInView } from "react-intersection-observer";

type GridViewProps = {
  victimEmails: any[];
  selected: Object;
  onCardClick: (index: number) => void;
};
export const GridView = ({
  victimEmails,
  selected,
  onCardClick,
}: GridViewProps) => {
  const [mailPages, setMailPages] = useState<any[]>([]);
  const [lastPage, setLastPage] = useState<number>(3);
  const [ref, inView] = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (inView) {
      setTimeout(() => setLastPage(lastPage + 1), 500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);
  useEffect(() => {
    /**
     * Go from victim's emails' html to actual components.
     *
     * We were going to implement page based scrolling
     * once upon a time. The assorting of mailcard into pages
     * is a artefact of that.
     */
    const newMailPages: any[] = [];
    const numMailPerPage = 9;
    for (let i = 0; i <= (victimEmails?.length || -1); i += numMailPerPage) {
      const mailCards = victimEmails
        ?.slice(i, i + numMailPerPage)
        .map((mail, idx) => {
          return (
            <MailCard
              selected={selected[i + idx]}
              index={i + idx}
              key={idx}
              mail={mail}
              onClick={onCardClick}
            />
          );
        });
      const page = (
        <PageContainer key={i / numMailPerPage}>{mailCards}</PageContainer>
      );
      newMailPages.push(page);
    }

    setMailPages([...newMailPages]);
  }, [victimEmails, selected, onCardClick]);
  return (
    <GridViewContainer>
      {mailPages.slice(0, lastPage)}
      <ScrollWatcher ref={ref} />
    </GridViewContainer>
  );
};

const GridViewContainer = styled.div`
  overflow-y: scroll;
  > * {
    flex: 0 0 32%;
  }
`;

const PageContainer = styled.div`
  display: grid;
  grid-gap: 2rem 6rem;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  height: 100%;
  padding: 2rem;
  box-sizing: border-box;
`;

const ScrollWatcher = styled.div`
  height: 1px;
`;
