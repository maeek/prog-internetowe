import { Title, Divider, Group, TextInput, Container, Button } from "@mantine/core";
import { useForm } from '@mantine/form';
import { Navigate } from "react-router-dom";
import { useAuth } from "../../components/AuthContext/useAuth";

export const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const form = useForm({
    initialValues: {
      username: '',
      password: ''
    }
  });

  const handleLogin = (values: any) => {
    login(values.username, values.password);
  };

  if (isAuthenticated) {
    return (
      <Navigate to="/" replace />
    );
  }

  return (
    <div>
      <Container>
      <Title order={2}>Login</Title>
      <Divider size="sm" my='lg' />
          <form onSubmit={form.onSubmit(handleLogin)}>

              <Group direction="column" spacing='lg' grow>
                <TextInput
                  label="Nazwa użytkownika"
                  required
                  {...form.getInputProps('username')}
                />

                <TextInput
                  label="Hasło"
                  required
                  type="password"
                  {...form.getInputProps('password')}
                />
        
              </Group>
              <Group position="right" my={50}>
                <Button variant="gradient" gradient={{ from: 'indigo', to: 'cyan' }} type="submit">
                  Zaloguj się
                </Button>
              </Group>
          </form>
      </Container>
    </div>
  );
}