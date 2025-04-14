import { useContext } from "react";
import { Alert, Button, Form, Row, Col, Stack } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import "./login.css";


const Login = () => {

    const {
        loginUser,
        loginInfo,
        loginError,
        updateLoginInfo,
        isLoginLoading } = useContext(AuthContext);

    return <>
        <Form onSubmit={loginUser}>
            <Row className="login-container">
                <Col xs={10} md={6} lg={4} className="login-card">
                    <Stack gap={3}>
                        <h2 className="text-center mb-4">Login</h2>

                        <Form.Control type="email"
                            placeholder="Email"
                            onChange={(e) =>
                                updateLoginInfo({ ...loginInfo, email: e.target.value })
                            } className="login-input" />

                        <Form.Control type="password"
                            placeholder="Password"
                            onChange={(e) =>
                                updateLoginInfo({ ...loginInfo, password: e.target.value })
                            } className="login-input" />

                        <Button variant="primary" type="submit" className="login-button">
                            {isLoginLoading ? "Getting you in..." : "Login"}
                        </Button>

                        {loginError?.error && (
                            <Alert variant="danger">
                                <p>{loginError?.message}</p>
                            </Alert>)}

                    </Stack>
                </Col>
            </Row>
        </Form>
    </>;
};

export default Login;