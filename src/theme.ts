"use client";

import { Button, createTheme, MantineColorsTuple } from "@mantine/core";
import classes from "./theme.module.css"
const myColor: MantineColorsTuple = [
  '#f1f4fe',
  '#e4e6ed',
  '#c8cad3',
  '#a9adb9',
  '#9094a3',
  '#7f8496',
  '#777c91',
  '#63687c',
  '#595e72',
  '#4a5167'
];
export const theme = createTheme({
  colors: {
    myColor,
  },
  components: {
    Button: Button.extend({
      classNames: classes,
    }),
  },
});
