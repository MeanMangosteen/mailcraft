import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import Axios from "axios";
import { useMail } from "../reducers/mail";
import styled from "styled-components";

const MassDestruction = () => {
  const location = useLocation();
  const qParams = queryString.parse(location.search);
  const { mail } = useMail();

  console.log("qparams", qParams);

  useEffect(() => {
    if (!qParams.victim) throw Error("Victim needed to destroy!");
    if (!mail) return;

    const victimEmails = mail.filter(
      (m) => m.envelope.from[0].address.split("@")[1] === qParams["victim"]
    );
    console.log(mail);
    console.log(victimEmails);
  }, [mail, qParams.victim]);

  // Render mail

  return <h1>Hello!</h1>;
};

const PageContainer = styled.div``;

export { MassDestruction };
