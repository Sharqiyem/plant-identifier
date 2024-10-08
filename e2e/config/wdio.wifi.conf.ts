export const config: WebdriverIO.Config = {
  runner: 'local',
  port: 4723,
  path: '/',
  specs: ['../specs/**/*.ts'],
  exclude: [],
  maxInstances: 1,
  capabilities: [
    {
      platformName: 'Android',
      'appium:deviceName': '192.168.0.102:42573', // Updated to WiFi device address
      'appium:udid': '192.168.0.102:42573', // Added UDID for WiFi device
      'appium:automationName': 'UiAutomator2',
      'appium:appPackage': 'host.exp.exponent',
      'appium:appActivity': 'host.exp.exponent.LauncherActivity',
      'appium:noReset': true,
      'appium:fullReset': false,
      'appium:adbExecTimeout': 120000, // Increased timeout for ADB commands
      'appium:androidDeviceReadyTimeout': 120000 // Increased timeout for device readiness
    }
  ],
  logLevel: 'info',
  bail: 0,
  baseUrl: 'http://localhost',
  waitforTimeout: 30000,
  connectionRetryTimeout: 180000,
  connectionRetryCount: 3,
  services: ['appium'],
  framework: 'mocha',
  reporters: ['spec'],
  mochaOpts: {
    ui: 'bdd',
    timeout: 300000
  },
  before: function (capabilities, specs) {
    require('ts-node').register({ files: true });
  }
};
