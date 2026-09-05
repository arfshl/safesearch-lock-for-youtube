// Interface for both chromium and firefox
// So that 1 background.js file can be used for both browsers
const API = typeof browser !== "undefined" ? browser : chrome;

// Rule ID for the YouTube restriction rule
const RULE_ID = 1;

// Target URLs for request header modifications
const DOMAINS = [
    "www.youtube.com",
    "m.youtube.com",  
    "youtubei.googleapis.com",
    "youtube.googleapis.com",
    "www.youtube-nocookie.com"
];

//  Build rule function
function buildRules() {
    const rules = [];

// ID for DNR Rules (1 + length)
    for (const domain of DOMAINS) {
        rules.push({
            id: RULE_ID + rules.length,
            priority: 100,

            action: {
                type: "modifyHeaders",

                requestHeaders: [
                    {
                        header: "YouTube-Restrict",
                        operation: "set",
                        value: "Strict"
                    }
                ]
            },
            
// only apply in youtube and googleapis domains
            condition: {
                urlFilter: `||${domain}/`,

// put HTTP header in this type of requests:
                resourceTypes: [
                    "main_frame",
                    "sub_frame",
                    "xmlhttprequest",
                    "script",
                    "ping"
                ]
            }
        });
    }

    return rules;
}


// Function to update the dynamic rules for the extension
async function updateRules() {
    const existingRules =
        await API.declarativeNetRequest.getDynamicRules();

    const newRules = buildRules();

    // Remove all rules managed by this module.
    const removeRuleIds =
        existingRules
            .filter(
                rule =>
                    rule.id >= RULE_ID &&
                    rule.id < RULE_ID + DOMAINS.length
            )
            .map(rule => rule.id);

    // Replace the old rules with the current rules.
    await API.declarativeNetRequest.updateDynamicRules({
        removeRuleIds,
        addRules: newRules
    });
}

// Initialize the extension by updating the rules
async function init() {
    await updateRules();
}

// Call the init function and catch any errors that occur during initialization
init().catch(error => {
    console.error(
        "SafeSearch Lock for YouTube initialization failed:",
        error
    );
});

// Listen for the onInstalled event to update the rules when the extension is installed or updated
API.runtime.onInstalled.addListener(details => {
    if (
        details.reason !== "install" &&
        details.reason !== "update"
    ) {
        return;
    }
// Update the rules when the extension is installed or updated
    updateRules().catch(error => {
        console.error(
            "Failed to update YouTube restriction rule:",
            error
        );
    });
});