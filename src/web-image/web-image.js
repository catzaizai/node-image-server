import puppeteer from "puppeteer";

class WebImage {
  _cookie = null;
  _browser = null;

  constructor() {
    puppeteer.launch({ args: ["--no-sandbox"] }).then(b => {
      this._browser = b;
    });
  }

  /**
   * Login Method
   * @param {String} username user name
   * @param {String} password password
   * @param {String} uSelector user name web selector ex: div.form-block > div:nth-child(0) > input \n\r default: #username
   * @param {String} pSelector password web selector ex: div.form-block > div:nth-child(1) > input[type=password] \n\r default: #password
   * @param {String} submitBtnSelector submit button selector ex: #submit default: #submit
   */
  async login(url, username, password, uSelector, pSelector, submitBtnSelector) {
    
    const page = await this._browser.newPage();
    // const browser = await puppeteer.launch();
    // const page = await browser.newPage();
    uSelector = uSelector || "#username";
    pSelector = pSelector || "#password";
    submitBtnSelector = submitBtnSelector || "#submit";
    await page.goto(url, { waitUntil: "networkidle0", timeout: 60000 });
    await page.waitForSelector(uSelector);
    await page.type(uSelector, username);
    await page.waitForSelector(pSelector);
    await page.type(pSelector, password);
    await page.waitForSelector(submitBtnSelector);
    await page.click(submitBtnSelector);
    const loginResponse = await page.waitForResponse(response => {
      console.log(response.url() + ":" + response.status());
      return response.status() === 200;
    });
    await page.waitForNavigation({ waitUntil: "networkidle0", timeout: 6000 });
    this._cookie = await page.cookies();
    await page.close();
    return loginResponse.ok();
  }

  /**
   * get base64 for image
   * @param {String} url web address ex: https://www.baidu.com
   * @param {String} selector web selector ex: #container > div:first-child
   * @param {String} padding Screenshot of cutting(Support negative) like css's padding ex: 0 10 0 10 | 0 10 0 | 0 10
   * @param {'element'|'padding'|'border'|'margin'|'composite'} bbox selector DOMElement box model \r\n default: composite
   * @param {Number} delay Delay screenshots default: 5000ms
   * @param {Array<{event: 'click|'hover'|'delete'|'style', selector: String, value?: Array<Array<String>>}>} operations
   */
  async getBase64(url, selector, padding, bbox, delay, operations) {
    const page = await this._browser.newPage();
    let result = '';
    // const browser = await puppeteer.launch();
    // const page = await browser.newPage();
    await page.setViewport({ height: 1080, width: 1920 });
    if (this._cookie) {
      page.setCookie(...this._cookie);
    } else {
      console.warn("not login");
    }

  let top = 0,
      right = 0,
      bottom = 0,
      left = 0;
    if (!delay) {
      delay = 5000;
    }
  
    await page.goto(url, { waitUntil: "networkidle0", timeout: 60000 });

    if (operations) {
      if (operations instanceof Array) {
        for (const operation of operations) {
            const elementHandle =  await page.waitForSelector(operation.selector);
          if (elementHandle) {
            switch (operation.event) {
              case "click":
                await elementHandle.click();
                await page.waitFor(500);
                break;
              case "hover":
                await elementHandle.hover();
                await page.waitFor(500);
                break;
              case "delete":
                await page.evaluate(element => element.remove(), elementHandle);
                await page.waitFor(500);
                break;
              case "style":
                await page.evaluate(
                  (element, value) => (element.style[value[0]] = value[1]),
                  elementHandle,
                  operation.value
                );
                await page.waitFor(500);
                break;
            }
          } else {
            console.warn(operation.selector + ": element is not found");
          }
        }
      }
    }
  
    if (padding) {
      let values = padding.split(" ");
      values = values.map(value => Number(value));
      switch (values.length) {
        case 1:
          top = values[0];
          right = values[0];
          bottom = values[0];
          left = values[0];
          break;
        case 2:
          top = values[0];
          bottom = values[0];
          right = values[1];
          left = values[1];
          break;
        case 3:
          break;
          top = values[0];
          bottom = values[2];
          left = values[1];
          right = values[1];
        case 4:
          top = values[0];
          right = values[1];
          bottom = values[2];
          left = values[3];
          break;
      }
    }
  
    await page.waitFor(delay);
  
    let base64 = "";
    if (selector) {
      const elementHandle = await page.$(selector);
      const box = await elementHandle.boxModel();
      if (elementHandle) {
        if (bbox) {
          await elementHandle.sc;
          base64 = await elementHandle.screenshot({
            encoding: "base64",
            clip: {
              x: box[bbox][0].x - left,
              y: box[bbox][0].y - top,
              width: box[bbox][2].x - box[bbox][0].x + left + right,
              height: box[bbox][2].y - box[bbox][0].y + top + bottom
            }
          });
        } else {
          base64 = await elementHandle.screenshot({
            encoding: "base64"
          });
        }
      } else {
          result = selector + ':element is not found'
          console.log(result);
      }
    } else {
      base64 = await page.screenshot({ encoding: "base64", fullPage: true });
    }
  
    await page.close();
    result = "data:image/png;base64," + base64
    return result
  }
}

export default WebImage;
