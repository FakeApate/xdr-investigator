"use client";
import { Container, Divider, Fieldset, Stack, Switch, TextInput } from "@mantine/core";
import NetworkStatus from "../../components/NetworkStatus/NetworkStatus";
import { useLocalStorage } from "@mantine/hooks";
export default function SettingsPage() {
  const [wssState, setWssState] = useLocalStorage({
    key: 'settings-pekko-wss',
    defaultValue: false
  });

  const [autoReconnect, setAutoReconnect] = useLocalStorage({
    key: 'settings-pekko-auto-reconnect',
    defaultValue: false
  });

  const [serverIp, setServerIp] = useLocalStorage({
    key: 'settings-pekko-ip',
    defaultValue: "127.0.0.1"
  });

  const [serverPort, setServerPort] = useLocalStorage({
    key: 'settings-pekko-port',
    defaultValue: "8080"
  });
  return (
    <Container>
      <Stack mt="md">
        <Fieldset legend="Connection Settings" mt="md" style={{
          padding: 20,
        }}>
          <TextInput
            label="Pekko Server IP"
            value={serverIp}
            onChange={(event) => setServerIp(event.currentTarget.value)}
          />
          <TextInput
            label="Pekko Server Port"
            value={serverPort}
            onChange={(event) => setServerPort(event.currentTarget.value)}
            mt="md"
          />
          <Switch
            label="WSS"
            checked={wssState}
            onChange={(event) => setWssState(event.currentTarget.checked)}
            mt="md"
          />
          <Switch
            label="Auto Reconnect"
            checked={autoReconnect}
            onChange={(event) => setAutoReconnect(event.currentTarget.checked)}
            mt="md"
          />
          <Divider mt="lg" mb="md" size={"sm"} />
          <NetworkStatus />
        </Fieldset>
      </Stack>

    </Container>
  );
}
