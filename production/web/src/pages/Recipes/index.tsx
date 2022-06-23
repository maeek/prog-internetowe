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
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchHelper } from "../../utils/fetch";
import { difficultyLevels, types } from "../AddRecipe";

export const Recipes = () => {
  const form = useForm({
    initialValues: {
      type: "",
      difficulty: "",
      author: "",
    },
  });
  const [recipes, setRecipes] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const response: any = await fetchHelper(`/api/recipes`);

      console.log(response);
      setRecipes(response.data.recipes);
    };

    load();
  }, []);

  const clearFilters = () => {
    form.reset();
  };

  const filterRecipe = (r: any) => {
    const { type, difficulty, author } = form.values;

    if (type && r.type !== type) {
      return false;
    }

    if (difficulty && r.difficulty !== difficulty) {
      return false;
    }

    if (author && r.author !== author) {
      return false;
    }

    return true;
  };

  return (
    <div>
      <Container>
        <Title order={2}>Lista przepisów</Title>
        <Divider size="sm" my="lg" />
        <Group>
          <Select
            label="Typ"
            name="type"
            data={types}
            {...form.getInputProps("type")}
          />

          <Select
            label="Trudność"
            name="difficulty"
            data={difficultyLevels}
            mx="sm"
            {...form.getInputProps("difficulty")}
          />

          <Select
            label="Autor"
            name="author"
            data={Array.from(new Set(recipes.map((recipe) => recipe.author)))}
            {...form.getInputProps("author")}
          />

          <Button
            variant="outline"
            sx={{ marginTop: "26px" }}
            onClick={clearFilters}
          >
            Wyczyść
          </Button>
        </Group>
        <Divider size="sm" my="lg" />
        <Grid>
          {recipes?.filter(filterRecipe).map((recipe) => (
            <Grid.Col span={4} key={recipe.id}>
              <Anchor component={Link} to={`/recipe/${recipe.id}`}>
                <Box key={recipe.id}>
                  <Image
                    sx={{ maxHeight: "200px", overflow: "hidden" }}
                    src={recipe.image}
                  />
                  <Title order={3}>{recipe.name}</Title>
                  <Text sx={{ wordBreak: "break-all" }}>
                    {(recipe.description as string).slice(0, 200)}...
                  </Text>
                </Box>
              </Anchor>
            </Grid.Col>
          ))}
        </Grid>
      </Container>
    </div>
  );
};
