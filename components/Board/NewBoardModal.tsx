import { useDisclosure } from '@mantine/hooks';
import { Modal, Button, NumberInput, Stack } from '@mantine/core';
import { Dispatch, SetStateAction, useState } from 'react';

export default function NewBoardModal({ setBoard }: { setBoard: Dispatch<SetStateAction<string>> }) {
  const [opened, { open, close }] = useDisclosure(false);
  const [valueRows, setValueRows] = useState<string | number>('');
  const [valueColumns, setValueColumns] = useState<string | number>('');
  return (
    <>
      <Modal opened={opened} onClose={close} title="New Board">
        <Stack>

          <NumberInput value={valueRows} onChange={setValueRows}
            label="Rows"
            placeholder="0-99" />
          <NumberInput value={valueColumns} onChange={setValueColumns}
            label="Columns"
            placeholder="0-99" />
          <Button onClick={() => {
            console.log('Create board with rows:', valueRows, 'columns:', valueColumns);
            close();

            const emptyBoard = ('_'.repeat(valueColumns as number).split('').join(' ') + '\n').repeat(valueRows as number).trim();
            setBoard(emptyBoard);
          }}>
            Create Board
          </Button>
        </Stack>
      </Modal>

      <Button variant="default" onClick={open}>
        New Board
      </Button>
    </>
  );
}
