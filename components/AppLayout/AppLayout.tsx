'use client';
import React from "react"
import { AppShell } from "@mantine/core"
import { Navbar } from "../Navbar/Navbar";
import { useDisclosure } from "@mantine/hooks";
import classes from './AppLayout.module.css';

export default function AppLayout({ children }: { children: React.ReactElement }) {
    const [navbarCollapsed, { toggle }] = useDisclosure(false);
    return (
        <AppShell
            navbar={{ width: "300px", breakpoint: "sm", collapsed: { mobile: navbarCollapsed, desktop: navbarCollapsed } }}
            layout="alt"
            className={navbarCollapsed ? classes.AppLayoutNavbar : ''}
            transitionDuration={80}
        >
            <AppShell.Navbar className={navbarCollapsed ? classes.AppLayoutNavbarCollapsed : ''}>
                <Navbar navbarCollapsed={navbarCollapsed} toggleNavbar={toggle} />
            </AppShell.Navbar>
            <AppShell.Main >{children}</AppShell.Main>
        </AppShell>
    )
}