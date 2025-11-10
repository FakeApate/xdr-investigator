import { useState } from 'react';
import {
  Icon2fa,
  IconBellRinging,
  IconDatabaseImport,
  IconFingerprint,
  IconKey,
  IconLogout,
  IconReceipt2,
  IconSettings,
  IconSwitchHorizontal,
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarLeftExpandFilled
} from '@tabler/icons-react';
import { Code, Group, Text, ActionIcon } from '@mantine/core';
import classes from './Navbar.module.css';
import NavbarToggle from '../NavbarToggle/NavbarToggle';
import { useDisclosure } from '@mantine/hooks';

const data = [
  { link: '', label: 'Notifications', icon: IconBellRinging },
  { link: '', label: 'Billing', icon: IconReceipt2 },
  { link: '', label: 'Security', icon: IconFingerprint },
  { link: '', label: 'SSH Keys', icon: IconKey },
  { link: '', label: 'Databases', icon: IconDatabaseImport },
  { link: '', label: 'Authentication', icon: Icon2fa },
  { link: '', label: 'Other Settings', icon: IconSettings },
];

export function Navbar({ navbarCollapsed, toggleNavbar }: { navbarCollapsed: boolean, toggleNavbar: () => void }) {
  const [active, setActive] = useState('Billing');
  const links = data.map((item) => (
    <a
      className={classes.link}
      data-active={item.label === active || undefined}
      href={item.link}
      key={item.label}
      onClick={(event) => {
        event.preventDefault();
        setActive(item.label);
      }}
    >
      <item.icon className={classes.linkIcon + (navbarCollapsed ? ` ${classes.linkIconCollapsed}` : '')} stroke={1.5} />
      {!navbarCollapsed && <span>{item.label}</span>}
    </a>
  ));

  return (
    <nav className={classes.navbar + (navbarCollapsed ? ` ${classes.navbarCollapsed}` : '')}>
      <div className={classes.navbarMain}>
        <Group className={classes.header} justify="space-between">
          {!navbarCollapsed && <Text>App Name</Text>}
          <NavbarToggle navbarCollapsed={navbarCollapsed} toggleEvent={toggleNavbar} />
        </Group>
        {links}
      </div>

      <div className={classes.footer}>
        <a href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
          <IconSwitchHorizontal className={classes.linkIcon + (navbarCollapsed ? ` ${classes.linkIconCollapsed}` : '')} stroke={1.5} />
          {!navbarCollapsed && <span>Change account</span>}
        </a>

        <a href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
          <IconLogout className={classes.linkIcon + (navbarCollapsed ? ` ${classes.linkIconCollapsed}` : '')} stroke={1.5} />
          {!navbarCollapsed && <span>Logout</span>}
        </a>
      </div>
    </nav>
  );
}