module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    'vue/setup-compiler-macros': true,
  },
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'plugin:nuxt/recommended',
    'airbnb-base',
  ],
  plugins: [
  ],
  // add your custom rules here
  rules: {
    'import/extensions': ['error', 'ignorePackages', { js: 'never', ts: 'never' }],
  },
};
