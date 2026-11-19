# Censorify Chrome Extension

![Logo](./assets/logo.png)

Censorify is a free and easy-to-use content censoring tool. 

## Key Features

⋆ Available on popular browsers such as Chrome, Firefox, Brave and Edge

⋆ Censors english swear words on your webpage

⋆ Choose a custom placeholder (use emojis to make it more fun)

⋆ Choose to replace swear words by funny words instead!

⋆ Easy access via shortcut Ctrl/Cmd + Shift + K

⋆ Password enabled

## Preview

![Image1](./assets/default-preview.gif)

![Image2](./assets/funny-preview.png)


## Extension

[Chrome Extension](https://chrome.google.com/webstore/detail/censorify/efchgkadcglilfcdbgpolinhieeabjlc?hl=en&authuser=0)

[Firefox Extension](https://addons.mozilla.org/en-US/firefox/addon/censorify/)

[Brave Extension](https://chrome.google.com/webstore/detail/censorify/efchgkadcglilfcdbgpolinhieeabjlc?hl=en&authuser=0)

[Edge Extension](https://microsoftedge.microsoft.com/addons/detail/censorify/fpjmpnneglldlohfngljdfkhjclliaeb)

⭐ this repo, leave a review and rating if you like it (or if it made you laugh xD)!

## Development

One codebase builds for every browser. `dist/chromium` is used for Chrome, Brave and Edge, and `dist/firefox` for Firefox.

```bash
npm ci
npm run typecheck
npm run build      # dist/chromium and dist/firefox
npm run package    # store zips and a source zip in builds/
```

To try a build locally:

- Chrome / Brave / Edge: open `chrome://extensions` (or `edge://extensions`), turn on Developer mode, Load unpacked → `dist/chromium`
- Firefox: open `about:debugging` → This Firefox → Load Temporary Add-on → `dist/firefox/manifest.json`

## Releasing

1. Bump `version` in `manifest.json` and merge to master.
2. Tag it: `git tag v1.2.0 && git push origin v1.2.0`
3. CI builds everything and attaches `censorify-{chrome,edge,firefox,source}-1.2.0.zip` to a GitHub Release. Upload each zip to its store. AMO also asks for the source zip.

Every PR and master build also uploads the zips as workflow artifacts.

## License

MIT © [Ninad Sutrave](https://ninadsutrave.in)
