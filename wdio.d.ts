declare module WebdriverIO {
    interface Element {
        waitAndClick: () => void;
    }

    interface Browser {
        waitAndClick: () => void;
        activateApp: (appId: string) => void;
        pause: (ms: number) => void;
        tap: (x: number, y: number) => void;
        swipe: (x: number, y: number, x2: number, y2: number, ms: number) => void;
        setClipboard: (text: string) => void;
        getClipboard: () => string;
        setOrientation: (orientation: 'PORTRAIT' | 'LANDSCAPE') => void;
        setNetwork: (network: 'wifi' | 'cellular') => void;
        clearStorage: () => void;
        clearApp: (appId: string) => void;
        back: () => void;
    }

    interface Options {
        waitforTimeout: number;
    }

    interface Capabilities {
        platformName: string;
        'appium:deviceName': string;
        'appium:automationName': string;
        'appium:appPackage': string;
        'appium:appActivity': string;
        'appium:noReset': boolean;
        'appium:fullReset': boolean;
    }

    interface Config {
        port: number;
        path: string;
        maxInstances: number;
        logLevel: 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'silent';
        runner: 'local' | 'sauce';
        baseUrl: string;
        waitforTimeout: number;
        connectionRetryTimeout: number;
        connectionRetryCount: number;
        services: string[];
        framework: string;
        mochaOpts: {
            timeout: number;
            ui: string;
        };
        bail: number;
        reporters: string[];
        exclude: string[];
        capabilities: Capabilities[];
        specs: string[];
        services: string[];
        reporters: string[];
        before: (capabilities: Capabilities, specs: string[]) => void;
    }
}
