/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { postParticipantInfo } from "../../utils/firebase.js";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { Form, Col } from "react-bootstrap";
import { toast } from "react-toastify";
import { successAlertText } from "../../components/Alert.js";

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  margin: 0 auto;
  flex-direction: column;
`;

const Button = styled.button`
  width: 150px;
  background-color: #0e6cd0;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  padding: 5px 10px;
  margin: 0 auto;
  margin-top: 20px;

  @media (max-width: 540px) {
    width: 90%;
  }
`;

function EventSignUp() {
  const { id } = useParams();
  const eventId = id;
  const userId = useSelector((state) => state.isLogged.userId);

  const [emailIsInvalid, setEmailIsInvalid] = useState(false);
  const [nameIsInvalid, setNameIsInvalid] = useState(false);
  const [phoneIsInvalid, setPhoneIsInvalid] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: "ADD_USERID", data: userId });
    dispatch({ type: "ADD_EVENTID", data: eventId });
  }, []);

  const postParticipantDetail = async (signupData) => {
    await postParticipantInfo(eventId, userId, signupData);
    toast.success(successAlertText("已送出報名資訊"), {
      position: toast.POSITION.TOP_CENTER,
    });
  };

  // const [validated, setValidated] = useState(false);

  const handleSubmit = async (event) => {
    const inputs = event.currentTarget;

    if (!inputs.name.value) {
      setNameIsInvalid(true);
    } else {
      setNameIsInvalid(false);
    }

    const validRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!inputs.email.value.match(validRegex)) {
      setEmailIsInvalid(true);
    } else {
      setEmailIsInvalid(false);
    }

    const phoneno = /^\d{10}$/;
    if (!inputs.phone.value.match(phoneno)) {
      setPhoneIsInvalid(true);
    } else {
      setPhoneIsInvalid(false);
    }

    event.preventDefault();
    event.stopPropagation();
    // setValidated(true);
    if (inputs.checkValidity() === true) {
      const signupData = {
        eventId: eventId,
        participantId: userId,
        participantName: inputs.name.value,
        participantPhone: inputs.phone.value,
        participantEmail: inputs.email.value,
        participantStatus: 0,
        participantAttended: false,
        participantComment: "",
        participantRating: 0,
      };
      await postParticipantDetail(signupData);
      dispatch({ type: "SIGNUP", data: false });
    }
  };

  useEffect(() => {
    console.log(nameIsInvalid);
  }, [nameIsInvalid]);

  return (
    <Wrapper>
      <Form
        noValidate
        // validated={validated}
        onSubmit={handleSubmit}
      >
        <Form.Group as={Col} controlId="name">
          <Form.Label>參加者姓名</Form.Label>
          <Form.Control
            required
            type="text"
            className="mb-0"
            isInvalid={nameIsInvalid}
          />
          <Form.Control.Feedback type="invalid" style={{ position: "inherit" }}>
            請輸入參加者姓名
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} controlId="phone">
          <Form.Label>連絡電話</Form.Label>
          <Form.Control
            required
            type="text"
            className="mb-0"
            isInvalid={phoneIsInvalid}
          />
          <Form.Control.Feedback type="invalid" style={{ position: "inherit" }}>
            請輸入連絡電話
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            required
            type="email"
            className="mb-0"
            isInvalid={emailIsInvalid}
          />
          <Form.Control.Feedback type="invalid" style={{ position: "inherit" }}>
            請輸入正確的eamil
          </Form.Control.Feedback>
        </Form.Group>
        <Button
          type="submit"
          style={{ margin: "0 auto", display: "block", marginTop: "50px" }}
        >
          送出報名資料
        </Button>
      </Form>
    </Wrapper>
  );
}

export default EventSignUp;
