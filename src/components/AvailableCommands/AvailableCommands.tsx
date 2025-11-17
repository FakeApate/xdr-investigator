import { useIntrospection } from "@/hooks/useIntrospection";
import { Group, Loader, Stack, Code, Text, UnstyledButton } from "@mantine/core";
import { sendCommand } from "@/api/sendCommand";
import { wsLogger } from "@/logging/loggers";

export default function AvailableCommands() {
    const { commands, loading, error, sendCommandUrl } = useIntrospection();

    return (
        <div>
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
                <Stack gap={8}>
                    {commands.map((cmd) => (
                        <UnstyledButton key={cmd.type} style={{
                            display: "flex"
                        }}
                            onClick={() => {
                                if (cmd.type && sendCommandUrl) {
                                    wsLogger.info(`Sending command: ${cmd.type}`);
                                    sendCommand(sendCommandUrl, cmd)
                                }
                            }}
                        >
                            <Code style={{ width: "100%", borderRadius: 4, padding: 8 }}>
                                {cmd.type}
                                {"("}
                                {Object.entries(cmd).map(([key, value]) => {
                                    if (key === "type" || key === "_types") return null;
                                    return (
                                        <span key={key}>{key}: {value}, </span>
                                    );
                                })}
                                {")"}
                            </Code>
                        </UnstyledButton>
                    ))}
                    {commands.length === 0 && (
                        <Text size="sm" c="dimmed">
                            No commands returned from introspection.
                        </Text>
                    )}
                </Stack>
            )}
        </div>
    )
}