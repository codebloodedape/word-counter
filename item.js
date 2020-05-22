// This represents the a node(item) of the linked list. 
// It contains the word object(data)
module.exports = class Item {
    data;
    next;

    constructor(word) {
        this.data = word;
        this.next = null;
    }
}