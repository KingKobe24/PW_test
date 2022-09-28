import type {Locator, Page} from '@playwright/test'
import { BASE_PATH_SCREENSHOTS } from '../constants'

export class SearchVideoPage {
    readonly page: Page
    readonly inputSearchBox: Locator
    readonly homePage: string
    readonly videoBoxes: Locator

    constructor(page: Page) {
        this.page = page
        this.inputSearchBox = page.locator('input[name=\'text\']')
        this.videoBoxes = page.locator('div.thumb-image__shadow')
        this.homePage = 'https://yandex.ru/video/'

    }
    async open() {
        await this.page.goto(this.homePage)
    }

    async search(search_text: string) {
        await this.inputSearchBox.fill(search_text)
        await this.inputSearchBox.press('Enter')
    }

    async moveToVideoBox(locator: Locator, elementNumber: number) {
        if (elementNumber >= 20) {
            throw Error('Number of video boxes must be from 0 to 19')
        }
        else {
            await locator.nth(elementNumber).hover()
        }

    }

    async takeScreenshot(locator: Locator, elementNumber: number, iterator: number) {
        const path = `${BASE_PATH_SCREENSHOTS}/screenshot_video${elementNumber}#${iterator}.png`
        await locator.nth(elementNumber).screenshot({
            path
        })
        return path
    }

}