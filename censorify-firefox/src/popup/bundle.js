(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var form1 = document.getElementById('form1');
var form2 = document.getElementById('form2');
var passwordField1 = document.getElementById('password-field-1');
var passwordField2 = document.getElementById('password-field-2');
var toggleSwitch = document.getElementById('toggle-switch');
var defaultRadio = document.getElementById('default-radio');
var funnyWordsRadio = document.getElementById('funny-words-radio');
var customPlaceholderRadio = document.getElementById('custom-placeholder-radio');
var customPlaceholderInput = document.getElementById('custom-placeholder-input');
var afterLoginSection = document.getElementById('after-login');
var beforeLoginSection = document.getElementById('before-login');
var censorOptions = document.getElementById('censor-options');
browser.storage.local.get("password").then(function (result) {
    if (!result.password) {
        afterLoginSection.classList.add("hide");
        beforeLoginSection.classList.remove("hide");
    }
    else {
        afterLoginSection.classList.remove("hide");
        beforeLoginSection.classList.add("hide");
    }
});
browser.storage.local.get("toggle").then(function (result) {
    if (result.toggle === "on") {
        toggleSwitch.checked = true;
    }
    else {
        toggleSwitch.checked = false;
    }
});
if (toggleSwitch.disabled) {
    censorOptions.classList.add("hide");
}
else if (toggleSwitch.checked) {
    censorOptions.classList.remove("hide");
}
browser.storage.local.get("radio").then(function (result) {
    if (result.radio === "0") {
        defaultRadio.checked = true;
        funnyWordsRadio.checked = false;
        customPlaceholderRadio.checked = false;
    }
    else if (result.radio === "1") {
        defaultRadio.checked = false;
        funnyWordsRadio.checked = true;
        customPlaceholderRadio.checked = false;
    }
    else if (result.radio === "2") {
        defaultRadio.checked = false;
        funnyWordsRadio.checked = false;
        customPlaceholderRadio.checked = true;
    }
});
browser.storage.local.get("placeholder").then(function (result) {
    if (result.placeholder) {
        customPlaceholderInput.value = result.placeholder;
    }
});
form1.addEventListener("submit", function (e) {
    e.preventDefault();
    console.log('clicked1');
    if (passwordField1.value === "")
        return;
    browser.storage.local.set({ password: passwordField1.value }).then(function () {
        afterLoginSection.classList.remove("hide");
        beforeLoginSection.classList.add("hide");
        console.log('Password stored');
    });
});
form2.addEventListener("submit", function (e) {
    e.preventDefault();
    console.log('clicked2');
    browser.storage.local.get("password").then(function (result) {
        console.log(result.password);
        if (!result.password)
            return;
        console.log(passwordField2.value);
        if (passwordField2.value === result.password) {
            toggleSwitch.disabled = false;
            censorOptions.classList.remove("hide");
            console.log('Password matched');
            passwordField2.value = '';
        }
        else {
            console.log('Password not matched');
            passwordField2.value = '';
        }
    });
});
toggleSwitch.addEventListener("click", function () {
    if (toggleSwitch.disabled)
        return;
    console.log('toggled');
    if (toggleSwitch.checked) {
        censorOptions.classList.remove("hide");
        browser.storage.local.set({ toggle: "on" }).then(function () {
            console.log('Value stored');
        });
    }
    else {
        censorOptions.classList.add("hide");
        browser.storage.local.set({ toggle: "off" }).then(function () {
            console.log('Value stored');
        });
    }
});
defaultRadio.addEventListener("click", function () {
    if (defaultRadio.checked) {
        browser.storage.local.set({ radio: "0" }).then(function () {
            console.log('Radio stored');
        });
    }
});
funnyWordsRadio.addEventListener("click", function () {
    if (funnyWordsRadio.checked) {
        browser.storage.local.set({ radio: "1" }).then(function () {
            console.log('Radio stored');
        });
    }
});
customPlaceholderRadio.addEventListener("click", function () {
    if (customPlaceholderRadio.checked) {
        browser.storage.local.set({ radio: "2" }).then(function () {
            console.log('Radio stored');
        });
    }
});
customPlaceholderInput.addEventListener("input", function () {
    if (customPlaceholderInput.value !== "") {
        browser.storage.local.set({ placeholder: customPlaceholderInput.value }).then(function () {
            console.log('Placeholder stored');
        });
    }
});

},{}]},{},[1]);
