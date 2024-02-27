global.console = {
  ...console,
  log: jest.fn(),
  info: jest.fn()
};
