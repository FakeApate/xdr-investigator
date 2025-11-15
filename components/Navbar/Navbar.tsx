import { useEffect, useState } from 'react';
import {
  IconLogout,
  IconSwitchHorizontal,
  IconMoon,
  IconSun
} from '@tabler/icons-react';
import { Group, NavLink, Space, useMantineTheme } from '@mantine/core';
import classes from './Navbar.module.css';
import NavbarToggle from '../NavbarToggle/NavbarToggle';
import { pages } from '../../pages';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useLocalStorage } from '@mantine/hooks';
export function Navbar({ navbarCollapsed, toggleNavbar }: { navbarCollapsed: boolean, toggleNavbar: () => void }) {
  const pathname = usePathname();

  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>({ key: 'color-scheme', defaultValue: 'light' });
  const links = pages.map((item) => (
    <NavLink
      data-active={item.link === pathname || undefined}
      key={item.label}
      href={item.link}
      label={item.label}
      leftSection={<item.icon size={25} stroke={1.5} />}
      noWrap={true}
      component={Link}
    />

  ));

  return (
    <nav className={classes.navbar}
      data-collapsed={navbarCollapsed || undefined}
    >
      <div className={classes.header}>
        <div style={{
          display: "flex",
          justifyContent: "space-between", /* pushes them to opposite sides */
          alignItems: "center",

        }}>
          <div style={{
            height: navbarCollapsed ? '0px' : 'fit-content',
            width: navbarCollapsed ? '0px' : 'fit-content',
            overflow: 'hidden',
            marginLeft: navbarCollapsed ? '0px' : '12px',
            transition: 'margin-left var(--app-shell-transition-duration) ease',
            textWrap: 'nowrap',
          }}>
            <span style={{
              fontWeight: 'bold',
              fontSize: '1.2em',
              opacity: navbarCollapsed ? 0 : 1,
              transition: 'opacity calc(var(--app-shell-transition-duration)/2) ease-in-out calc(var(--app-shell-transition-duration)/2)',

            }}>
              Lorem Ipsum
            </span>
          </div>
          <div style={{}}>
            <NavbarToggle navbarCollapsed={navbarCollapsed} toggleEvent={toggleNavbar} />
          </div>
          {navbarCollapsed && <Space w={1} />}
        </div>
      </div>
      <div style={{ flex: 1 }}>

        {links}
      </div >


      <div className={classes.footer}>
        <NavLink
          onClick={(event) => {
            event.preventDefault();
            const theme = document.documentElement.getAttribute('data-mantine-color-scheme');
            setTheme(theme === 'dark' ? 'light' : 'dark');
            if (theme === 'dark') {
              document.documentElement.setAttribute('data-mantine-color-scheme', 'light');
            } else {
              document.documentElement.setAttribute('data-mantine-color-scheme', 'dark');
            }
          }}
          href="#"
          leftSection={theme === 'dark' ? <IconSun size={24} stroke={1.5} /> : <IconMoon size={24} stroke={1.5} />}
          label="Toggle theme"
          noWrap={true} />
        <NavLink
          onClick={(event) => event.preventDefault()}
          href="#"
          leftSection={<IconSwitchHorizontal size={24} stroke={1.5} />}
          label="Change account"
          disabled={true}
          noWrap={true} />

        <NavLink
          onClick={(event) => event.preventDefault()}
          href="#"
          leftSection={<IconLogout size={24} stroke={1.5} />}
          label="Logout"
          disabled={true}
          noWrap={true}
        />
      </div>
    </nav >
  );
}
