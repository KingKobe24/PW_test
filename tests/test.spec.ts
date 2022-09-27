import { firefox, test, expect } from '@playwright/test'
const PNG =require('pngjs').PNG
import fs from 'fs'
import pixelmatch from 'pixelmatch'

test.describe('Trailer checkout', () => {
    test('Assert', async () => {
        const TRESHHOLD_PIXELS = 5_000
        const TIMEOUT_FOR_LOADING = 5_000
        let numDiffPixels
        const browser = await firefox.launch()
        const context = await browser.newContext()
        const page = await context.newPage()
        await page.goto('https://yandex.ru/video/')
        await page.fill('input[name=\'text\']', 'ураган')
        await page.locator('input[name=\'text\']').press('Enter');
        await page.waitForTimeout(TIMEOUT_FOR_LOADING)
        //find locator coordinates
        const x = await page.locator('div.thumb-image__shadow').first().boundingBox()

        //take source screenshot ONLY expect element, cause all page has other animations
        await page.locator('div.thumb-image__shadow').first().screenshot({
            path: `scr1.png`,
        });

        //move mouse to videobox and take second screenshot
        await page.mouse.move(x.x + 10, x.y + 10)
        await page.waitForTimeout(TIMEOUT_FOR_LOADING)
        await page.locator('div.thumb-image__shadow').first().screenshot({
            path: `scr2.png`,
        });

        //waiting for 5 sec and take one more screenshot ( для уверенности :) )
        await page.waitForTimeout(2_000)
        await page.locator('div.thumb-image__shadow').first().screenshot({
            path: `scr3.png`,
        });


        //use library pixelmatch to compare source screenshot to 2nd
        const {data, width, height} = PNG.sync.read(fs.readFileSync('scr1.png'))
        const {data: expectData} = PNG.sync.read(fs.readFileSync(`scr2.png`))
        const {data: diffData} = new PNG({width, height})

        numDiffPixels = pixelmatch(data, expectData, diffData, width, height, { treshhold: 0.2 })
        await expect(numDiffPixels).toBeGreaterThan(TRESHHOLD_PIXELS)

        //use library pixelmatch to compare 2nd screenshot to 3rd
        await page.waitForTimeout(1_000)
        const scr2 = PNG.sync.read(fs.readFileSync('scr2.png'))
        const scr3 = PNG.sync.read(fs.readFileSync('scr3.png'))
        const diff = new PNG({width, height})

        numDiffPixels = pixelmatch(scr2.data, scr3.data, diff.data, width, height, {threshold: 0.1})
        await expect(numDiffPixels).toBeGreaterThan(TRESHHOLD_PIXELS)
    })
})