import { browser, $, $$ } from '@wdio/globals';

describe('Settings Screen', () => {
    const getCheckboxState = async (checkbox: WebdriverIO.Element) => {
        const checked = await checkbox.getAttribute('checked');
        return checked === 'true';
    };

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
            await urlInput.setValue('exp://192.168.0.107:8081');

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


    it('should save language selections and persist them', async () => {
        // Wait for the main screen to load
        console.log('Waiting for main screen to load...');
        await browser.pause(5000);

        // Try to find the settings icon using the provided attributes
        console.log('Attempting to find settings icon...');
        const settingsIcon = await $('//android.view.View[@bounds="[848,118][920,192]"]');
        if (await settingsIcon.isDisplayed()) {
            console.log('Settings icon found, clicking...');
            await settingsIcon.click();
        } else {
            console.log('Settings icon not found, trying alternative method...');
            const headerIcons = await $$('//android.view.View[@class="android.view.View" and @clickable="false"]');
            if (headerIcons.length > 0) {
                console.log(`Found ${headerIcons.length} potential header icons`);
                await headerIcons[0].click(); // Click the first icon, assuming it's the settings
            } else {
                throw new Error('Could not find settings icon or any header elements');
            }
        }

        // Wait for the Settings screen to load
        console.log('Waiting for Settings screen to load...');
        await browser.pause(3000);

        // Try to find and interact with language checkboxes
        console.log('Attempting to interact with language checkboxes...');
        let checkboxes = await $$('//android.widget.CheckBox');
        console.log(`Found ${checkboxes.length} checkboxes`);
        if (checkboxes.length >= 3) {
            // Log initial states
            console.log(`Initial state of first checkbox: ${await getCheckboxState(checkboxes[0])}`);
            console.log(`Initial state of second checkbox: ${await getCheckboxState(checkboxes[1])}`);
            console.log(`Initial state of third checkbox: ${await getCheckboxState(checkboxes[2])}`);

            // Click the first three checkboxes
            await checkboxes[0].click();
            await checkboxes[1].click();
            await checkboxes[2].click();

            // Log states after clicking
            console.log(`State of first checkbox after clicking: ${await getCheckboxState(checkboxes[0])}`);
            console.log(`State of second checkbox after clicking: ${await getCheckboxState(checkboxes[1])}`);
            console.log(`State of third checkbox after clicking: ${await getCheckboxState(checkboxes[2])}`);
        } else {
            throw new Error(`Expected at least 3 checkboxes, found ${checkboxes.length}`);
        }

        // Try to find and click the save button using the provided attributes
        console.log('Attempting to find save button...');
        const saveButton = await $('//android.view.ViewGroup[@content-desc="Save" and @resource-id="save-button"]');
        if (await saveButton.isDisplayed()) {
            console.log('Save button found, clicking...');
            await saveButton.click();
        } else {
            console.log('Save button not found, trying alternative methods...');
            const alternativeSaveButton = await $('//android.view.ViewGroup[@content-desc="Save"]');
            if (await alternativeSaveButton.isDisplayed()) {
                console.log('Alternative save button found, clicking...');
                await alternativeSaveButton.click();
            } else {
                throw new Error('Could not find save button');
            }
        }

        // Wait for the save operation to complete and return to main screen
        await browser.pause(5000);

        // Navigate back to the Settings screen
        console.log('Navigating back to Settings screen...');
        const settingsIconAgain = await $('//android.view.View[@bounds="[848,118][920,192]"]');
        if (await settingsIconAgain.isDisplayed()) {
            await settingsIconAgain.click();
        } else {
            const headerIconsAgain = await $$('//android.view.View[@class="android.view.View" and @clickable="false"]');
            if (headerIconsAgain.length > 0) {
                await headerIconsAgain[0].click(); // Click the first icon, assuming it's the settings
            } else {
                throw new Error('Could not find settings icon or any header elements');
            }
        }

        // Wait for the Settings screen to load again
        await browser.pause(10000);

        // Verify that the selected languages are correctly checked/unchecked
        // Verify that the selected languages are correctly checked/unchecked
        console.log('Verifying language selections...');
        checkboxes = await $$('//android.widget.CheckBox');
        if (checkboxes.length >= 3) {
            // Check states immediately after loading
            console.log(`First checkbox state after returning: ${await getCheckboxState(checkboxes[0])}`);
            console.log(`Second checkbox state after returning: ${await getCheckboxState(checkboxes[1])}`);
            console.log(`Third checkbox state after returning: ${await getCheckboxState(checkboxes[2])}`);

            // Wait a bit longer and check again
            await browser.pause(5000);
            console.log(`First checkbox state after additional wait: ${await getCheckboxState(checkboxes[0])}`);
            console.log(`Second checkbox state after additional wait: ${await getCheckboxState(checkboxes[1])}`);
            console.log(`Third checkbox state after additional wait: ${await getCheckboxState(checkboxes[2])}`);

            // Perform final assertions
            expect(await getCheckboxState(checkboxes[0])).toBe(false);
            expect(await getCheckboxState(checkboxes[1])).toBe(true);
            expect(await getCheckboxState(checkboxes[2])).toBe(true);
        } else {
            throw new Error(`Expected at least 3 checkboxes, found ${checkboxes.length}`);
        }

        console.log('Test completed successfully');
    });
});