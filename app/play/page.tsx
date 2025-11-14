"use client";
import { useState } from 'react';
import { Tabs } from '@mantine/core';

export default function PlayPage() {
  const [activeTab, setActiveTab] = useState<string | null>('board');

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
