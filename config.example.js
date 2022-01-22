//copy to config.js

module.exports = {
  // root folder where to store the extracted files
  rootFolder: "web",
  // if save any type of assets configured use this as root folder
  assetsFolder: "assets",
  // first url, if login is defined will go to this url before to start crawling
  startUrl: "https://www.webtodownload.com/",
  // if login required this group of parameters is mandatory
  loginUrl: "https://www.webtodownload.com/login/",
  loginUser: "username",
  loginPass: "pass",
  evalLoginInput: "input[name=login]", // match for login input, you can use jquery
  evalPassInput: "input[name=password]", // match for password input, you can use jquery
  evalSendFormInput: 'input[name="wp-submit"]', // match for the form sending button, you can use jquery
  // save full page screenshots next to the html files
  saveScreenshots: true,
  // save all images in assets folder
  saveImages: true,
  // restrict urls to this pattern (like this all subdomains will be considered as valid)
  filter: "(webtodownload.com)",
  // regex to ignore
  ignore: "(wp-login|logout)",
  resolution: {
    width: 1366,
    height: 900,
  },
  // save all image and media in assets rootFolder/assets
  saveAssets: true,
  // persist browser cache between sessions (if you don't want to login each time)
  persistSession: true,
};
