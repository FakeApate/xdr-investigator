import { IconDeviceGamepad, IconFilePencil, IconBong, IconSettings } from '@tabler/icons-react';

export type NavPage = {
  link: string;
  label: string;
  icon: React.FC<any>;
}

export const pages: NavPage[] = [
  { link: '/play', label: 'Play', icon: IconDeviceGamepad },
  { link: '/boards', label: 'Boards', icon: IconFilePencil },
  { link: '/playground', label: 'Playground', icon: IconBong },
  { link: '/settings', label: 'Settings', icon: IconSettings },
];
