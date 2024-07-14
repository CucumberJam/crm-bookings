import { useState } from "react";
import {useLogin} from "./hooks/useLogin.js";
import Button from "../../ui/Button.jsx";
import Form from "../../ui/Form.jsx";
import Input from "../../ui/Input";
import FormRowVertical from "../../ui/FormRowVertical.jsx";
import SpinnerMini from "../../ui/SpinnerMini.jsx";



function LoginForm() {
  const [email, setEmail] = useState("test@test.com");
  const [password, setPassword] = useState("test");
  const {isLoginLoading, login} = useLogin();

  async function handleSubmit(e) {
      e.preventDefault();
      if(!email || !password) return;
      login({email, password}, {
          onSettled: ()=> {
              setEmail("");
              setPassword("");
          }
      });
  }

  return (
    <Form onSubmit={handleSubmit}>
      <FormRowVertical label="Email address">
        <Input
          type="email"
          id="email"
          // This makes this widgets better for password managers
          autoComplete="username"
          value={email}
          disabled={isLoginLoading}
          onChange={(e) => setEmail(e.target.value)}/>
      </FormRowVertical>
      <FormRowVertical label="Password">
        <Input
          type="password"
          id="password"
          autoComplete="current-password"
          disabled={isLoginLoading}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </FormRowVertical>
      <FormRowVertical>
        <Button size="large">
            {isLoginLoading ? <SpinnerMini/> : 'Login'}
        </Button>
      </FormRowVertical>
    </Form>
  );
}

export default LoginForm;
