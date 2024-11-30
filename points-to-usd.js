// ==UserScript==
// @name         Non-misleading prices for PoE
// @namespace    https://github.com/arturino009/poe-points-to-usd
// @version      0.1
// @description  Converts all point values to actual prices in the PoE website
// @author       arturino009
// @match        https://www.pathofexile.com/*
// @match        https://pathofexile2.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pathofexile.com
// @updateURL    https://raw.githubusercontent.com/arturino009/poe-points-to-usd/main/points-to-usd.js
// @downloadURL  https://raw.githubusercontent.com/arturino009/poe-points-to-usd/main/points-to-usd.js
// ==/UserScript==

(function() {
    'use strict';

    // List of classes to process
    const classesToProcess = ['amount', 'price', 'totalCost', 'savings', 'savingsInfo', 'item-cost', 'coin-icon', 'cost', 'original-cost', 'account-bar__points-balance', 'points-banner'];

    // Function to convert numbers to dollar format
    function convertToDollar(text) {
        return text.replace(/\b(\d{1,3}(?:,\d{3})*|\d+)\b/g, (match, p1) => {
            // Remove commas and convert the number to a float
            const num = parseInt(p1.replace(/,/g, ''), 10) / 10;
            // Format to two decimal places
            return `$${num.toFixed(2)}`;
        });
    }

    // Function to process elements with specified classes
    function processElements() {
        classesToProcess.forEach(className => {
            const parents = document.querySelectorAll(`.${className}`);
            parents.forEach(parent => {
                // Process the parent's own text content (only modify text nodes, no structure change)
                if (parent.childNodes.length > 0) {
                    parent.childNodes.forEach(child => {
                        if (child.nodeType === 3 && !child.textContent.includes('$')) {
                            // Process text nodes (numeric values) and modify them
                            child.textContent = convertToDollar(child.textContent);
                        }
                    });
                    parent.dataset.processed = true; // Mark the parent as processed
                }

                // Find all child elements and process their text content (text nodes only)
                const childNodes = parent.querySelectorAll('*');
                childNodes.forEach(child => {
                    if (child.innerHTML && !child.innerHTML.includes('$') && !child.dataset.processed) {
                        // Again, we replace the number part of the child's text content
                        child.innerHTML = child.innerHTML.replace(/\b(\d{1,3}(?:,\d{3})*|\d+)\b/g, (match, p1) => {
                            return convertToDollar(p1);
                        });
                        child.dataset.processed = true; // Mark as processed
                    }
                });
            });
        });
    }

    // Run initial processing on page load
    processElements();

    // Use MutationObserver to monitor for dynamically added elements
    const observer = new MutationObserver(() => {
        processElements();
    });

    // Observe the entire document for changes
    observer.observe(document.body, { childList: true, subtree: true });
})();

