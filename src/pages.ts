import { IconDeviceGamepad, IconFilePencil, IconBong, IconSettings, Icon, IconProps } from '@tabler/icons-react';
import { ForwardRefExoticComponent, RefAttributes } from 'react';

export type NavPage = {
  link: string;
  label: string;
  icon: ForwardRefExoticComponent<IconProps & RefAttributes<Icon>>;
}

export const pages: NavPage[] = [
  { link: '/play', label: 'Play', icon: IconDeviceGamepad },
  { link: '/boards', label: 'Boards', icon: IconFilePencil },
  { link: '/playground', label: 'Playground', icon: IconBong },
  { link: '/settings', label: 'Settings', icon: IconSettings },
];
