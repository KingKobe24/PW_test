import type { Page } from '@playwright/test'

export class TestPage {
    static screenShotIter = 0
    readonly page: Page

    constructor(page: Page) {
        this.page = page
    }
    async open() {
        await this.page.goto('https://yandex.ru/video/')
    }

    async search(search_text: string) {
        await this.page.locator('input[name=\'text\']').fill(search_text)
        await this.page.locator('input[name=\'text\']').press('Enter')
    }

    async findVideoBox() {
        const coordinates = await this.page.locator('div.thumb-image__shadow').first().boundingBox()
        coordinates.x += 20
        coordinates.y += 20
        return coordinates
    }

    async takeScreenshot() {
        await this.page.locator('div.thumb-image__shadow').first().screenshot({
            path: `./screenshots/screenshot_${TestPage.screenShotIter}.png`,
        })
        TestPage.screenShotIter += 1
    }

}