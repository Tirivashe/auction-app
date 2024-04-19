import {
  TextInput,
  PasswordInput,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Button,
} from "@mantine/core";
import styles from "./Login.module.css";
import { useForm, zodResolver } from "@mantine/form";
import { schema } from "./validationSchema";
import { AuthForm, LoginDto } from "../../../types";
import { useEffect } from "react";
import { useAuthStore } from "../../../store";
import { useNavigate } from "react-router-dom";
import { navigateUserOnAuth } from "../../../utils";
import { useLogin } from "../../../hooks/useLogin";
import { setAuthToken } from "../../../api/constants";

type LoginFormValues = {
  email: string;
  password: string;
};

type Props = {
  changeForm: (form: AuthForm) => void;
};

export function Login({ changeForm }: Props) {
  const setAuth = useAuthStore((state) => state.setAuthResponse);
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();
  const form = useForm<LoginFormValues>({
    mode: "uncontrolled",
    initialValues: {
      email: "",
      password: "",
    },
    validate: zodResolver(schema),
  });

  const { mutate, isPending, isError, error, data } = useLogin();

  const handleSubmit = (values: LoginFormValues) => {
    const body: LoginDto = {
      ...values,
    };
    mutate(body);
  };

  useEffect(() => {
    if (isError) {
      form.setErrors({ password: error.message });
    }
    if (typeof data === "object" && "error" in data) {
      form.setErrors({ password: data.message });
    }

    if (typeof data === "object" && "token" in data) {
      setAuth(data);
    }
  }, [error?.message, isError, form, data, setAuth]);

  useEffect(() => {
    if (token === null || user === null) {
      return;
    }
    setAuthToken(token);
    navigateUserOnAuth(user, navigate);
  }, [user, navigate, token]);

  return (
    <Container size={520} w="100%">
      <Title ta="center" className={styles.title}>
        Welcome Back!
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Do you not have an account?{" "}
        <Anchor
          size="sm"
          component="button"
          onClick={() => changeForm(AuthForm.SIGNUP)}
        >
          Create Account
        </Anchor>
      </Text>

      <Paper
        withBorder
        shadow="md"
        p={30}
        mt={30}
        radius="md"
        component="form"
        className={styles.form}
        onSubmit={form.onSubmit(handleSubmit)}
      >
        <TextInput
          label="Email"
          placeholder="you@example.com"
          required
          {...form.getInputProps("email")}
          error={form.errors.email}
        />
        <PasswordInput
          label="Password"
          placeholder="Your password"
          required
          {...form.getInputProps("password")}
          error={form.errors.password}
        />
        <Button
          fullWidth
          mt="xl"
          type="submit"
          loading={isPending}
          disabled={isPending}
        >
          Log in
        </Button>
      </Paper>
    </Container>
  );
}
