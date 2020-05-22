// This represents a word in the content and its properties
module.exports = class Word {
    text;
    occurence;
    pos;
    synonyms;

    constructor(text) {
        this.text = text;
        this.occurence = 1; // Default occurence is 1
        this.synonyms = [];
    }
}