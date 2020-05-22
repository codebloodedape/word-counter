'use strict';
// TODO add feature to ignore certain words like that, from, etc.

const fs = require('fs');
const http = require('http');
const request = require('request');
const Word = require('./word');
const SortedLinkedList = require('./linked-list');

let config;

try {
    console.log("Reading configuration...");
    config = JSON.parse(fs.readFileSync('config.json'));
    start();
}
catch (err) {
    console.log("Could not read configuration.");
    console.log(err.message);
}

// This method starts fetching the content and invokes handleData() method on completion
function start() {
    try {
        console.log("Fetching content...")
        http.get(config.data, (resp) => {
            let data = '';
            resp.on('data', (chunk) => {
                data += chunk;
            });
            resp.on('end', () => {
                handleData(data);
            });
        
        }).on("error", (err) => {
            console.log("Couldn't fetch content.");
            console.log("Error: " + err.message);
        });
    }
    catch (err) {
        console.log("Unhandled exception occured.");
        console.log(err.message);
    }
}

// This method takes care of the complete workflow
async function handleData(data) {
    let result =  await updateWordInfo(await getHighlyOccuringWords(data));
    WriteJsonToFile(result, config.resultFileName);
}


// This method process the content to find the highly occuring words in the content
async function getHighlyOccuringWords(data) {
    console.log("Finding highly occuring words in the content...");
    let currenIndex = 0;
    let lastIndex;

    data = data.trim();
    lastIndex = data.length;

    let text = '';
    let words = [];

    // Iterating character by character
    while (currenIndex !== lastIndex) {
        let currentCharacter = data[currenIndex];
        if (config.seperators.indexOf(currentCharacter) === -1) {
            text += currentCharacter.toUpperCase();
        }
        else {
            // Seperator encountered. Adding the word if it is longer than the configured minimum word length 
            if (text.length >= config.minWordLength) {
                let wordFound = false;
                for (let i = 0; i < words.length - 1; i++) {
                    if (words[i].text === text) {
                        // This word is already present in the array of words, updating the occurence count.
                        words[i].occurence++;
                        wordFound = true;
                        break;
                    }
                }
                if (!wordFound) {
                    // New word. Creating a word object whose occurence count is by default 1
                    words.push(new Word(text));
                }
            }
            text = '';
        }
        currenIndex++;
    }

    // Usage of linked list makes sure the order of words is sorted and only contains configured maximum number of words 
    let linkedList = new SortedLinkedList(config.maxWords);
    words.forEach((word) => {
        linkedList.push(word);
    });

    words = [];

    // This method returns converts linked list to array for easier use ahead
    return linkedList.toArray();
}

// This method fetches the POS and synonyms of the shortlisted words.
async function updateWordInfo(words) {
    console.log("Fetching more information from " + config.dictionaryAPI + "...");
    let url = config.dictionaryAPI + "?lang=" + config.language + "&key=" + config.key;
    for (let i = 0; i < words.length; i++) {
        let body = await getAsync(url + "&text=" + words[i].text);
        let res = JSON.parse(body);
        if (res.def.length > 0) {
            words[i].pos = res.def[0].pos;
            if (res.def[0].tr && res.def[0].tr.length > 0) {
                for (let j = 0; j < res.def[0].tr.length; j++) {
                    if (res.def[0].tr[j].syn && res.def[0].tr[j].syn.length > 0) {
                        for (let k = 0; k < res.def[0].tr[j].syn.length; k++) {
                            words[i].synonyms.push(res.def[0].tr[j].syn[k].text);
                        }
                    }
                }
            }
        }
    }
    return words;
}

// Makes GET request asynchonously
function getAsync(url) {
    return new Promise((resolve, reject) => {
        request(url, (error, response, body) => {
            if (error) reject(error);
            if (response.statusCode != 200) {
                reject('Invalid status code <' + response.statusCode + '>');
            }
            resolve(body);
        });
    });
}

// Write the resultant object in a local file of the configured name
function WriteJsonToFile(data, fileName) {
    console.log("Writing result to local file...");
    fs.writeFile(fileName + ".json", JSON.stringify(data, null, 4), (err) => {
        if (err) throw err;
        console.log('Process complete. Open ' + fileName + ".json for result.");
    });
}