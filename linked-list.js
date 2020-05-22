const Item = require('./item');

// This is a Linked List implementation that is always sorted in the 
// decending order and that maintains the constant number of items(nodes)
module.exports = class SortedLinkedList {
    head;
    MAX;
    count;

    constructor(max) {
        this.head = null;
        this.MAX = max;
        this.count = 0;
    }

    // Places the new item in the appropriate position of the sorted Linked List  
    push(word) {

        let currentNode = this.head;
        let previousNode = null;
        let newNode = new Item(word);
        newNode.next = null;

        while (true) {
            if (currentNode == null) {
                // end reached
                if (previousNode == null) {
                    // add first
                    this.head = newNode;
                }
                else {
                    // add to the end
                    previousNode.next = newNode;
                }
                this.count++;
                break;
            }
            else if (word.occurence >= currentNode.data.occurence) {
                if (previousNode == null) {
                    // add to the top
                    newNode.next = currentNode;
                    this.head = newNode;
                }
                else {
                    // add to the mid
                    previousNode.next = newNode;
                    newNode.next = currentNode;
                }
                this.count++;
                break;
            }
            else {
                previousNode = currentNode;
                currentNode = currentNode.next;
            }
        }

        if (this.count > this.MAX) {
            // The total number of items have exceeded the max. Removing the last item
            this.removeLastNode();
        }
    }

    // Removes the last item
    removeLastNode() {
        let currentNode = this.head;

        while (currentNode.next.next != null) {
            currentNode = currentNode.next;
        }
        currentNode.next = null;
        this.count--;
    }

    // Converts the sorted linked list into sorted array
    toArray() {
        let currentNode = this.head;
        let newArray = [];
        while (currentNode != null) {
            newArray.push(currentNode.data);
            currentNode = currentNode.next;
        }
        return newArray;
    }
}