import {
  Title,
  Divider,
  Group,
  Container,
  Button,
  Text,
  Select,
  Box,
  Grid,
  Image,
  Anchor,
  Center,
  List,
  Textarea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useAuth } from "../../components/AuthContext/useAuth";
import { RestrictRole } from "../../components/RestrictRole";
import { fetchHelper } from "../../utils/fetch";

export const Recipe = () => {
  const params = useParams();
  const nav = useNavigate();
  const { isAuthenticated, token } = useAuth();
  const [recipe, setRecipe] = useState<any>({});
  const form = useForm({
    initialValues: {
      text: "",
    },
  });

  const load = useCallback(async () => {
    const response: any = await fetchHelper(`/api/recipes/${params.id}`);

    console.log(response);
    setRecipe(response.data);
  }, [params.id]);

  useEffect(() => {
    if (!params.id) return;

    load();
  }, [load, params.id]);

  const addComment = async () => {
    await fetchHelper(`/api/recipes/${recipe.id}/comment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form.values),
    });

    form.reset();
    load();
  };

  const onRemove = async () => {
    await fetchHelper(`/api/recipes/${recipe.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    nav("/");
  };

  return (
    <div>
      <Container>
        <Title order={2}>{recipe.name}</Title>
        <Divider size="sm" my="lg" />
        <RestrictRole roles={["admin", "mod"]}>
          <Group direction="row" spacing="lg" my="lg" grow>
            <Button onClick={() => nav(`/recipe/${params.id}/edit`)}>
              Edit
            </Button>
            <Button onClick={onRemove} variant="outline">
              Remove
            </Button>
          </Group>
        </RestrictRole>
        <Group direction="column" spacing="lg" grow>
          <Center>
            <Box>
              <Image src={recipe.image} />
            </Box>
          </Center>

          <Title order={3}>Składniki</Title>

          <List>
            {recipe?.ingredients?.map((ingredient: any) => (
              <List.Item key={ingredient.name}>
                {ingredient.name} {ingredient.amount} {ingredient.unit}
              </List.Item>
            ))}
          </List>

          <Title order={3}>Przepis</Title>

          <Text sx={{ wordBreak: "break-all" }}>{recipe.description}</Text>

          <Title order={3}>Komentarze</Title>

          {recipe.comments?.map((comment: any) => (
            <Group
              px="md"
              py="md"
              key={comment.CommentId}
              direction="column"
              spacing="lg"
              sx={(theme) => ({
                background: theme.colors.dark[7],
                borderRadius: theme.radius.md,
              })}
            >
              <Group direction="row" position="apart">
                <Title order={6}>{comment.UserId}</Title>
                <Text>{new Date(comment.addedAt).toLocaleString()}</Text>
              </Group>
              <Text>{comment.text}</Text>
            </Group>
          ))}

          {isAuthenticated && (
            <>
              <Group direction="column" grow>
                <Textarea
                  name="text"
                  label="Dodaj komentarz"
                  placeholder="Komentarz"
                  {...form.getInputProps("text")}
                />
                <Button onClick={addComment}>Dodaj</Button>
              </Group>
            </>
          )}
        </Group>
      </Container>
    </div>
  );
};
