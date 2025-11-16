"use client";

import { useMemo, useState } from "react";
import {
    Badge,
    Card,
    Code,
    Group,
    ScrollArea,
    Select,
    Stack,
    Text,
    Button,
} from "@mantine/core";
import { useLogStore } from "@/stores/LogStore";
import type { LogLevelName } from "@/stores/LogStore";

const levelColors: Record<LogLevelName, string> = {
    trace: "gray",
    debug: "blue",
    info: "green",
    warn: "yellow",
    error: "red",
    fatal: "red",
};

export function WsDebugPanel() {
    const entries = useLogStore((s) => s.entries);
    const clearScope = useLogStore((s) => s.clearScope);

    const [filter, setFilter] = useState<LogLevelName | "all">("all");

    const wsEntries = useMemo(
        () =>
            entries.filter(
                (e) =>
                    e.scope === "ws" &&
                    (filter === "all" || e.level === filter)
            ),
        [entries, filter]
    );

    return (
        <Card shadow="sm" padding="md" radius="md" withBorder>
            <Group justify="space-between" mb="sm">
                <Text fw={500} size="sm">
                    WebSocket Activity
                </Text>

                <Group gap="xs">
                    <Select
                        size="xs"
                        w={120}
                        value={filter}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        onChange={(v) => setFilter((v as any) ?? "all")}
                        data={[
                            { value: "all", label: "All" },
                            { value: "trace", label: "Trace" },
                            { value: "debug", label: "Debug" },
                            { value: "info", label: "Info" },
                            { value: "warn", label: "Warn" },
                            { value: "error", label: "Error" },
                            { value: "fatal", label: "Fatal" },
                        ]}
                    />
                    <Button
                        variant="light"
                        size="xs"
                        color="red"
                        onClick={() => clearScope("ws")}
                    >
                        Clear
                    </Button>
                </Group>
            </Group>

            <ScrollArea h={260} scrollbarSize={6}>
                <Stack gap="xs">
                    {wsEntries.length === 0 ? (
                        <Text size="sm" c="dimmed">
                            No WebSocket log entries yet.
                        </Text>
                    ) : (
                        wsEntries.map((e) => (
                            <Card
                                key={e.id}
                                p="xs"
                                radius="sm"
                                withBorder
                            >
                                <Group justify="space-between" mb={4}>
                                    <Badge
                                        size="xs"
                                        color={levelColors[e.level]}
                                        variant="filled"
                                    >
                                        {e.level.toUpperCase()}
                                    </Badge>
                                    <Text size="xs" c="dimmed">
                                        {e.time}
                                    </Text>
                                </Group>

                                <Code block fz="xs">
                                    {e.msg}
                                    {e.data ? " " + JSON.stringify(e.data) : ""}
                                </Code>
                            </Card>
                        ))
                    )}
                </Stack>
            </ScrollArea>
        </Card>
    );
}
