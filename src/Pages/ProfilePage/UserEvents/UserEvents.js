import React, { useEffect, useState } from "react";
import styled from "styled-components";
// import { getHosterEvents } from "../../../utils/firebase.js";
// import { useHistory } from "react-router-dom";
import ApplyingEvents from "./ApplyingEvents.js";
import ConfirmedEvents from "./ConfirmedEvents.js";
import CompletedEvents from "./CompletedEvents.js";
import CancelledEvents from "./CancelledEvents.js";

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
`;

const Title = styled.div`
  width: 90%;
  font-size: 20px;
  line-height: 30px;
  margin: 0 auto;
  margin-top: 10px;
  margin-bottom: 10px;
  font-weight: bold;
`;

const Tabs = styled.div`
  width: 90%;
  margin: 0 auto;
  padding-bottom: 5px;
  border-bottom: 1px solid black;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
`;

const Tab = styled.div`
  font-size: 16px;
  line-height: 20px;
  padding-right: 20px;
`;

function UserEvents() {
  const [participateStatus, setParticipateStatus] = useState("申請中");

  const handleTabClick = (status) => {
    setParticipateStatus(status);
  };

  return (
    <Wrapper>
      <Title>我報名的活動</Title>
      <Tabs>
        <Tab value="申請中" onClick={(e) => handleTabClick(e.target.innerHTML)}>
          申請中
        </Tab>
        <Tab
          value="已成功報名"
          onClick={(e) => handleTabClick(e.target.innerHTML)}
        >
          已成功報名
        </Tab>
        <Tab value="已完成" onClick={(e) => handleTabClick(e.target.innerHTML)}>
          已完成
        </Tab>
        <Tab value="已取消" onClick={(e) => handleTabClick(e.target.innerHTML)}>
          已取消
        </Tab>
      </Tabs>
      {participateStatus === "申請中" && <ApplyingEvents />}
      {participateStatus === "已成功報名" && <ConfirmedEvents />}
      {participateStatus === "已完成" && <CompletedEvents />}
      {participateStatus === "已取消" && <CancelledEvents />}
    </Wrapper>
  );
}

export default UserEvents;