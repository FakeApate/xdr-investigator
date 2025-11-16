import { Container, Text, Title } from '@mantine/core';
import { Illustration } from './Illustration';
import classes from './NotFound.module.css';

export function NotFound() {
  return (
    <Container className={classes.root}>
      <div className={classes.inner}>
        <Illustration className={classes.image} />
        <div className={classes.content}>
          <Title className={classes.title}>Nothing to see here</Title>
          <Text c="dimmed" size="lg" ta="center" className={classes.description}>
            Page you are trying to open does not yet exist.<br />
            But you can imagine what could be here.
          </Text>
        </div>
      </div>
    </Container>
  );
}
