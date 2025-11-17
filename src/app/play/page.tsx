"use client";
import GameBoard from '@/components/Board/GameBoard';
import classes from './page.module.css';
import { Accordion, Affix, Box, Button, Center, Container, Fieldset, Flex, Grid, Group, Menu, Paper, Stack, Table, TableData, Title, UnstyledButton } from '@mantine/core';
import { IconChevronUp } from "@tabler/icons-react"
import { useLocalStorage } from '@mantine/hooks';
import AvailableCommands from '@/components/AvailableCommands/AvailableCommands';
import { usePekkoGameLoop } from '@/hooks/usePekkoGameLoop';
import { useEffect, useState } from 'react';

export default function PlayPage() {
  const [controlTab, setControlTab] = useLocalStorage<string | null>({
    key: 'page-play-control-tab-state',
    defaultValue: null,
  });



  const [tableData, setTableData] = useState<TableData>({
    head: ['Name', 'Position'],
    body: [],
  });

  const { start, stop } = usePekkoGameLoop();

  useEffect(() => {
    start((status) => {
      if (!status) return;
      setTableData({
        head: ['Name', 'Position'],
        body: status.bots.map((bot) => [bot.name, `(${bot.position.x}, ${bot.position.y})`]),
      });
    });
    return () => stop();
  }, [start, stop])
  return <Flex direction="column" justify="space-between" align="stretch" style={{
    flexGrow: 1,
  }}>
    <Center style={{ flexGrow: 1 }}>
      <GameBoard />
    </Center>
  </Flex>
  return (
    <Stack style={{
    }}>


      {/*<Box style={{
        postition: 'absolute',
        bottom: 0,
        width: '100%',
      }} hidden={true}>
        <Accordion value={controlTab} onChange={setControlTab} chevron={<IconChevronUp size="1rem" />} classNames={{ chevron: classes.chevron }} >
          <Accordion.Item style={{
            border: "none"
          }} value="controlTab">
            <Accordion.Panel p={0}>
              <Grid>
                <Grid.Col span={6}>
                  <Fieldset legend="Controls">
                    <AvailableCommands />
                  </Fieldset>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Fieldset legend="Bots">
                    <Stack>
                      <Table data={tableData} />
                    </Stack>
                  </Fieldset>
                </Grid.Col>
              </Grid>
            </Accordion.Panel>
            <Accordion.Control mih={40}></Accordion.Control>
          </Accordion.Item>
        </Accordion>
      </Box>*/}
    </Stack >
  );
} 