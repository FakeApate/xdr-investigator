import { ActionIcon } from "@mantine/core";
import { IconLayoutSidebarLeftCollapse, IconLayoutSidebarLeftExpand } from "@tabler/icons-react";

export default function NavbarToggle({ navbarCollapsed, toggleEvent }: { navbarCollapsed: boolean, toggleEvent: () => void }) {
    const label = navbarCollapsed ? "Expand navbar" : "Collapse navbar";
    const Icon = navbarCollapsed ? IconLayoutSidebarLeftExpand : IconLayoutSidebarLeftCollapse;
    return (
        <ActionIcon variant="transparent" color="dark" size="xl" aria-label={label} onClick={toggleEvent}>
            <Icon style={{ width: '70%', height: '70%' }} stroke={1.5} />
        </ActionIcon>
    )
}