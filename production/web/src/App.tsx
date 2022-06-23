import {
  AppShell,
  Burger,
  Header,
  MediaQuery,
  useMantineTheme,
  Text,
} from '@mantine/core';
import { useState } from 'react';
import Navbar from './components/navbar/navbar';
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { Login } from './pages/Login';
import './App.scss';
import { AuthProvider } from './components/AuthContext';
import { Logout } from './pages/Logout';
import { AddRecipe } from './pages/AddRecipe';
import { Recipes } from './pages/Recipes';
import { Recipe } from './pages/Recipe';
import { EditRecipe } from './pages/EditRecipe';

const App = () => {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);

  const header = (
    <Header height={70} p="md">
      <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
          <Burger
            opened={opened}
            onClick={() => setOpened((o) => !o)}
            size="sm"
            color={theme.colors.gray[6]}
            mr="xl"
          />
        </MediaQuery>

        <Text>Katalog przepisów kulinarnych</Text>
      </div>
    </Header>
  );

  return (
    <AuthProvider>
      <HashRouter>
        <AppShell
          padding='md'
          fixed
          navbarOffsetBreakpoint="sm"
          asideOffsetBreakpoint="sm"
          navbar={<Navbar opened={opened} />}
          header={header}
          styles={{
            main: {
              background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
            },
          }}
        >
            <Routes>
              <Route path="/" element={<Recipes />} />
              <Route path="/recipe/:id" element={<Recipe />} />
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/logout" element={<Logout />} />
              <Route path="/recipes/add" element={<AddRecipe />} />
              <Route path="/recipe/:id/edit" element={<EditRecipe />} />
            </Routes>
        </AppShell>
      </HashRouter>
    </AuthProvider>
  );
}

export default App;
