"use client";
import { Text, Code, Container, ActionIcon, Skeleton, Center, Group, useMantineTheme, AspectRatio, Button, Flex, Popover, Kbd, Space } from "@mantine/core";
import { useMove } from "@mantine/hooks";
import { useEffect, useRef, useState } from "react";
import MyDropzone from "../../components/dropzone/MyDropzone";
import Board from "../../components/Board/Board";
import NewBoardModal from "../../components/Board/NewBoardModal";
import { IconQuestionMark } from "@tabler/icons-react";
export default function PlaygroundPage() {
  const theme = useMantineTheme();
  const openRef = useRef<() => void>(null);
  const [board, setBoard] = useState<string>("");
  const downloadRef = useRef<() => void>(() => { });
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'center' }}>
      <Container style={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}>
        <div>
          <Text fz="xl" fw={700}>Playground</Text>
          <Text fz="md" c="dimmed">Create and edit boards for your bots.</Text>
        </div>
        <Center style={{ flexGrow: 1, border: `2px dashed ${theme.colors.gray[4]}`, borderRadius: '8px', padding: '10px', overflow: 'auto' }}>
          {board === "" && <MyDropzone board={board} setBoard={setBoard} />}
          {board !== "" && <>

            <Board board={board} downloadRef={downloadRef} />

          </>}
        </Center>
        <Flex style={{ gap: '10px', justifyContent: 'center' }}>
          <NewBoardModal setBoard={setBoard} />
          <Button onClick={() => setBoard("")} disabled={board === ""}>Delete Board</Button>
          <Button onClick={() => downloadRef.current && downloadRef.current()} disabled={board === ""}>Download Board</Button>
        </Flex>

      </Container>
      <div style={{ zIndex: 1, position: 'sticky', bottom: '20px', paddingRight: '20px' }}>
        <div style={{ float: 'right' }}>
          <Popover width="fit-content" position="top" withArrow shadow="md">
            <Popover.Target>
              <ActionIcon style={{
                borderRadius: '50%',
                height: '50px',
                width: '50px',
                boxShadow: theme.shadows.xs,
                border: '1px solid rgba(0, 0, 0, 0.4)',

              }} variant="gradient" gradient={{ from: 'blue', to: 'green', deg: 45 }}><IconQuestionMark /></ActionIcon>
            </Popover.Target>
            <Popover.Dropdown>
              <Text size="xs"><Kbd>Left Click</Kbd> Toggle tile between empty and obstical.</Text>
              <Space h={10} />
              <Text size="xs"><Kbd>Shift</Kbd> + <Kbd>Left Click</Kbd> Cycle tile between empty, spawn, and target.</Text>
            </Popover.Dropdown>
          </Popover>
        </div>
      </div>
    </div>
  );
}
