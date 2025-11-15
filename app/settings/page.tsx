import { Container, Fieldset, Stack, Switch, TextInput } from "@mantine/core";
import NetworkStatus from "../../components/NetworkStatus/NetworkStatus";
import { useLocalStorage } from "@mantine/hooks";
export default function SettingsPage() {
  const [wssState, setWssState] = useLocalStorage({
    key: 'settings-pekko-wss',
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
      <Stack>
        <Fieldset legend="Connection Settings">
          <TextInput
            label="Pekko Server IP"
            placeholder=""
            value={serverIp}
            onChange={(event) => setServerIp(event.currentTarget.value)}
            />
          <TextInput label="Pekko Server Port" placeholder="" />
          <Switch
            label="WSS"
            checked={wssState}
            onChange={(event) => setWssState(event.currentTarget.checked)}
            />
          <TextInput label="Auto Reconnect" placeholder="" />
        </Fieldset>
        <div>Pekko Server IP</div>
        <div>Pekko Server Port</div>
        <div>WSS</div>
        <div>Auto Reconnect</div>
      </Stack>
      <NetworkStatus />
    </Container>
  );
}
