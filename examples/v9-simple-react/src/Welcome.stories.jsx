import { linkTo } from '@storybook/addon-links/react';
import { Welcome } from './Welcome';

export default {
  title: 'Welcome',
  component: Welcome,
};

export const ToStorybook = {
  args: {
    showApp: linkTo('Button'),
  },
};
