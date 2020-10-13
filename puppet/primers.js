/** 
 * @TODO: Refactor ammo and primers to use a common model, common methods and more generic
 * setup to reduce code for other components that will be tracked later
*/
const puppeteer = require("puppeteer")
const axios = require("axios")

// selector for an primer entry
const CABELAS_ROW_ENTRY_CLASS = "row entry full"

// selectors for primer properties
const CABELAS_DESCRIPTION_SELECTOR = "div[id^=WC_Sku_List_Table_Full] > div:nth-child(INDEX) > div.Description > input[id^=attrVal_Description]"
const CABELAS_SIZE_SELECTOR = "div[id^=WC_Sku_List_Table_Full] > div:nth-child(INDEX) > div.Size > input[id^=attrVal_Size]"
const CABELAS_PRICE_SELECTOR = "div[id^=WC_Sku_List_Table_Full] > div:nth-child(INDEX) > div.Price > div.cell > div.chartcomposernamePartPriceContainer > div[id^=price_display] > span[id^=productId] > span[id=sku] > div > input[id^=ProductInfoPrice]"
const CABELAS_COUNT_SELECTOR = "div[id^=WC_Sku_List_Table_Full] > div:nth-child(INDEX) > div.Quantity > input[id^=attrVal_Quantity]"
const CABELAS_MODEL_SELECTOR = "div[id^=WC_Sku_List_Table_Full] > div:nth-child(INDEX) > div.ModelNumber > input[id^=attrVal_ModelNumber]"
const CABELAS_ONLINE_AVAILABILITY_SELECTOR_1 = "div[id^=WC_Sku_List_Table_Full] > div:nth-child(INDEX) > div.StoreAvail > div.OnlineAvailability > div[id^=WC_Online_Inventory_Section] > span.text"
const CABELAS_ONLINE_AVAILABILITY_SELECTOR_2 = "div[id^=WC_Sku_List_Table_Full] > div:nth-child(INDEX) > div.StoreAvail > div.OnlineAvailability > div[id^=WC_Sku_List_TableContent] > span.fnt_out_of_stock"

const found = new Date().toISOString().replace("T", " ").substr(0, 19)

var primerList = []

// Array of Cabelas pages to scan
const cabelasPages = [
  "https://www.cabelas.com/shop/en/cci-standard-primers",
  "https://www.cabelas.com/shop/en/winchester-pistol-primers",
  "https://www.cabelas.com/shop/en/winchester-magnum-small-pistol-primers",
  "https://www.cabelas.com/shop/en/federal-premium-gold-medal-match-primers"
]

// helper sleep function
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

async function gatherPrimers() {
  console.log("Launching Headless Primer search at " + found)

  const browser = await puppeteer.launch({})
  const page = await browser.newPage()

  await gatherCabelasPrimers(page)

  browser.close()

  postToDB(primerList)

  let availablePrimers = primerList.filter((x) => x.availability)
  console.log("Available Primers ==> ")
  availablePrimers.forEach((x) => console.log(x))

  console.log("Primer search finished at " + new Date().toISOString().replace("T", " ").substr(0, 19))
  console.log("Sleeping 5 minutes before exit...")
  await sleep(300000)
}

function postToDB(items) {
  items.forEach((item) => {
    axios.post("http://backend:4000/primer/add", item)
    .catch(err => {
      console.error(err);
    })
  })
}

async function gatherCabelasPrimers(page) {
  console.log("Checking Cabela's...")
  for (let i = 0; i < cabelasPages.length; i++) {
    await parseCabelasPage(page, cabelasPages[i])
  }
  console.log("Cabela's finished!")
}

async function parseCabelasPage(page, url) {
  // await until there are 0 network requests over 500ms pending
  await page.goto(url, {waitUntil: 'networkidle0'})

  // get number of ammo entries
  let numberOfEntries = await page.evaluate((sel) => {
    return document.getElementsByClassName(sel).length
  }, CABELAS_ROW_ENTRY_CLASS)
  numberOfEntries += 2 // increase to offset header

  // start at 2 to offset header
  for (let i = 2; i < numberOfEntries; i++) {
    // substitute iteration selector for nth:child(INDEX) in selectors
    let sizeSelector = CABELAS_SIZE_SELECTOR.replace("INDEX", i)
    let countSelector = CABELAS_COUNT_SELECTOR.replace("INDEX", i)
    let descriptionSelector = CABELAS_DESCRIPTION_SELECTOR.replace("INDEX", i)  
    let modelSelector = CABELAS_MODEL_SELECTOR.replace("INDEX", i)  
    let priceSelector = CABELAS_PRICE_SELECTOR.replace("INDEX", i)
    let availabilitySelector1 = CABELAS_ONLINE_AVAILABILITY_SELECTOR_1.replace("INDEX",i)
    let availabilitySelector2 = CABELAS_ONLINE_AVAILABILITY_SELECTOR_2.replace("INDEX",i)

    let availability = true

    let size = await page.evaluate((sel) => {
      let element = document.querySelector(sel)
      return element ? element.getAttribute("value") : false
    }, sizeSelector)

    let description = await page.evaluate((sel) => {
      let element = document.querySelector(sel)
      return element ? element.getAttribute("value") : ''
    }, descriptionSelector)

    let count = await page.evaluate((sel) => {
      let element = document.querySelector(sel)
      return element ? element.getAttribute("value") : '100'
    }, countSelector)

    let model = await page.evaluate((sel) => {
      let element = document.querySelector(sel)
      return element ? element.getAttribute("value") : ''
    }, modelSelector)

    let price = await page.evaluate((sel) => {
      let element = document.querySelector(sel)
      return element ? element.getAttribute("value") : false
    }, priceSelector)

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

    description = (description ? description : size);

    let id = model + "-" + description + "-" + count + "-" + availability + "-" + price

    // push entry
    primerList.push({ id, size, model, price, description, count, availability, url, found})
  }
}

gatherPrimers()