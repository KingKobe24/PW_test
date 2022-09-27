import { test, expect } from '@playwright/test'
import { TestPage } from '../pages/testPage'
import { TRESHHOLD_PIXELS, TIMEOUT_FOR_LOADING, BASE_PATH} from '../constants'
const fs = require('fs')
const PNG = require('pngjs').PNG
const pixelmatch = require('pixelmatch')

test.describe('Trailer checkout', () => {
    test('Check \'ураган\' video trailer', async ({ page }) => {
        const testPage = new TestPage(page)

        await testPage.open()
        await testPage.search('ураган')
        await page.waitForTimeout(TIMEOUT_FOR_LOADING)
        const coordinates = await testPage.findVideoBox()
        await testPage.takeScreenshot()

        await page.mouse.move(coordinates.x, coordinates.y)
        await page.waitForTimeout(TIMEOUT_FOR_LOADING)
        await testPage.takeScreenshot()

        const {data, width, height} = PNG.sync.read(fs.readFileSync(`${BASE_PATH}/screenshot_0.png`))
        const {data: expectData} = PNG.sync.read(fs.readFileSync(`${BASE_PATH}/screenshot_1.png`))
        const {data: diffData} = new PNG({width, height})

        const numDiffPixels = pixelmatch(data, expectData, diffData, width, height, { treshhold: 0.2 })

        await expect(numDiffPixels).toBeGreaterThan(TRESHHOLD_PIXELS)
    })
})