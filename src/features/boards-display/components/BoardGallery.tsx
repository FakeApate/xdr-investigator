import useStore from "@/shared/hooks/useStore";
import { useBoardLevelStore } from "../state/BoardLevelStore";
import { AspectRatio, Box, Center, Container, Flex, Group, Stack, Title } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { BoardLevel } from "../types/Level";
import { Carousel } from "@mantine/carousel";
import BoardGrid from "@/features/board-live/components/BoardGrid";
import { BoardGridSvg } from "./BoardSvg";
import { useElementSize } from '@mantine/hooks';
import classes from "./BoardGallery.module.scss"

export default function BoardGallery() {
    const levelsStore = useStore(useBoardLevelStore, (state) => state);
    const startAutoRefresh = useBoardLevelStore((s) => s.startAutoRefresh);
    const stopAutoRefresh = useBoardLevelStore((s) => s.stopAutoRefresh);
    const { ref, width, height } = useElementSize();
    useEffect(() => {
        startAutoRefresh();
        return () => {
            stopAutoRefresh();
        };
    }, [startAutoRefresh, stopAutoRefresh]);

    return (
        <Box ref={ref} style={{
            flexGrow: 1,
        }}>
            <Center>
                <Carousel classNames={classes} w={width * 0.9} height={height * 0.8} slideGap="xl" withControls withIndicators withKeyboardEvents type="container">
                    {levelsStore && levelsStore.error && levelsStore.error}
                    {levelsStore && levelsStore.levels && levelsStore.levels.map((level: BoardLevel) => (
                        <Carousel.Slide key={level.name} style={{
                            alignContent: "center"
                        }}>
                            <div style={{
                                justifyItems: "center",
                            }}>
                                <BoardGridSvg boardstring={level.data} />
                                <Title order={3}>
                                    {level.name}
                                </Title>
                            </div>
                        </Carousel.Slide>))}
                    {levelsStore && levelsStore.loading && "Loading"}
                </Carousel>
            </Center>
        </Box>
    )
}