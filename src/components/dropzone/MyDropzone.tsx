import { useRef } from 'react';
import { IconCloudUpload, IconDownload, IconX } from '@tabler/icons-react';
import { Button, Group, Text, useMantineTheme } from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import classes from './MyDropzone.module.css';

export default function MyDropzone({ setBoard }: { setBoard: (text: string) => void }) {
  const theme = useMantineTheme();
  const openRef = useRef<() => void>(null);

  return <div className={classes.wrapper}>
    <Dropzone
      openRef={openRef}
      onDrop={(files) => {
        console.log(files);
        const file = files[0];
        const reader = new FileReader();
        reader.onload = function (e) {
          const text = e.target?.result;
          console.log(text);
          setBoard(text as string);
        };
        reader.readAsText(file);
      }}
      className={classes.dropzone}
      radius="md"
      accept={["text/plain"]}
      maxSize={30 * 1024 ** 2}
    >
      <div style={{ pointerEvents: 'none' }}>
        <Group justify="center">
          <Dropzone.Accept>
            <IconDownload size={50} color={theme.colors.blue[6]} stroke={1.5} />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <IconX size={50} color={theme.colors.red[6]} stroke={1.5} />
          </Dropzone.Reject>
          <Dropzone.Idle>
            <IconCloudUpload size={50} stroke={1.5} className={classes.icon} />
          </Dropzone.Idle>
        </Group>

        <Text ta="center" fw={700} fz="lg" mt="xl">
          <Dropzone.Accept>Drop board here</Dropzone.Accept>
          <Dropzone.Reject>Text file less than 30mb</Dropzone.Reject>
          <Dropzone.Idle>Upload board</Dropzone.Idle>
        </Text>

        <Text className={classes.description}>
          Drag&apos;n&apos;drop your boards here to upload.<br />We can accept only <i>.txt</i> files that
          are less than 30mb in size.
        </Text>
      </div>
    </Dropzone>

    <Button className={classes.control} size="md" radius="xl" onClick={() => openRef.current?.()}>
      Select files
    </Button>
  </div>;
}
