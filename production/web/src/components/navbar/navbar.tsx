import {
  Navbar as NavbarMantine,
  Text,
  Group,
  ThemeIcon,
  UnstyledButton,
  Anchor
} from '@mantine/core';
import { Link } from 'react-router-dom'
import { Receipt, Login, Logout, ListDetails } from 'tabler-icons-react';
import { useAuth } from '../AuthContext/useAuth';

const Navbar = ({ opened }: { opened?: boolean }) => {
  const { isAuthenticated } = useAuth();

  const items = [
    { path: '/', icon: <ListDetails size={16} />, color: 'teal', label: 'Katalog Przepisów' },
    { path: '/recipes/add', icon: <Receipt size={16} />, color: 'green', label: 'Dodaj Przepis', disabled: !isAuthenticated },
    { path: '/auth/login', icon: <Login size={16} />, color: 'blue', label: 'Zaloguj się', disabled: isAuthenticated },
    { path: '/auth/logout', icon: <Logout size={16} />, color: 'blue', label: 'Wyloguj się', disabled: !isAuthenticated },
  ];

  return (
    <NavbarMantine p="md" hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 200, lg: 300 }}>
      {
        items.filter(i => !i.disabled).map(({ label, icon, color, path }) => (
          <NavbarMantine.Section key={path}>
            <Anchor component={Link} to={path}>
              <UnstyledButton
                sx={(theme) => ({
                  display: 'block',
                  width: '100%',
                  padding: theme.spacing.xs,
                  borderRadius: theme.radius.sm,
                  color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

                  '&:hover': {
                    backgroundColor:
                      theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
                  },
                })}
              >
                <Group>
                  <ThemeIcon color={color} variant="light">
                    {icon}
                  </ThemeIcon>

                  <Text size="sm">{label}</Text>
                </Group>
              </UnstyledButton>
            </Anchor>
          </NavbarMantine.Section>
        ))
      }
    </NavbarMantine>
  );
}

export default Navbar;
