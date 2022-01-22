// save as index.js
// npm install https://github.com/GoogleChrome/puppeteer/
// node index.js URL
const puppeteer = require("puppeteer");
const fse = require("fs-extra");
const path = require("path");
const config = require("../config");
const { getPageUrls } = require("./helpers");
const { restoreSaved, addToSaved, addToQueue, shiftQueue } = require("./store");

const extractContent = async (page, url) => {
  await page.goto(url, { waitUntil: "networkidle2" }); //load

  const urls = await getPageUrls(page);

  // fs.writeFileSync('contenders.json', JSON.stringify(exported))
  const html = await page.content();
  const fileNameFromUrl = url.replace(/[^a-z0-9-\/]/gi, "_").replace(/\/$/, "");
  const fullFilePath = `${config.rootFolder}/${fileNameFromUrl}.html`;
  await fse.outputFile(fullFilePath, html);

  if (config.saveImages) {
    await page.screenshot({
      path: `${config.rootFolder}/${fileNameFromUrl}.png`,
      fullPage: true,
    });
  }

  addToSaved(url);

  addToQueue(urls);

  try {
    const nextUrl = shiftQueue();
    await extractContent(page, nextUrl);
  } catch (e) {
    console.log("no links here");
  }
};

const start = async () => {
  const {
    loginUser,
    loginPass,
    evalLoginInput,
    evalPassInput,
    startUrl,
    loginUrl,
  } = config;

  if (config.persistSession) {
    fse.createFileSync("./tmp/session/.empty", "");
    puppeteer.launch({ userDataDir: "./tmp/session" });
  }
  const browser = await puppeteer.launch({ headless: false });
  // use tor
  //const browser = await puppeteer.launch({args:['--proxy-server=socks5://127.0.0.1:9050']});
  const page = await browser.newPage();
  await page.setViewport(config.resolution);

  // TODO: saving responses will throw error on missing body .buffer()
  if (config.saveAssets) {
    page.on("response", async (response) => {
      if (response.request().resourceType() === "image") {
        try {
          const file = await response.buffer();
          if(!file) return
          // buffer && buffer.then((file) => {
            let fileName = path.basename(response.request().url());
            //write only files with valid fileName (too long, invalid chars, etc)
            if (fileName.length < 255 && /@"^[\w\-._ ]+$"/.test(fileName)) {
              fse.createFileSync(`${config.rootFolder}/assets/${fileName}`);
              const wStream = fse.createWriteStream(
                `${config.rootFolder}/assets/${fileName}`
              );
              wStream.write(file);
            }
          // });
        } catch (e) {}
      }
    });
  }

  if (loginUrl && evalLoginInput && evalPassInput && loginUser && loginPass) {
    await page.goto(loginUrl, { waitUntil: "load" });

    await page.content();

    await page.$eval(
      evalLoginInput,
      (el, loginUser) => (el.value = loginUser),
      loginUser
    );
    await page.$eval(
      evalPassInput,
      (el, loginPass) => (el.value = loginPass),
      loginPass
    );

    await page.click(config.evalSendFormInput);
    await page.waitForNavigation();
  }

  await restoreSaved();

  await extractContent(page, startUrl);

  browser.close();
};

start();
