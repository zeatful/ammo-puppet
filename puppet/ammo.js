/** 
 * @TODO: Refactor ammo and primers to use a common model, common methods and more generic
 * setup to reduce code for other components that will be tracked later
*/
const puppeteer = require("puppeteer")
const axios = require("axios")

// selector for an ammo entry
const CABELAS_ROW_ENTRY_CLASS = "row entry full"

// selectors for ammo properties
const CABELAS_CALIBER_SELECTOR = "div[id^=WC_Sku_List_Table_Full] > div:nth-child(INDEX) > div.CartridgeorGauge > input[id^=attrVal_CartridgeorGauge]"
const CABELAS_GRAIN_SELECTOR = "div[id^=WC_Sku_List_Table_Full] > div:nth-child(INDEX) > div.Grain > input[id^=attrVal_Grain]"
const CABELAS_MODEL_SELECTOR = "div[id^=WC_Sku_List_Table_Full] > div:nth-child(INDEX) > div.ModelNumber > input[id^=attrVal_ModelNumber]"
const CABELAS_PRICE_SELECTOR = "div[id^=WC_Sku_List_Table_Full] > div:nth-child(INDEX) > div.Price > div.cell > div.chartcomposernamePartPriceContainer > div[id^=price_display] > span[id^=productId] > span[id=sku] > div > input[id^=ProductInfoPrice]"
const CABELAS_ONLINE_AVAILABILITY_SELECTOR_1 = "div[id^=WC_Sku_List_Table_Full] > div:nth-child(INDEX) > div.StoreAvail > div.OnlineAvailability > div[id^=WC_Online_Inventory_Section] > span.text"
const CABELAS_ONLINE_AVAILABILITY_SELECTOR_2 = "div[id^=WC_Sku_List_Table_Full] > div:nth-child(INDEX) > div.StoreAvail > div.OnlineAvailability > div[id^=WC_Sku_List_TableContent] > span.fnt_out_of_stock"
const CABELAS_ROUND_COUNT_SELECTOR = "div[id^=WC_Sku_List_Table_Full] > div:nth-child(INDEX) > div.Quantity > input[id^=attrVal_Quantity]"

var ammoList = []

const found = new Date().toISOString().replace("T", " ").substr(0, 19)

// Array of Cabelas pages to scan
const cabelasPages = [
  "https://www.cabelas.com/shop/en/winchester-super-x-power-point-centerfire-rifle-ammo",
  "https://www.cabelas.com/shop/en/herters-target-handgun-ammo",
  "https://www.cabelas.com/shop/en/herters-hunting-rifle-ammo",
  "https://www.cabelas.com/shop/en/winchester-usa-handgun-ammo",
  "https://www.cabelas.com/shop/en/winchester-usa-centerfire-target-range-rifle-ammo",
  "https://www.cabelas.com/shop/en/winchester-usa-handgun-ammo-bulk-pack",
  "https://www.cabelas.com/shop/en/winchester-usa-handgun-ammo-range-pack",
  "https://www.cabelas.com/shop/en/remington-umc-centerfire-handgun-ammo",
  "https://www.cabelas.com/shop/en/blazer-brass-handgun-ammo"
]

// helper sleep function
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

async function gatherAmmo() {
  console.log("Launching Headless Ammo search at " + found)

  const browser = await puppeteer.launch({ignoreDefaultArgs: ['--disable-extensions']})
  const page = await browser.newPage()
  await gatherCabelasAmmo(page)
  browser.close()

  postToDB(ammoList)

  let availableAmmo = ammoList.filter((x) => x.availability)
  console.log("Available Ammo ==> ")
  availableAmmo.forEach((x) => console.log(x))

  console.log("Ammo Puppet finished at " + new Date().toISOString().replace("T", " ").substr(0, 19))

  // sleep 5 minutes before container exits and immediately restarts to throttle requests
  console.log("Sleeping 5 minutes before exit...")
  await sleep(300000)
}

function postToDB(items) {
  items.forEach((item) => {
    axios.post("http://backend:4000/ammo/add", item)
    .catch(err => {
      console.error(err);
    })
  })
}

async function gatherCabelasAmmo(page) {
  console.log("Checking Cabela's...")
  for (let i = 0; i < cabelasPages.length; i++) {
    await parseCabelasPage(page, cabelasPages[i])
  }
  console.log("Cabela's finished!")
}

async function parseCabelasPage(page, url) {
  // await all network events to complete to ensure availability has loaded
  await page.goto(url, {waitUntil: 'networkidle0'})

  // scoll to the stock listing, used to grab screenshots for verification
  // await page.evaluate(_ => {
  //   window.scrollBy(0, (window.innerHeight * 2))
  // })

  // get number of ammo entries
  let numberOfEntries = await page.evaluate((sel) => {
    return document.getElementsByClassName(sel).length
  }, CABELAS_ROW_ENTRY_CLASS)
  numberOfEntries += 2 // increase to offset header

  // start at 2 to offset header
  for (let i = 2; i < numberOfEntries; i++) {
    // substitute iteration selector for nth:child(INDEX) in selectors
    let caliberSelector = CABELAS_CALIBER_SELECTOR.replace("INDEX", i)
    let grainSelector = CABELAS_GRAIN_SELECTOR.replace("INDEX", i)
    let modelSelector = CABELAS_MODEL_SELECTOR.replace("INDEX", i)
    let availabilitySelector1 = CABELAS_ONLINE_AVAILABILITY_SELECTOR_1.replace("INDEX",i)
    let availabilitySelector2 = CABELAS_ONLINE_AVAILABILITY_SELECTOR_2.replace("INDEX",i)
    let roundCountSelector = CABELAS_ROUND_COUNT_SELECTOR.replace("INDEX", i)
    let priceSelector = CABELAS_PRICE_SELECTOR.replace("INDEX", i)

    let availability = true

    let caliber = await page.evaluate((sel) => {
      let element = document.querySelector(sel)
      return element ? element.getAttribute("value") : false
    }, caliberSelector)

    let grain = await page.evaluate((sel) => {
      let element = document.querySelector(sel)
      return element ? element.getAttribute("value") : false
    }, grainSelector)

    let model = await page.evaluate((sel) => {
      let element = document.querySelector(sel)
      return element ? element.getAttribute("value") : false
    }, modelSelector)

    availability = (await page.evaluate((sel) => {
      // element will be out_of_stock or null if in stock
      let instock = document.querySelector(sel)
      return instock
    }, availabilitySelector1) ? false : availability)

    availability = (await page.evaluate((sel) => {
      // element will be out_of_stock or null if in stock
      let instock = document.querySelector(sel)
      return instock
    }, availabilitySelector2) ? false : availability)

    let count = await page.evaluate((sel) => {
      let element = document.querySelector(sel)
      return element ? element.getAttribute("value") : false
    }, roundCountSelector)

    let price = await page.evaluate((sel) => {
      let element = document.querySelector(sel)
      return element ? element.getAttribute("value") : false
    }, priceSelector)

    let id = caliber + " - " + grain + " - " + model + " - " + count

    // push entry
    ammoList.push({ id, caliber, grain, availability, count, price, url, model, found})

    // await page.screenshot({path: `./screenshots/ammo/${model}-${availability}.png`});
  }
}

gatherAmmo()