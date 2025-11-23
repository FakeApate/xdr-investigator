"use client";

import BoardGallery from "@/features/boards-display/components/BoardGallery";
import { Flex } from "@mantine/core";

export default function BoardsPage() {
  return (
    <Flex style={{
      flexGrow: 1,
      height: "auto",
      display: "flex",
      padding: "var(--mantine-spacing-xl)",
    }}>
      <BoardGallery />
    </Flex>
  );
}
