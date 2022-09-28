import { test, expect } from '@playwright/test'
import { elementExistWatcher } from '../helpers'
import { SearchVideoPage } from '../pages/searchVideoPage'
import { TRESHHOLD_PIXELS, TIMEOUT_VIDEO_LOADING } from '../constants'
const fs = require('fs')
const PNG = require('pngjs').PNG
const pixelmatch = require('pixelmatch')

test.describe('Trailer checkout', () => {
    test('Check \'ураган\' video trailer', async ({ page }) => {
        const search_item = 'ураган'
        const videoNumber = 7
        let screenshotCount = 0

        const searchPage = new SearchVideoPage(page)

        await searchPage.open()
        await searchPage.search(search_item)

        await searchPage.moveToVideoBox(searchPage.videoBoxes, videoNumber)
        const first_screenshot = await searchPage.takeScreenshot(searchPage.videoBoxes, videoNumber, screenshotCount)
        screenshotCount +=1
        await page.waitForTimeout(TIMEOUT_VIDEO_LOADING)

        const second_screenshot = await searchPage.takeScreenshot(searchPage.videoBoxes, videoNumber,screenshotCount)

        const {data, width, height} = PNG.sync.read(fs.readFileSync(first_screenshot))
        const {data: expectData} = PNG.sync.read(fs.readFileSync(second_screenshot))
        const {data: diffData} = new PNG({width, height})
        const numDiffPixels = pixelmatch(data, expectData, diffData, width, height, { treshhold: 0.2 })

        await expect(numDiffPixels).toBeGreaterThan(TRESHHOLD_PIXELS)

        await page.waitForTimeout(10000)
    })
})