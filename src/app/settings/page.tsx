"use client";

import {
  Button,
  Card,
  Collapse,
  Container,
  Fieldset,
  Grid,
  Group,
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
import { WsDebugPanel } from "@/components/WsDebugPanel/WsDebugPanel";
import AvailableCommands from "@/components/AvailableCommands/AvailableCommands";

export default function SettingsPage() {
  const settings = useStore(useSettingsStore, (state) => state);
  const [debugOpened, { toggle: toggleDebug }] = useDisclosure(false);

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

        <Grid gutter="lg">

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
                legend="Available Commands"
                radius="md"
                p="md"
              >
                <AvailableCommands />
              </Fieldset>
            </Stack>
          </Grid.Col>
        </Grid>

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
