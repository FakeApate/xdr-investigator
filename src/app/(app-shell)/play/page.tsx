"use client";
import classes from './page.module.scss';
import { Center, Flex, Title, } from '@mantine/core';
import AvailableCommands from '@/features/commands/components/AvailableCommands';
import BoardView from '@/features/board-live/components/BoardView';

export default function PlayPage() {
  return (
    <div className={classes.Grid}>
      <div className={classes.GridHeader}>
        <Center><Title order={1}>BotRace</Title></Center>
      </div>
      <Flex className={classes.GridBoard}>
        <BoardView />
      </Flex>
      <div className={classes.GridFooter}>
        <AvailableCommands />
      </div>
    </div>
  )
} 