import { useState } from "react";
import { SignUp } from "./SignUp";
import { Login } from "./Login";

export enum AuthForm {
  SIGNUP = "SIGNUP",
  LOGIN = "LOGIN",
}
const AuthComponent = () => {
  const [authForm, setAuthForm] = useState<AuthForm>(AuthForm.SIGNUP);
  const changeAuthForm = (form: AuthForm) => setAuthForm(form);
  const displayedAuthForm = {
    [AuthForm.SIGNUP]: <SignUp changeForm={changeAuthForm} />,
    [AuthForm.LOGIN]: <Login changeForm={changeAuthForm} />,
  };
  return displayedAuthForm[authForm];
};

export default AuthComponent;
