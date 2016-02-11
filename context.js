var search = {
    "id": "SearchActors",
    "title": "Search for Selected Actor.",
    "contexts": ["selection"]
}
chrome.contextMenus.create(search);
chrome.contextMenus.onClicked.addListener(function (data) {

    if (data.menuItemId == "SearchActors" && data.selectionText) {
        chrome.storage.sync.set({ 'actor': data.selectionText });
    }
});
chrome.storage.onChanged.addListener(function (changes) {
    chrome.browserAction.setBadgeText({ "text": "!" });
});

