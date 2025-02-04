var app = {};

// Looks like the specific Referrer header value: https://t.co/JV5396gd2O is blocked
// In order to bypass this, generate "random" header values
// Pick a random number between 1 and 2
// Convert to Base 36 (so it should be alphanumeric)
// Get first 10 characters after decimal
app.generateReferrer = function () {
  var linkId = (1 + Math.random()).toString(36).substring(2, 12);
  return `https://t.co/${linkId}`;
}

// Modify the referer to twitter
app.modifyHeaders = function (details) {
  var newRef = app.generateReferrer();
  var refExists = false;
  for (var n in details.requestHeaders) {
    refExists = details.requestHeaders[n].name.toLowerCase() == "referer";
    if (refExists) {
      details.requestHeaders[n].value = newRef;
      break;
    }
  }
  if (!refExists) {
    details.requestHeaders.push({ name: "Referer", value: newRef });
  }
  return { requestHeaders: details.requestHeaders };
}

// Modify network requests
chrome.webRequest.onBeforeSendHeaders.addListener(
  app.modifyHeaders,
  {
    urls: [
      '*://*.medium.com/*',
      '*://writingcooperative.com/*',
      '*://psiloveyou.xyz/*',
      '*://uxplanet.org/*',
      '*://towardsdatascience.com/*',
      '*://codeburst.io/*',
      '*://*.gitconnected.com/*',
    ]
  },
  [
    'blocking',
    'requestHeaders',
    'extraHeaders'
  ]
);
