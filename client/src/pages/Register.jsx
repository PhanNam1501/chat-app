import { useContext } from "react";
import { Alert, Button, Form, Row, Col, Stack } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import "./login.css";

const Register = () => {

    const { registerInfo, updateRegisterInfo, registerUser, registerError, isRegisterLoading } = useContext(AuthContext);
    return <>
        <Form onSubmit={registerUser}>
            <Row className="login-container">
                <Col xs={10} md={6} lg={4} className="login-card">
                    <Stack gap={3}>
                        <h2 className="text-center mb-4">Register</h2>

                        <Form.Control
                            type="text"
                            placeholder="Name"
                            onChange={(e) =>
                                updateRegisterInfo({ ...registerInfo, name: e.target.value })
                            } className="login-input"
                        />
                        <Form.Control
                            type="email"
                            placeholder="Email"
                            onChange={(e) =>
                                updateRegisterInfo({ ...registerInfo, email: e.target.value })
                            } className="login-input"
                        />
                        <Form.Control
                            type="password"
                            placeholder="Password"
                            onChange={(e) =>
                                updateRegisterInfo({ ...registerInfo, password: e.target.value })
                            } className="login-input"
                        />
                        <Button variant="primary" type="submit" className="login-button">
                            {isRegisterLoading ? "Creating your account" : " Register"}
                        </Button>
                            {
                                registerError?.error && (
                                <Alert variant="danger">
                                    <p>{registerError?.message}</p>
                                </Alert>
                            )}
                    </Stack>
                </Col>
            </Row>
        </Form>
    </>;
};

export default Register;