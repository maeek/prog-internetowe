import {
  Title,
  Divider,
  Group,
  TextInput,
  Container,
  Button,
  Text,
  Textarea,
  NumberInput,
  Select,
  ActionIcon,
  Box,
  Center,
} from "@mantine/core";
import { formList, useForm } from "@mantine/form";
import { randomId } from "@mantine/hooks";
import { useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { Trash } from "tabler-icons-react";
import { useAuth } from "../../components/AuthContext/useAuth";
import { RestrictRole } from "../../components/RestrictRole";
import { fetchHelper } from "../../utils/fetch";
import { toBase64 } from "../../utils/fileToBase64";
import { difficultyLevels, types } from "../AddRecipe";

export const EditRecipe = () => {
  const params = useParams();
  const { token } = useAuth();
  const nav = useNavigate();
  const form = useForm({
    initialValues: {
      name: "",
      description: "",
      preparationTime: 1,
      ingredients: formList([
        {
          name: "",
          amount: 1,
          unit: "szt",
          key: randomId(),
        },
      ]),
      type: "",
      difficulty: "",
    },
  });

  const load = useCallback(async () => {
    const response: any = await fetchHelper(`/api/recipes/${params.id}`);

    console.log(response);
    form.setValues({
      name: response.data.name,
      description: response.data.description,
      preparationTime: response.data.preparationTime,
      ingredients: formList(response.data.ingredients.map((ingredient: any) => ({
        name: ingredient.name,
        amount: ingredient.amount,
        unit: ingredient.unit,
        key: randomId(),
      }))),
      type: response.data.type,
      difficulty: response.data.difficulty,
    });
  }, [params.id]);

  useEffect(() => {
    if (!params.id) return;

    load();
  }, [load, params.id]);

  const handleNewRecipe = async (values: any) => {
    const response = await fetchHelper(`/api/recipes/${params.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: values.name,
        description: values.description,
        preparationTime: values.preparationTime,
        ingredients: values.ingredients.map((ingredient: any) => ({
          name: ingredient.name,
          amount: ingredient.amount,
          unit: ingredient.unit,
        })),
        type: values.type,
        difficulty: values.difficulty,
      }),
    });

    console.log(response);
    nav("/");
  };

  const addIngredient = () => {
    form.addListItem("ingredients", {
      name: "",
      amount: 1,
      unit: "szt",
    } as never);

    console.log(form);
  };

  const fields = form.values.ingredients.map((item, index: number) => (
    <Group key={item.key} mt="xs">
      <Center mx="sm">
        <TextInput
          label="Nazwa"
          required
          mx="sm"
          {...form.getListInputProps("ingredients", index, "name" as never)}
        />

        <NumberInput
          label="Ilość"
          required
          step={0.001}
          min={0.001}
          precision={3}
          mx="sm"
          {...form.getListInputProps("ingredients", index, "amount" as never)}
        />

        <Select
          label="Jednostka"
          required
          mx="sm"
          data={[
            { value: "szt", label: "szt" },
            { value: "g", label: "g" },
            { value: "kg", label: "kg" },
            { value: "l", label: "l" },
            { value: "ml", label: "ml" },
          ]}
          {...form.getListInputProps("ingredients", index, "unit" as never)}
        />
        <ActionIcon
          color="red"
          variant="hover"
          mx="sm"
          onClick={() => form.removeListItem("ingredients", index)}
        >
          <Trash size={16} />
        </ActionIcon>
      </Center>
    </Group>
  ));

  return (
    <RestrictRole roles={["admin", "mod"]} redirect>
      <Container>
        <Title order={2}>Dodaj przepis</Title>
        <Divider size="sm" my="lg" />
        <form onSubmit={form.onSubmit(handleNewRecipe)}>
          <Group direction="column" spacing="lg" grow>
            <TextInput label="Tytuł" readOnly required {...form.getInputProps("name")} />

            <Textarea
              label="Opis"
              required
              autosize
              minRows={2}
              maxRows={20}
              {...form.getInputProps("description")}
            />

            <NumberInput
              label="Opis"
              description="Czas przygotowania w godzinach"
              required
              step={0.5}
              min={0.5}
              precision={1}
              {...form.getInputProps("preparationTime")}
            />

            <Box mx="auto">
              {fields.length === 0 && (
                <Text color="dimmed" align="center">
                  Brak dodanych składników
                </Text>
              )}
              <Group mb="xs">{fields}</Group>
            </Box>

            <Button
              variant="gradient"
              gradient={{ from: "indigo", to: "cyan" }}
              type="button"
              onClick={addIngredient}
            >
              Dodaj składnik
            </Button>

            <Select
              label="Wybierz typ dania"
              placeholder="Wybierz jedno"
              data={types}
              {...form.getInputProps("type")}
            />

            <Select
              label="Wybierz trudność"
              placeholder="Wybierz jedno"
              data={difficultyLevels}
              {...form.getInputProps("difficulty")}
            />
          </Group>
          <Group position="right" my={50}>
            <Button
              variant="gradient"
              gradient={{ from: "indigo", to: "cyan" }}
              type="submit"
            >
              Zaktualizuj
            </Button>
          </Group>
        </form>
      </Container>
    </RestrictRole>
  );
};
