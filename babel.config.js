module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    ['module-resolver', {
      root: ['./src'],
      alias: {
        "locales": './src/app/locales',
        "middleware": './src/app/middleware',
        "modals": './src/app/modals',
        "screens": './src/app/screens',
        "store": './src/app/store',
        "core": './src/core',
      }
    }]
  ]
};