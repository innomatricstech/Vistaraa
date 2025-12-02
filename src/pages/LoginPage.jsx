import React, { useState } from "react";
import {
  Button,
  Form,
  Alert,
  ToastContainer,
  Toast,
  Row,
  Col,
  Container,
  InputGroup,
} from "react-bootstrap";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import "../pages/LoginPage.css";

const auth = getAuth();

export default function AuthPage({ onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");

  const displayToast = (message, variant = "success") => {
    setToastMessage(message);
    setToastVariant(variant);
    setShowToast(true);
  };

  const fetchUserById = async (userId) => {
    try {
      const userDocRef = doc(db, "users", userId);
      const userSnapshot = await getDoc(userDocRef);
      if (!userSnapshot.exists()) return null;
      const data = userSnapshot.data();
      setUserDetails(data);
      return data;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (isLogin) {
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = await fetchUserById(userCredential.user.uid);
        displayToast(`Welcome back, ${user?.name || email.split("@")[0]}!`);
        setTimeout(() => {
          onClose ? onClose() : navigate(from, { replace: true });
        }, 1500);
      } catch (err) {
        setError("Invalid email or password.");
      }
    } else {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const userId = userCredential.user.uid;
        await setDoc(doc(db, "users", userId), {
          name,
          email,
          contactNo: "",
          gender: "",
          profileImage: null,
        });
        displayToast(`Signup successful! Please login.`, "success");
        setTimeout(() => setIsLogin(true), 1000);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUserDetails(null);
    displayToast("Logged out successfully", "danger");
  };

  return (
    <motion.div
      className="auth-container d-flex justify-content-center align-items-center"
      style={{
        minHeight: "70vh", // compact height
        backgroundColor: "#f1f3f6",
        padding: "1rem",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Container
        className="auth-box shadow-lg rounded-4 overflow-hidden p-0"
        style={{
          maxWidth: "1000px",
          width: "95%",
          backgroundColor: "white",
          borderRadius: "12px",
        }}
      >
        <Row className="g-0">
          {/* Left Panel */}
          <Col
            md={4}
            className="text-white d-none d-md-flex flex-column justify-content-center align-items-center"
            style={{
              background: "linear-gradient(180deg, #2874f0 0%, #0052cc 100%)",
              padding: "1.5rem",
            }}
          >
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <h2 className="fw-bold mb-2" style={{ fontSize: "1.6rem" }}>
                {isLogin ? "Login" : "Welcome!"}
              </h2>
              <p className="text-light" style={{ fontSize: "0.85rem" }}>
                {isLogin
                  ? "Access your orders, wishlist, and recommendations."
                  : "Create an account to start shopping!"}
              </p>
            </motion.div>
            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5 }}
              src="https://img.freepik.com/free-vector/ecommerce-concept-illustration_114360-2350.jpg"
              alt="ecommerce"
              className="img-fluid mt-3"
              style={{ maxHeight: "140px" }} // smaller image
            />
          </Col>

          {/* Right Panel */}
          <Col
            xs={12}
            md={8}
            className="bg-white p-3 p-md-4 d-flex align-items-center"
          >
            <motion.div
              className="w-100"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3
                className="fw-bold mb-3 text-center"
                style={{ color: "#fb641b", fontSize: "1.3rem" }}
              >
                {isLogin
                  ? "Sign In to Vistra"
                  : "Create Your Vistra Account"}
              </h3>

              <Form onSubmit={handleSubmit}>
                {error && <Alert variant="danger">{error}</Alert>}

                {!isLogin && (
                  <Form.Group className="mb-2">
                    <Form.Label style={{ fontSize: "0.85rem" }}>
                      Full Name
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      size="sm"
                    />
                  </Form.Group>
                )}

                <Form.Group className="mb-2">
                  <Form.Label style={{ fontSize: "0.85rem" }}>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    size="sm"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label style={{ fontSize: "0.85rem" }}>Password</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      size="sm"
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        border: "1px solid #ced4da",
                        backgroundColor: "white",
                        padding: "0 0.5rem",
                      }}
                    >
                      {showPassword ? <BsEyeSlash size={16} /> : <BsEye size={16} />}
                    </Button>
                  </InputGroup>
                </Form.Group>

                <motion.div whileHover={{ scale: 1.02 }}>
                  <Button
                    type="submit"
                    className="w-100 fw-bold"
                    style={{
                      backgroundColor: "#fb641b",
                      border: "none",
                      padding: "7px",
                      fontSize: "0.95rem",
                    }}
                  >
                    {isLogin ? "Login" : "Signup"}
                  </Button>
                </motion.div>

                <div className="text-center mt-2">
                  <Button
                    variant="link"
                    className="text-primary fw-semibold p-0"
                    onClick={() => setIsLogin(!isLogin)}
                    style={{ fontSize: "0.8rem" }}
                  >
                    {isLogin
                      ? "New to Vistra? Create an account"
                      : "Already have an account? Login"}
                  </Button>
                </div>

                <div className="text-center mt-1">
                  <Button variant="secondary" onClick={onClose} size="sm">
                    Close
                  </Button>
                </div>
              </Form>
            </motion.div>
          </Col>
        </Row>
      </Container>

      {/* Toast Notification */}
      <ToastContainer position="top-end" className="p-3" style={{ zIndex: 1080 }}>
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={2000}
          autohide
          bg={toastVariant}
          className="text-white"
        >
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </motion.div>
  );
}
