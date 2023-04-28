// npx browserify content.ts -p [ tsify --noImplicitAny ] -o bundle.js
// npx browserify popup.ts -p [ tsify --noImplicitAny ] -o bundle.js

declare const browser: typeof chrome;
var filter = require('bad-words');
var funnywords = require('./data/funnywords.js')
var xpathDocText: string = '//*[not(self::script or self::style)]/text()[normalize-space(.) != ""]';
var xpathNodeText: string = './/*[not(self::script or self::style)]/text()[normalize-space(.) != ""]';

var radio: string;
var placeholder: string;
var toggle: string;

const mutationObserver = () => {
	var observerConfig = {
    childList: true,
    subtree: true
  };

  var observer = new MutationObserver((mutations: MutationRecord[]) => {
    mutations.forEach((mutation: MutationRecord) => {
      filterUpdatedDOM(mutation);
    });
  });

  observer.observe(document, observerConfig);
}

const filterUpdatedDOM = (mutation: MutationRecord) => {
  mutation.addedNodes.forEach((node: any) => {
    if (!isEditableField(node)) {
      censorText(xpathNodeText, node);
    }
  });
}

const isEditableField= (node: any) => { 
    return node.isContentEditable || (node.parentNode && node.parentNode.isContentEditable) || 
    (node.tagName && (node.tagName.toLowerCase() == "textarea" || 
                      node.tagName.toLowerCase() == "input" ||
                      node.tagName.toLowerCase() == "script" ||
                      node.tagName.toLowerCase() == "style")
    );
}

const censorText = (xpathExpression: string, node?: any) => {

  var Filter = new filter();

  node = (typeof node !== 'undefined') ?  node : document;
  var evalResult: XPathResult = document.evaluate(
    xpathExpression,
    node,
    null,
    XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
    null
  );

  for (var i = 0; i < evalResult.snapshotLength; ++i) {
    var textNode: any = evalResult.snapshotItem(i);
    var content: string = Filter.clean(textNode.data);

    if(content === textNode.data) continue;

    if(radio === "1") {
      content = content.replace(/\*+/g, '*');
      while(true) {
        var temp = content.replace("*", funnywords[Math.floor(Math.random()*60)]);
        if(temp === content) break;
        content = temp;
      }
    } else if(radio === "2") {
      while(true) {
        var temp = content.replace("*", placeholder);
        if(temp === content) break;
        content = temp;
      }
    }
    textNode.data = content;
  }

}

const censorPage = () => {
  console.log(toggle, placeholder, radio);
  if(toggle === "on") {
    censorText(xpathDocText);
    mutationObserver();
  }
}

browser.storage.local.get("radio").then((result1) => {
  browser.storage.local.get("placeholder").then((result2) => {
    browser.storage.local.get("toggle").then((result3) => {
      radio = result1.radio;
      placeholder = (result2.placeholder)?result2.placeholder:'';
      toggle = result3.toggle;
      censorPage();
    })
  })
})