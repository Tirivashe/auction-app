import { useState } from "react";
import { SignUp } from "./SignUp";
import { Login } from "./Login";
import { AuthForm } from "../../types";

const AuthComponent = () => {
  const [authForm, setAuthForm] = useState<AuthForm>(AuthForm.LOGIN);
  const changeAuthForm = (form: AuthForm) => setAuthForm(form);
  const displayedAuthForm = {
    [AuthForm.SIGNUP]: <SignUp changeForm={changeAuthForm} />,
    [AuthForm.LOGIN]: <Login changeForm={changeAuthForm} />,
  };
  return displayedAuthForm[authForm];
};

export default AuthComponent;
