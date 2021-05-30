import styled from "styled-components";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createUserAuth,
  userSignIn,
  addNewUserInfo,
  getCurrentUser,
  getUserProfile,
} from "../utils/firebase.js";
import { Modal, Form } from "react-bootstrap";

const Wrapper = styled.div`
  width: 50%;
  margin: 0 auto;
`;

const Header = styled.div`
  width: 100%;
  font-size: 20px;
  text-align: center;
  padding-bottom: 10px;
  border-bottom: 1px solid #dee2e6;
`;

const HeaderActive = styled.div`
  width: 100%;
  font-size: 20px;
  text-align: center;
  padding-bottom: 10px;
  font-weight: 600;
`;

const ButtonContainer = styled.div`
  width: 100%;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 10px;
`;

const SwitchButton = styled.button`
  width: 100%;
  height: 30px;
  margin-top: 20px;
  border-radius: 8px;
  border: solid 1px #dee2e6;
  padding: 0 10px;
`;

const SubmitButton = styled.button`
  width: 100%;
  height: 30px;
  margin-top: 20px;
  border-radius: 8px;
  border: solid 1px #dee2e6;
  padding: 0 10px;
  background-color: #1190cb;
  color: white;
`;

const styles = {
  modal: {
    marginTop: "30px",
  },
  modalHeader: {
    justifyContent: "space-evenly",
    border: "none",
  },
  modalTitle: {
    paddingBottom: "5px",
  },
  modalFooter: {
    border: "none",
  },
};

function Login() {
  const loginModal = useSelector((state) => state.modal.login);

  const handleClose = () => dispatch({ type: "LOGIN", data: false });

  const [action, setAction] = useState("login");
  const [identity, setIdentity] = useState("user");
  const [signupInfo, setSignupInfo] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });
  const dispatch = useDispatch();

  const constructUserData = (userId, email, name) => {
    let userData = {
      id: userId,
      role: 0,
      userEmail: email,
      userName: name,
      userPhoto: "",
    };
    return userData;
  };

  const constructHosterData = (userId, email, name, phone) => {
    let hosterData = {
      id: userId,
      role: 1,
      orgEmail: email,
      orgName: name,
      orgContact: phone,
      orgPhoto: "",
    };
    return hosterData;
  };

  const handleActionChange = (e) => {
    setAction(e.target.id);
  };

  const handleInputChange = (e) => {
    setSignupInfo({ ...signupInfo, [e.target.id]: e.target.value });
  };

  useEffect(() => {}, [signupInfo]);

  const handleIdentityChange = (e) => {
    setIdentity(e.target.id);
  };

  const signup = async (inputs) => {
    const email = inputs.email.value;
    const password = inputs.password.value;
    const name = inputs.name.value;
    const signupMessage = await createUserAuth(email, password);
    if (signupMessage === "auth/email-already-in-use") {
      alert("此Email已被註冊");
    } else {
      const userId = signupMessage;
      let userData;
      identity === "user"
        ? (userData = constructUserData(userId, email, name))
        : (userData = constructHosterData(
            userId,
            email,
            name,
            inputs.phone.value
          ));
      await addNewUserInfo(userId, userData);

      dispatch({ type: "SIGN_IN", data: true });
      dispatch({ type: "GET_USERID", data: userId });

      identity === "user"
        ? dispatch({ type: "GET_USERROLE", data: 0 })
        : dispatch({ type: "GET_USERROLE", data: 1 });

      alert("已註冊成功");
      dispatch({ type: "LOGIN", data: false });
    }
  };

  const login = async (inputs) => {
    const email = inputs.email.value;
    const password = inputs.password.value;
    const loginMessage = await userSignIn(email, password);
    if (loginMessage === "auth/user-not-found") {
      alert("尚未註冊喔");
    } else if (loginMessage === "auth/wrong-password") {
      alert("密碼有誤喔");
    } else {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        const userId = loginMessage;
        const userData = await getUserProfile(userId);
        if (identity === "user" && userData.role === 0) {
          dispatch({ type: "SIGN_IN", data: true });
          dispatch({ type: "GET_USERID", data: userId });
          dispatch({ type: "GET_USERROLE", data: 0 });
          alert("已登入");
          dispatch({ type: "LOGIN", data: false });
        } else if (identity === "organization" && userData.role === 1) {
          dispatch({ type: "SIGN_IN", data: true });
          dispatch({ type: "GET_USERID", data: userId });
          dispatch({ type: "GET_USERROLE", data: 1 });
          alert("已登入");
          dispatch({ type: "LOGIN", data: false });
        } else if (identity === "user") {
          alert("請以機構身分登入");
        } else {
          alert("請以志工身分登入");
        }
      }
    }
  };

  const [validated, setValidated] = useState(false);

  const handleLoginSubmit = async (event) => {
    const inputs = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    setValidated(true);
    if (inputs.checkValidity() === true) {
      login(inputs);
    }
  };

  const handleSignupSubmit = async (event) => {
    const inputs = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();

    setValidated(true);
    if (inputs.checkValidity() === true) {
      signup(inputs);
    }
  };

  const renderModalHeader = () => {
    return identity === "user" && action === "login" ? (
      <Modal.Header style={styles.modalHeader} className="mx-2 pb-0">
        <HeaderActive
          id={"user"}
          style={{ borderBottom: "2px solid #1190cb", color: "#1190cb" }}
          onClick={(e) => handleIdentityChange(e)}
        >
          志工登入
        </HeaderActive>
        <Header id={"organization"} onClick={(e) => handleIdentityChange(e)}>
          機構登入
        </Header>
      </Modal.Header>
    ) : identity === "user" ? (
      <Modal.Header style={styles.modalHeader} className="mx-2 pb-0">
        <HeaderActive
          id={"user"}
          style={{ borderBottom: "2px solid #1190cb", color: "#1190cb" }}
          onClick={(e) => handleIdentityChange(e)}
        >
          志工註冊
        </HeaderActive>
        <Header id={"organization"} onClick={(e) => handleIdentityChange(e)}>
          機構註冊
        </Header>
      </Modal.Header>
    ) : action === "login" ? (
      <Modal.Header style={styles.modalHeader} className="mx-2 pb-0">
        <Header id={"user"} onClick={(e) => handleIdentityChange(e)}>
          志工登入
        </Header>
        <HeaderActive
          id={"organization"}
          onClick={(e) => handleIdentityChange(e)}
          style={{ borderBottom: "2px solid #3E7054", color: "#3E7054" }}
        >
          機構登入
        </HeaderActive>
      </Modal.Header>
    ) : (
      <Modal.Header style={styles.modalHeader} className="mx-2 pb-0">
        <Header id={"user"} onClick={(e) => handleIdentityChange(e)}>
          志工註冊
        </Header>
        <HeaderActive
          id={"organization"}
          onClick={(e) => handleIdentityChange(e)}
          style={{ borderBottom: "2px solid #3E7054", color: "#3E7054" }}
        >
          機構註冊
        </HeaderActive>
      </Modal.Header>
    );
  };

  const userLogin = () => {
    return (
      <Form noValidate validated={validated} onSubmit={handleLoginSubmit}>
        <Form.Group controlId="email">
          <Form.Control type="email" placeholder="Email" required />
          <Form.Control.Feedback type="invalid" style={{ position: "inherit" }}>
            請輸入正確的eamil
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Control type="password" placeholder="密碼" required />
          <Form.Control.Feedback type="invalid" style={{ position: "inherit" }}>
            請輸入密碼
          </Form.Control.Feedback>
        </Form.Group>
        <ButtonContainer>
          <SwitchButton id="signup" onClick={(e) => handleActionChange(e)}>
            立即註冊
          </SwitchButton>
          <SubmitButton type="submit">登入</SubmitButton>
        </ButtonContainer>
      </Form>
    );
  };

  const organizationLogin = () => {
    return (
      <Form noValidate validated={validated} onSubmit={handleLoginSubmit}>
        <Form.Group controlId="email">
          <Form.Control type="email" placeholder="Email" required />
          <Form.Control.Feedback type="invalid" style={{ position: "inherit" }}>
            請輸入正確的eamil
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Control type="password" placeholder="密碼" required />
          <Form.Control.Feedback type="invalid" style={{ position: "inherit" }}>
            請輸入密碼
          </Form.Control.Feedback>
        </Form.Group>
        <ButtonContainer>
          <SwitchButton id="signup" onClick={(e) => handleActionChange(e)}>
            立即註冊
          </SwitchButton>
          <SubmitButton type="submit" style={{ backgroundColor: "#3E7054" }}>
            登入
          </SubmitButton>
        </ButtonContainer>
      </Form>
    );
  };

  const userSignup = () => {
    return (
      <Form noValidate validated={validated} onSubmit={handleSignupSubmit}>
        <Form.Group controlId="name">
          <Form.Control
            type="name"
            placeholder="姓名"
            className="mb-1"
            required
          />
          <Form.Control.Feedback type="invalid" style={{ position: "inherit" }}>
            請輸入姓名
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="email">
          <Form.Control
            type="email"
            placeholder="Email"
            className="mb-1"
            required
          />
          <Form.Control.Feedback type="invalid" style={{ position: "inherit" }}>
            請輸入正確的email
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Control
            type="password"
            placeholder="密碼"
            className="mb-1"
            required
          />
          <Form.Control.Feedback type="invalid" style={{ position: "inherit" }}>
            請輸入密碼
          </Form.Control.Feedback>
        </Form.Group>
        <ButtonContainer>
          <SwitchButton id="login" onClick={(e) => handleActionChange(e)}>
            立即登入
          </SwitchButton>
          <SubmitButton type="submit">註冊</SubmitButton>
        </ButtonContainer>
      </Form>
    );
  };

  const organizationSignup = () => {
    return (
      <Form noValidate validated={validated} onSubmit={handleSignupSubmit}>
        <Form.Group controlId="name">
          <Form.Control
            type="name"
            placeholder="機構名稱"
            className="mb-1"
            required
          />
          <Form.Control.Feedback type="invalid" style={{ position: "inherit" }}>
            請輸入機構名稱
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="email">
          <Form.Control
            type="email"
            placeholder="Email"
            className="mb-1"
            required
          />
          <Form.Control.Feedback type="invalid" style={{ position: "inherit" }}>
            請輸入正確的email
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Control
            type="password"
            placeholder="密碼"
            className="mb-1"
            required
          />
          <Form.Control.Feedback type="invalid" style={{ position: "inherit" }}>
            請輸入密碼
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="phone">
          <Form.Control
            type="number"
            placeholder="連絡電話"
            className="mb-1"
            required
          />
          <Form.Control.Feedback type="invalid" style={{ position: "inherit" }}>
            請輸入連絡電話
          </Form.Control.Feedback>
        </Form.Group>
        <ButtonContainer>
          <SwitchButton id="login" onClick={(e) => handleActionChange(e)}>
            立即登入
          </SwitchButton>
          <SubmitButton type="submit">註冊</SubmitButton>
        </ButtonContainer>
      </Form>
    );
  };

  return (
    <Wrapper>
      <Modal
        show={loginModal}
        onHide={handleClose}
        style={styles.modal}
        size="sm"
      >
        {renderModalHeader()}
        <Modal.Body className="mx-2 py-4">
          {action === "login" && identity === "user"
            ? userLogin()
            : action === "login" && identity === "organization"
            ? organizationLogin()
            : identity === "user"
            ? userSignup()
            : organizationSignup()}
        </Modal.Body>
      </Modal>
    </Wrapper>
  );
}

export default Login;
