// npx browserify content.ts -p [ tsify --noImplicitAny ] -o bundle.js
// npx browserify popup.ts -p [ tsify --noImplicitAny ] -o bundle.js

declare const browser: typeof chrome;
var filter = require('bad-words');
var funnywords = require('./data/funnywords.js')
var Filter = new filter();
var skipTags: string[] = ['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'INPUT'];

var radio: string;
var placeholder: string;
var toggle: string;

const mutationObserver = () => {
	var observerConfig = {
    childList: true,
    characterData: true,
    subtree: true
  };

  var observer = new MutationObserver((mutations: MutationRecord[]) => {
    mutations.forEach((mutation: MutationRecord) => {
      if (mutation.type === 'characterData') {
        censorText(mutation.target);
      } else {
        mutation.addedNodes.forEach((node: Node) => censorText(node));
      }
    });
  });

  observer.observe(document, observerConfig);
}

const isEditableField = (node: Node) => {
  var parent = node.parentElement;
  return !parent || parent.isContentEditable || skipTags.includes(parent.tagName);
}

const replaceWord = (word: string) => {
  if(radio === "1") {
    return funnywords[Math.floor(Math.random()*funnywords.length)];
  } else if(radio === "2") {
    return placeholder.repeat(Filter.replaceWord(word).length);
  }
  return Filter.replaceWord(word);
}

const censorTextNode = (textNode: Text) => {
  if (isEditableField(textNode) || textNode.data.trim() === "") return;

  var content: string = textNode.data
    .split(Filter.splitRegex)
    .map((word: string) => Filter.isProfane(word) ? replaceWord(word) : word)
    .join('');

  if(content !== textNode.data) {
    textNode.data = content;
  }
}

const censorText = (node: Node) => {
  if (node.nodeType === Node.TEXT_NODE) {
    censorTextNode(node as Text);
    return;
  }

  var walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    censorTextNode(walker.currentNode as Text);
  }
}

const censorPage = () => {
  if(toggle === "on") {
    censorText(document);
    mutationObserver();
  }
}

browser.storage.local.get(["radio", "placeholder", "toggle", "blockList", "allowList"]).then((result) => {
  radio = result.radio;
  placeholder = (result.placeholder)?result.placeholder:'';
  toggle = result.toggle;
  if(result.blockList) Filter.addWords(...result.blockList);
  if(result.allowList) Filter.removeWords(...result.allowList);
  censorPage();
})
