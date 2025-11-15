import { useEffect, useState } from 'react';
import {
  IconLogout,
  IconSwitchHorizontal,
  IconMoon,
  IconSun,
  IconCircleHalf,
  IconLoader2
} from '@tabler/icons-react';
import { ActionIcon, Group, NavLink, Space, useComputedColorScheme, useMantineColorScheme, useMantineTheme } from '@mantine/core';
import classes from './Navbar.module.css';
import NavbarToggle from '../NavbarToggle/NavbarToggle';
import { pages } from '../../pages';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useLocalStorage } from '@mantine/hooks';




export function Navbar({ navbarCollapsed, toggleNavbar }: { navbarCollapsed: boolean, toggleNavbar: () => void }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

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

  function ColorSchemeToggle() {
    const { setColorScheme } = useMantineColorScheme();
    const computedColorScheme = useComputedColorScheme('light', {
      getInitialValueInEffect: true,
    });

    const toggle = () => {
      setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light');
    };

    return (
      <NavLink aria-label="Toggle color scheme" leftSection={mounted ? computedColorScheme === 'light' ? <IconMoon /> : <IconSun /> : <IconLoader2 className="animate-spin" />} label="Toggle colors" noWrap={true} href="#" onClick={(e) => {
        e.preventDefault();
        toggle();
      }}>
      </NavLink>
    );
  }


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

        <ColorSchemeToggle />
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
