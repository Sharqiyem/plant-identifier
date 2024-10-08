export const config: WebdriverIO.Config = {
  runner: 'local',
  port: 4723,
  path: '/',
  specs: ['./test/specs/**/*.ts'],
  exclude: [],
  maxInstances: 1,
  capabilities: [
    {
      platformName: 'Android',
      'appium:deviceName': '79bbc9c41220',
      'appium:automationName': 'UiAutomator2',
      'appium:appPackage': 'host.exp.exponent',
      'appium:appActivity': 'host.exp.exponent.LauncherActivity',
      'appium:noReset': true,
      'appium:fullReset': false
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
