"use client";
import { Tabs } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';

export default function PlayPage() {

  const [activeTab, setActiveTab] = useLocalStorage<string | null>({ key: 'page-play-active-tab', defaultValue: 'board' });

  return (
    <Tabs value={activeTab} onChange={setActiveTab}>
      <Tabs.List>
        <Tabs.Tab value="board">Board</Tabs.Tab>
        <Tabs.Tab value="bots">Bots</Tabs.Tab>
        <Tabs.Tab value="settings" disabled>Settings (coming soon)</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="board">Board panel</Tabs.Panel>
      <Tabs.Panel value="bots">Bots panel</Tabs.Panel>
    </Tabs>
  );
}
