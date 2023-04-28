declare const browser: typeof chrome;
var form1 = document.getElementById('form1') as HTMLFormElement;
var form2 = document.getElementById('form2') as HTMLFormElement;

var passwordField1 = document.getElementById('password-field-1') as HTMLInputElement;
var passwordField2 = document.getElementById('password-field-2') as HTMLInputElement;
var toggleSwitch = document.getElementById('toggle-switch') as HTMLInputElement;

var defaultRadio = document.getElementById('default-radio') as HTMLInputElement;
var funnyWordsRadio = document.getElementById('funny-words-radio') as HTMLInputElement;
var customPlaceholderRadio = document.getElementById('custom-placeholder-radio') as HTMLInputElement;
var customPlaceholderInput = document.getElementById('custom-placeholder-input') as HTMLInputElement;

var afterLoginSection = document.getElementById('after-login') as HTMLDivElement;
var beforeLoginSection = document.getElementById('before-login') as HTMLDivElement;
var censorOptions = document.getElementById('censor-options') as HTMLDivElement;

browser.storage.local.get("password").then((result) => {
    if(!result.password) {
        afterLoginSection.classList.add("hide");
        beforeLoginSection.classList.remove("hide");
    } else {
        afterLoginSection.classList.remove("hide");
        beforeLoginSection.classList.add("hide");
    }
})

browser.storage.local.get("toggle").then((result) => {
    if(result.toggle === "on") {
        toggleSwitch.checked = true;
    } else {
        toggleSwitch.checked = false;
    }
})

if(toggleSwitch.disabled) {
    censorOptions.classList.add("hide");
} else if(toggleSwitch.checked){
    censorOptions.classList.remove("hide");
}

browser.storage.local.get("radio").then((result) => {
    if(result.radio === "0") {
        defaultRadio.checked = true;
        funnyWordsRadio.checked = false;
        customPlaceholderRadio.checked = false;
    } else if(result.radio === "1") {
        defaultRadio.checked = false;
        funnyWordsRadio.checked = true;
        customPlaceholderRadio.checked = false;
    } else if(result.radio === "2") {
        defaultRadio.checked = false;
        funnyWordsRadio.checked = false;
        customPlaceholderRadio.checked = true;
    }
})

browser.storage.local.get("placeholder").then((result) => {
    if(result.placeholder) {
        customPlaceholderInput.value = result.placeholder;
    }
})

form1.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log('clicked1')
    if(passwordField1.value === "") return;

    browser.storage.local.set({password: passwordField1.value}).then(() => {
        afterLoginSection.classList.remove("hide");
        beforeLoginSection.classList.add("hide");
        console.log('Password stored');
    })
});

form2.addEventListener("submit", (e) => {

    e.preventDefault();
    console.log('clicked2');

    browser.storage.local.get("password").then((result) => {
        console.log(result.password)
        if(!result.password) return;

        console.log(passwordField2.value);

        if(passwordField2.value === result.password) {
            toggleSwitch.disabled = false;
            censorOptions.classList.remove("hide");
            console.log('Password matched')
            passwordField2.value = '';
        } else {
            console.log('Password not matched')
            passwordField2.value = '';
        }
    })

})

toggleSwitch.addEventListener("click", () => {

    if(toggleSwitch.disabled) return;

    console.log('toggled')

    if(toggleSwitch.checked) {
        censorOptions.classList.remove("hide");
        browser.storage.local.set({toggle: "on" }).then(() => {
            console.log('Value stored');
        });
    } else {
        censorOptions.classList.add("hide");
        browser.storage.local.set({toggle: "off"}).then(() => {
            console.log('Value stored');
        });
    }
})

defaultRadio.addEventListener("click", () => {
    if(defaultRadio.checked) {
        browser.storage.local.set({radio: "0"}).then(() => {
            console.log('Radio stored');
        });
    }
})

funnyWordsRadio.addEventListener("click", () => {
    if(funnyWordsRadio.checked) {
        browser.storage.local.set({radio: "1"}).then(() => {
            console.log('Radio stored');
        });
    }
})

customPlaceholderRadio.addEventListener("click", () => {
    if(customPlaceholderRadio.checked) {
        browser.storage.local.set({radio: "2"}).then(() => {
            console.log('Radio stored');
        });
    }
})

customPlaceholderInput.addEventListener("input", () => {
    if(customPlaceholderInput.value !== "") {
        browser.storage.local.set({placeholder: customPlaceholderInput.value}).then(() => {
            console.log('Placeholder stored');
        });
    }
})