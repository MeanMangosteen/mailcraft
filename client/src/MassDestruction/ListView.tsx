import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { useInView } from "react-intersection-observer";
import { ListItem } from "./ListItem";

type ListViewProps = {
  victimEmails: any[];
  selected: Object;
  onItemClick: (index: number) => () => void;
};

export const ListView = ({
  victimEmails,
  selected,
  onItemClick,
}: ListViewProps) => {
  const [mailPages, setMailPages] = useState<any[]>([]);
  const [lastPage, setLastPage] = useState<number>(2);
  const [currPage, setCurrPage] = useState<number>(0);
  const [ref, inView] = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (inView) {
      setTimeout(() => setLastPage(lastPage + 1), 500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  const handleShowTime = useCallback((pageNumber) => {
    console.log(pageNumber);
    // Always have a buffer of at least two pages ahead of current page
    setCurrPage(pageNumber);
    if (pageNumber + 3 > lastPage) {
      setLastPage(pageNumber + 3)
    }
  }, [lastPage]);

  useEffect(() => {
    /**
     * Go from victim's emails' html to actual components.
     *
     * We were going to implement page based scrolling
     * once upon a time. The assorting of mailcard into pages
     * is a artefact of that.
     */
    const newMailPages: any[] = [];
    const numMailPerPage = 25;
    for (let i = 0; i <= (victimEmails ?.length || -1); i += numMailPerPage) {
      const mailCards = victimEmails
        ?.slice(i, i + numMailPerPage)
          .map((mail, idx) => {
            return (
              <ListItem
                selected={selected[i + idx]}
                index={i + idx}
                key={idx}
                mail={mail}
                onClick={onItemClick}
              />
            );
          });
      const page = (
        <PageContainer key={i / numMailPerPage}>{mailCards}
          <ScrollWatcher
            pageNumber={i / numMailPerPage} onShowTime={handleShowTime}
          />
        </PageContainer>
      );
      newMailPages.push(page);
    }

    setMailPages([...newMailPages]);
  }, [victimEmails, selected, onItemClick, handleShowTime]);

  console.log('last page', lastPage)
  return (
    <ListViewContainer>
      {mailPages.slice(0, lastPage)}
    </ListViewContainer>
  );
};

const ScrollWatcher = styled(
  ({ pageNumber, onShowTime, className = "scroll-watcher" }) => {
    const [ref, inView] = useInView({
      threshold: 0,
    });

    useEffect(() => {
      if (inView) {
        console.log("inView");
        onShowTime(pageNumber);
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

const ListViewContainer = styled.div`
  overflow-y: scroll;
`;

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 4rem;
  position: relative;
`;

