import { TIMEOUT_VIDEO_LOADING, TIMEOUT_WATCHER } from './constants'
import type { Locator, Page} from '@playwright/test'

export const elementExistWatcher = ( page, parent, target, timeOut = TIMEOUT_WATCHER, delay = TIMEOUT_VIDEO_LOADING) => {
    return new Promise( (resolve, reject) => {
        let finalTimeOut = 0
        const parentElement = page.locator(parent)
        const action = setInterval(() => {
            const ifExist = parentElement(`${parent}>`)
            if (ifExist) {
                clearInterval(action)
                resolve(target)
            }
            finalTimeOut += timeOut
            if (finalTimeOut >= delay) {
                clearInterval(action)
                reject('Exceed timeout')
            }
        }, timeOut)
    })
}
