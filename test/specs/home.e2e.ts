import { browser, expect as wdioExpect, $ } from '@wdio/globals'



describe('Home Screen', () => {
    // let browser: WebdriverIO.Browser;
    beforeEach(async function (this: Mocha.Context) {
        this.timeout(120000); // 2 minutes

        try {
            // Launch the Expo Go app
            await browser.activateApp('host.exp.exponent');

            // Wait for Expo Go to load
            await browser.pause(10000);

            // Check if we're on the home screen of Expo Go
            const projectsButton = await $('android=new UiSelector().text("Projects")');
            if (await projectsButton.isExisting()) {
                await projectsButton.click();
                await browser.pause(2000);
            }

            // Look for the "Enter URL manually" button
            const enterUrlButton = await $('android=new UiSelector().text("Enter URL manually")');
            if (await enterUrlButton.isExisting()) {
                await enterUrlButton.click();
            } else {
                console.log("'Enter URL manually' button not found. Might already be on the input screen.");
            }

            // Wait for the input field to appear
            await browser.pause(5000);

            // Enter your Expo app URL
            const urlInput = await $('//android.widget.EditText[@text="exp://"]');
            await urlInput.waitForDisplayed({ timeout: 30000 });
            await urlInput.setValue("exp://192.168.0.107:8081");

            // Click the "Connect" button
            const connectButton = await $('android=new UiSelector().text("Connect")');
            await connectButton.waitForDisplayed({ timeout: 30000 });
            await connectButton.click();

            // Wait for your app to load
            await browser.pause(30000);
        } catch (error) {
            console.error('Error in beforeEach:', error);
            throw error;
        }
    });

    it('should show Gallery and Camera buttons', async () => {
        const galleryButton = await $('~Gallery');
        const cameraButton = await $('~Camera');

        await wdioExpect(galleryButton).toBeExisting();
        await wdioExpect(cameraButton).toBeExisting();
    });


    afterEach(async function () {
        // Instead of resetting, let's just go back to the Expo Go home screen
        await browser.back();
        await browser.back();
    });
});