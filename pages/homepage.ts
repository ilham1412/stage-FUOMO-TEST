import {Page, Locator, expect } from '@playwright/test';

export class Homepage{
    readonly page: Page;
    readonly logo: Locator;
    readonly helpMenuDesktop: Locator;
    readonly helpMenuMobile: Locator;
    readonly creatorMenuDesktop: Locator;
    readonly creatorMenuMobile: Locator;
    readonly footer: Locator;
    readonly mainSection: Locator;
    readonly navigationMenu: Locator;

    constructor(page: Page){
        this.page = page;
        this.logo = page.locator('img[alt="FUOMO"]');
        this.navigationMenu = page.getByRole('banner');
        this.helpMenuDesktop = page.locator('.hidden.sm\\:flex a[aria-label="Go to Support"]');
        this.helpMenuMobile = page.locator('.sm\\:hidden a[href="/support"]');
        this.creatorMenuDesktop = page.locator('.hidden.sm\\:flex a[aria-label="Go to Creators"]');
        this.creatorMenuMobile = page.locator('.sm\\:hidden a[href="/creators"]');
        this.footer = page.locator('footer');
        this.mainSection = page.locator('main');
    } 

    async gotoHomepage(){
        const response = await this.page.goto('/')
        expect (response?.status()).toBe(200);
    }

    async verifyTitle(){
        await expect (this.page).toHaveTitle('Homepage | FUOMO');
    }

    async verifyUI(){
        await expect(this.logo).toBeVisible();
        await expect(this.navigationMenu).toBeVisible();
        await expect(this.mainSection).toBeVisible();
        await expect(this.footer).toBeVisible();
    }

    async clickHelpMenu(){
        const isMobile = this.page.viewportSize()!.width < 640;
        if (isMobile) {
            await this.helpMenuMobile.click();
        } else {
            await this.helpMenuDesktop.click();
        }
    }

    async clickCreatorMenu(){
        const isMobile = this.page.viewportSize()!.width < 640;
        if (isMobile) {
            await this.creatorMenuMobile.click();
        } else {
            await this.creatorMenuDesktop.click();
        }
    }
}
