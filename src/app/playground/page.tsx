"use client";
import superjson from 'superjson';
import { Text, Container, ActionIcon, Center, useMantineTheme, Button, Flex, Popover, Kbd, Space, Divider, Box } from "@mantine/core";
import { useRef } from "react";
import MyDropzone from "@/components/dropzone/MyDropzone";
import DesignBoard from "@/components/Board/DesignBoard";
import NewBoardModal from "@/components/Board/NewBoardModal";
import { IconQuestionMark } from "@tabler/icons-react";
import { useLocalStorage } from "@mantine/hooks";

export default function PlaygroundPage() {
  const theme = useMantineTheme();
  const downloadRef = useRef<() => void>(() => { });
  const [boardGrid, setBoardGrid] = useLocalStorage<string[][]>({
    key: 'page-play-board-grid',
    defaultValue: [[]],
    serialize: superjson.stringify,
    deserialize: (str) => (str === undefined ? [[]] : superjson.parse(str)),
  });
  const setBoard = (text: string) => {
    if (text !== "") {
      setBoardGrid(text.split('\n').map((row) => row.split(' ')));
    }
  };

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
          {boardGrid.length === 0 && <MyDropzone setBoard={setBoard} />}
          {boardGrid.length > 0 && <DesignBoard boardGrid={boardGrid} setBoardGrid={setBoardGrid} downloadRef={downloadRef} />}
        </Center>
        <Flex style={{ gap: '10px', justifyContent: 'center' }}>
          <NewBoardModal setBoard={setBoard} />
          <Button onClick={() => setBoardGrid([])} disabled={boardGrid.length === 0}>Delete Board</Button>
          <Button onClick={() => downloadRef.current && downloadRef.current()} disabled={boardGrid.length === 0}>Download Board</Button>
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
              <Divider variant="dashed" />
              <Space h={10} />
              <Text size="xs"><Kbd>Shift</Kbd> + <Kbd>Left Click</Kbd> Cycle tile between empty, spawn, and target.</Text>
              <Space h={10} />
              <Divider variant="dashed" />
              <Space h={10} />
              <Text size="xs"><Kbd>Right Click</Kbd> Erase tile (set to empty).</Text>
              <Space h={10} />
              <Divider variant="dashed" />
              <Space h={10} />
              <Text size="xs">Hold <Kbd>Left Click</Kbd> to paint tiles.</Text>
              <Space h={10} />
              <Divider variant="dashed" />
              <Space h={10} />
              <Text size="xs"><Kbd>Right Click</Kbd> is always erase when painting.</Text>
            </Popover.Dropdown>
          </Popover>
        </div>
      </div>
    </div>
  );
}
