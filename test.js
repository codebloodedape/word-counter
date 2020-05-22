'use strict';

const SortedLinkedList = require('./linked-list');
const Word = require('./word');

// let w = new Word("");
// w.run();

let ll = new SortedLinkedList(3);
let word;

ll.print();
word = new Word("");
word.occurence = 1
ll.push(word);

ll.print();
word = new Word("");
word.occurence = 2
ll.push(word);

ll.print();
word = new Word("");
word.occurence = 4
ll.push(word);

ll.print();
word = new Word("");
word.occurence = 3
ll.push(word);

ll.print();
word = new Word("");
word.occurence = 0
ll.push(word);