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
} from '@tabler/icons-react';
import { Group, NavLink, Space } from '@mantine/core';
import classes from './Navbar.module.css';
import NavbarToggle from '../NavbarToggle/NavbarToggle';

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
    <NavLink
      data-active={item.label === active || undefined}
      key={item.label}
      onClick={(event) => {
        event.preventDefault();
        setActive(item.label);
      }}
      href={item.link}
      label={item.label}
      leftSection={<item.icon size={25} stroke={1.5} />}
      noWrap={true}
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
          onClick={(event) => event.preventDefault()}
          href="#"
          leftSection={<IconSwitchHorizontal size={24} stroke={1.5} />}
          label="Change account"
          noWrap={true} />

        <NavLink
          onClick={(event) => event.preventDefault()}
          href="#"
          leftSection={<IconLogout size={24} stroke={1.5} />}
          label="Logout"
          noWrap={true}
        />
      </div>
    </nav >
  );
}
