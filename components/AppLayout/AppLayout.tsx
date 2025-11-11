'use client';
import React from "react"
import { AppShell } from "@mantine/core"
import { Navbar } from "../Navbar/Navbar";
import { useDisclosure } from "@mantine/hooks";

export default function AppLayout({ children }: { children: React.ReactElement }) {
  const [navbarCollapsed, { toggle }] = useDisclosure(false);

  return (
    <AppShell
      navbar={{
        width: navbarCollapsed ? "80px" : "300px",
        breakpoint: 0,
      }}
      layout="alt"
    >
      <AppShell.Navbar
        style={{
          transitionProperty: "width",
          transitionDuration: "var(--app-shell-transition-duration, 200ms)",
          transitionTimingFunction: "var(--app-shell-transition-timing-function, ease)",
        }}>
        <Navbar navbarCollapsed={navbarCollapsed} toggleNavbar={toggle} />
      </AppShell.Navbar>
      <AppShell.Main >{children}</AppShell.Main>
    </AppShell>
  )
}
