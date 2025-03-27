'use strict';

module.exports = {
  plugins: [
    'prettier-plugin-ember-template-tag',
    'prettier-plugin-organize-imports',
  ],
  overrides: [
    {
      files: '*.{js,gjs,ts,gts,mjs,mts,cjs,cts}',
      options: {
        singleQuote: true,
        templateSingleQuote: false,
      },
    },
  ],
};
