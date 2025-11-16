"use client";

import {
  Badge,
  Button,
  Card,
  Code,
  Collapse,
  Container,
  Divider,
  Fieldset,
  Grid,
  Group,
  Loader,
  ScrollArea,
  Stack,
  Switch,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import NetworkStatus from "../../components/NetworkStatus/NetworkStatus";
import useStore from "@/useStore";
import { useSettingsStore } from "@/stores/SettingsStore";
import { usePekko } from "@/hooks/usePekko";
import { useIntrospection } from "@/hooks/useIntrospection";
import { WsDebugPanel } from "@/components/WsDebugPanel/WsDebugPanel";

export default function SettingsPage() {
  const settings = useStore(useSettingsStore, (state) => state);
  const { status, attempt, delayMs, lastMessage } = usePekko();
  const { commands, loading, error } = useIntrospection();
  const [debugOpened, { toggle: toggleDebug }] = useDisclosure(false);

  const statusColor: Record<string, string> = {
    idle: "gray",
    online: "green",
    reconnecting: "yellow",
    closed: "red",
  };

  return (
    <Container size="xl" py="md">
      <Stack gap="lg">
        <Group justify="space-between">
          <div>
            <Title order={2}>Settings</Title>
            <Text size="sm" c="dimmed">
              Configure your Pekko connection and inspect WebSocket activity.
            </Text>
          </div>
        </Group>

        {/* Main content grid: responsive via Grid + breakpoints */}
        <Grid gutter="lg">
          {/* Left column: connection settings */}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Fieldset
              legend="Connection Settings"
              radius="md"
              p="md"
            >
              <Text size="sm" mb="xs" c="dimmed">
                Configure how the frontend reaches your Pekko server.
              </Text>

              <Stack gap="sm">
                <TextInput
                  label="Pekko Server IP"
                  size="sm"
                  value={settings?.pekkoIp || ""}
                  onChange={(event) => {
                    if (settings)
                      settings.setServerIp(event.currentTarget.value);
                  }}
                />

                <TextInput
                  label="Pekko Server Port"
                  size="sm"
                  value={settings?.pekkoPort || ""}
                  onChange={(event) => {
                    if (settings)
                      settings.setServerPort(event.currentTarget.value);
                  }}
                />

                <Group gap="md" mt="xs">
                  <Switch
                    label="Use WSS (secure WebSocket)"
                    size="sm"
                    checked={settings?.pekkoWss || false}
                    onChange={(event) => {
                      if (settings)
                        settings.setWssState(event.currentTarget.checked);
                    }}
                  />
                  <Switch
                    label="Auto reconnect"
                    size="sm"
                    checked={settings?.pekkoAutoReconnect || false}
                    onChange={(event) => {
                      if (settings)
                        settings.setAutoReconnect(event.currentTarget.checked);
                    }}
                  />
                </Group>
              </Stack>
            </Fieldset>
            <Fieldset
              legend="Network Status"
              radius="md"
              p="md"
              mt="md"
            >
              <NetworkStatus />
            </Fieldset>
          </Grid.Col>

          {/* Right column: connection info + commands */}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Stack gap="md">
              <Fieldset
                legend="Connection Info"
                radius="md"
                p="md"
              >
                <Group align="center" justify="space-between" mb="xs">
                  <Text size="sm" fw={500}>
                    WebSocket Status
                  </Text>
                  <Badge
                    size="sm"
                    color={statusColor[status] ?? "gray"}
                    variant="filled"
                  >
                    {status.toUpperCase()}
                  </Badge>
                </Group>

                {status === "reconnecting" && (
                  <Group gap="xl" mb="sm">
                    <Text size="xs" c="dimmed">
                      Attempt: <Text span fw={500}>{attempt}</Text>
                    </Text>
                    <Text size="xs" c="dimmed">
                      Delay: <Text span fw={500}>{delayMs} ms</Text>
                    </Text>
                  </Group>
                )}

                <Divider my="sm" />

                <Text size="sm" fw={500} mb={4}>
                  Last message
                </Text>

                <ScrollArea h={200} type="always" offsetScrollbars>
                  <Code block fz="xs">
                    {lastMessage
                      ? JSON.stringify(lastMessage, null, 2)
                      : "// No message received yet"}
                  </Code>
                </ScrollArea>
              </Fieldset>

              <Fieldset
                legend="Available Commands"
                radius="md"
                p="md"
              >
                <Group justify="space-between" mb="xs">
                  <Text size="sm" fw={500}>
                    Pekko Commands
                  </Text>
                  {loading && <Loader size="xs" />}
                </Group>

                {error && (
                  <Text size="sm" c="red" mb="xs">
                    Error loading commands: {error}
                  </Text>
                )}

                {!loading && !error && (
                  <Stack gap={4}>
                    {commands.map((cmd) => (
                      <Code key={cmd.type} block fz="xs">
                        {cmd.type}
                        {"("}
                        {cmd._types
                          ? Object.entries(cmd._types)
                            .map(([key, value]) => `${key}: ${value}`)
                            .join(", ")
                          : ""}
                        {")"}
                      </Code>
                    ))}
                    {commands.length === 0 && (
                      <Text size="sm" c="dimmed">
                        No commands returned from introspection.
                      </Text>
                    )}
                  </Stack>
                )}
              </Fieldset>
            </Stack>
          </Grid.Col>
        </Grid>

        {/* Collapsible WS debug panel */}
        <Card withBorder radius="md" p="md">
          <Group justify="space-between" mb="sm">
            <Text fw={500}>WebSocket Debug</Text>
            <Button
              variant="subtle"
              size="xs"
              onClick={toggleDebug}
            >
              {debugOpened ? "Hide debug panel" : "Show debug panel"}
            </Button>
          </Group>

          <Collapse in={debugOpened}>
            <WsDebugPanel />
          </Collapse>
        </Card>
      </Stack>
    </Container>
  );
}
