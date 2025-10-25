import type { Preview } from '@storybook/react';
import '../src/styles/index.css';
import '../src/styles/tokens.css';
import '../src/styles/App.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
