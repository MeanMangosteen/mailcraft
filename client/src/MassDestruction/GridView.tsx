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
  const [currPage, setCurrPage] = useState<number>(0);
  const [ref, inView] = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (inView) {
      setTimeout(() => setLastPage(lastPage + 1), 250);
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
    if (!victimEmails?.length) return;
    const newMailPages: any[] = [];
    const numMailPerPage = 9;
    const numPages = Math.ceil(victimEmails.length / numMailPerPage);
    for (let i = 0; i < numPages; i++) {
      const startIdx = i * numMailPerPage;
      const endIdx = startIdx + numMailPerPage;
      const mailCards = victimEmails
        ?.slice(startIdx, endIdx)
        .map((mail, idx) => {
          return (
            <MailCard
              selected={selected[startIdx + idx]}
              index={startIdx + idx}
              key={startIdx + idx}
              mail={mail}
              onClick={onCardClick}
              page={i}
              currPage={currPage}
            />
          );
        });
      const page = (
        <PageContainer key={i}>
          {mailCards}
          <ScrollWatcher pageNumber={i} onShowTime={handleShowTime} />
        </PageContainer>
      );
      newMailPages.push(page);
    }

    setMailPages([...newMailPages]);
  }, [victimEmails, selected, onCardClick, currPage]);

  const handleShowTime = (pageNumber) => {
    console.log(pageNumber);
    setCurrPage(pageNumber);
  };

  return (
    <GridViewContainer>
      {mailPages.slice(0, lastPage)}
      <EndWatcher ref={ref} />
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
  position: relative;
`;

const EndWatcher = styled.div`
  height: 1px;
`;

const ScrollWatcher = styled(
  ({ pageNumber, something, onShowTime, className = "scroll-watcher" }) => {
    const [ref, inView] = useInView({
      threshold: 0,
    });

    useEffect(() => {
      if (inView) {
        console.log("inView");
        onShowTime(pageNumber, something);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inView]);
    return <div ref={ref} className={className} />;
  }
)`
  height: 1px;
  width: 100%;
  position: absolute;
  top: 50%;
`;
