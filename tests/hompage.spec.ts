import {test, expect} from '@playwright/test';
import { Homepage } from '../pages/homepage';

test.describe('Homepage Validation', () => {
    let homepage: Homepage;
    
    test.beforeEach(async ({page}) => {
        homepage = new Homepage(page);
        await homepage.gotoHomepage();
    });

    test('Page Loads Successfully', async ({page}) => {
        await expect(page).toHaveURL('/');
        await homepage.verifyTitle();
    });

    test('Validasi Elemen UI Utama', async ({page}) => {
        await homepage.verifyUI();
        await expect(page.locator('main')).toContainText('FUOMO')
    });
    
    test('Navigation Link Berfungsi', async ({page}) => {
        await homepage.clickHelpMenu();
        await expect(page).toHaveURL('/support');

    });

    test('Creator Menu Berfungsi', async ({page}) => {
        await homepage.clickCreatorMenu();
        await expect(page).toHaveURL('/creators');
    });
});