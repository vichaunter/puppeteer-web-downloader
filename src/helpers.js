const config = require("../config");

const filterUrls = (urls) => {
  const validUrls = urls.filter((url) => {
    const regex = new RegExp(config.filter);
    return regex.test(url);
  });

  return validUrls;
};

const getPageUrls = async (page) => {
  const foundUrls = await page.evaluate(() => {
    const urls = [...document.querySelectorAll("a")].map((a) =>
      a.getAttribute("href")
    );

    return urls;
  });

  return filterUrls(foundUrls);
};

module.exports = {
    filterUrls,
    getPageUrls
}