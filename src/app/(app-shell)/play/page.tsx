"use client";
import classes from './page.module.scss';
import { Center, Title, } from '@mantine/core';
import AvailableCommands from '@/features/commands/components/AvailableCommands';
import BoardView from '@/features/board-live/components/BoardView';

export default function PlayPage() {
  return (
    <div className={classes.Grid}>
      <div className={classes.GridHeader}>
        <Center><Title order={1}>BotRace</Title></Center>
      </div>
      <div className={classes.GridBoard}>
        <BoardView />
      </div>
      <div className={classes.GridFooter}>
        <AvailableCommands />
      </div>
    </div>
  )
} 
