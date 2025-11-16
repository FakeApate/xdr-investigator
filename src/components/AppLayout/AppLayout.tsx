'use client';
import React from "react"
import { AppShell } from "@mantine/core"
import { Navbar } from "@/components/Navbar/Navbar";
import { useLocalStorage, useMounted } from '@mantine/hooks';

export default function AppLayout({ children }: { children: React.ReactElement }) {
  const [navbarCollapsed, setNavbarCollapsed] = useLocalStorage<boolean>({ key: 'app-navbar-collapsed', defaultValue: false, getInitialValueInEffect: false });
  const toggle = () => setNavbarCollapsed((c) => !c);
  const mounted = useMounted();
  return (
    <AppShell
      navbar={{
        width: mounted ? navbarCollapsed ? "51px" : "200px" : "51px",
        breakpoint: 0,
      }}
      layout="alt"
      transitionDuration={200}
    >
      <AppShell.Navbar
        style={{
          transitionProperty: "width",
          transitionDuration: "var(--app-shell-transition-duration, 200ms)",
          transitionTimingFunction: "var(--app-shell-transition-timing-function, ease)",
        }}>
        <Navbar navbarCollapsed={navbarCollapsed} toggleNavbar={toggle} />
      </AppShell.Navbar>
      <AppShell.Main flex={1} display="flex">{children}</AppShell.Main>
    </AppShell>
  )
}
