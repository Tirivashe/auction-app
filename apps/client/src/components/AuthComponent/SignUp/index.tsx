import {
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Button,
} from "@mantine/core";
import styles from "./Signup.module.css";
import { useForm, zodResolver } from "@mantine/form";
import { schema } from "./validationSchema";
import { AuthForm, Role, SignUpDto } from "../../../types";
import { useAuthStore } from "../../../store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { navigateUserOnAuth } from "../../../utils";
import { useSignUp } from "../../../hooks/useSignUp";
import { setAuthToken } from "../../../api/constants";

type SignUpFormValues = {
  username: string;
  email: string;
  password: string;
  admin: boolean;
};

type Props = {
  changeForm: (form: AuthForm) => void;
};

export function SignUp({ changeForm }: Props) {
  const setAuth = useAuthStore((state) => state.setAuthResponse);
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();
  const form = useForm<SignUpFormValues>({
    mode: "uncontrolled",
    initialValues: {
      username: "",
      email: "",
      password: "",
      admin: false,
    },
    validate: zodResolver(schema),
  });

  const { mutate, isPending, isError, error, data } = useSignUp();
  const handleSubmit = (values: SignUpFormValues) => {
    const body: SignUpDto = {
      ...values,
      role: values.admin ? Role.ADMIN : Role.REGULAR,
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
        Welcome to Auctioneer!
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Already have an account?{" "}
        <Anchor
          size="sm"
          component="button"
          onClick={() => changeForm(AuthForm.LOGIN)}
        >
          Log in here
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
          label="Username"
          placeholder="johndoe"
          required
          {...form.getInputProps("username")}
          error={form.errors.username}
        />
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
        <Checkbox
          label="Admin?"
          {...form.getInputProps("admin", { type: "checkbox" })}
          error={form.errors.role}
        />
        <Button
          fullWidth
          mt="xl"
          type="submit"
          loading={isPending}
          disabled={isPending}
        >
          Sign up
        </Button>
      </Paper>
    </Container>
  );
}
