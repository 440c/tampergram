// ==UserScript==
// @name         Tampergram
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Replaces specific text on Instagram and changes the link without redirecting, while preserving buttons
// @author       kiwiderp
// @match        https://www.instagram.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // The first string input is your *username.
    // The second is the one you want to change it to. (local only).
    const textReplacements = {
        '': '',
    };

    // -- Not created by ozu
    function replaceTextNodes(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            for (const [oldText, newText] of Object.entries(textReplacements)) {
                if (node.nodeValue.includes(oldText)) {
                    node.nodeValue = node.nodeValue.replace(new RegExp(oldText, 'g'), newText);
                }
            }
        } else {
            node.childNodes.forEach(replaceTextNodes);
        }
    }

    // -- Created by ozu
    function updateURL(newText) {
        const baseURL = 'https://www.instagram.com/';
        const newURL = baseURL + newText;
        const oldURL = baseURL + newURL;

        window.history.replaceState({ path: newURL }, '', newURL)
        sessionStorage.setItem('oldURL', oldURL);
    }
    
    // -- Created by ozu
    function replaceContent() {
        replaceTextNodes(document.body);
        for (const [oldText, newText] of Object.entries(textReplacements)) {
            const regex = new RegExp(oldText, 'g');
            const pathName = window.location.pathname;

            if (regex.test(pathName)) {
                updateURL(newText);
                break;
            }
        }
    }


    const observer = new MutationObserver(() => replaceContent());
    observer.observe(document.body, { childList: true, subtree: true });
    replaceContent();
})();
