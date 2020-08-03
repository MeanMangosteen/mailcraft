import React, { useState, useEffect } from "react";
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
  const [lastPage, setLastPage] = useState<number>(3);
  const [ref, inView, entry] = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (inView) {
      setTimeout(() => setLastPage(lastPage + 1), 500);
    }
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
    const numMailPerPage = 25;
    for (let i = 0; i <= (victimEmails?.length || -1); i += numMailPerPage) {
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
        <PageContainer key={i / numMailPerPage}>{mailCards}</PageContainer>
      );
      newMailPages.push(page);
    }

    setMailPages([...newMailPages]);
  }, [victimEmails, selected]);

  return (
    <ListViewContainer>
      {mailPages.slice(0, lastPage)}
      <ScrollWatcher ref={ref} />
    </ListViewContainer>
  );
};

const ListViewContainer = styled.div`
  overflow-y: scroll;
`;

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const ScrollWatcher = styled.div`
  height: 1px;
`;

