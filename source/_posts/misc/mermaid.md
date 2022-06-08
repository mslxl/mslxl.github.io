---
title: Render mermaid diagrams by puppeteer in Hexo
tags:
  - Misc
  - Mermaid
  - Hexo
mermaid: true
abbrlink: ac3de20f
date: 2019-1-31 00:00:00
---

There are some thing wrong with my input method so I had to speak English in this passage that means in this passage, You will see:
* Poor English
* Meaningless Code
* Chemical reaction flow chart
* ~~AD~~

Now I can [render mermaid diagrams by puppeteer](https://github.com/mslxl/hexo-mermaid-diagrams).

For example:

{% mermaid %}
graph TD
    Na[Na] -->|O2| Na2O[Na2O]
    Na2O -->|O2| Na2O2[Na2O2]
    Na -->|O2| Na2O2
    Na -->|Cl2, Fire| NaCl[NaCl]
    Na2O -->|H2O| NaOH[NaOH]
    Na -->|H2O| NaOH
    NaOH -->|CO2| Na2CO3[Na2CO3]
    Na2HCO3[Na2HCO3] -->|Heat| Na2CO3
    Na2CO3 -->|CO2| Na2HCO3
    Na2CO3 --> NaOH
    NaOH -->|HCl| NaCl
    Na2HCO3 -->|HCl| NaCl
    Na2O2 -->|H2O| NaOH
    Na -->|S| Na2S[Na2S]
    NaCl -->|H2O| NaOH
    NaCl -->|NH3, H2O, CO2| Na2HCO3
{% endmermaid %}

The source about above:

```raw
graph TD
    Na[Na] -->|O2| Na2O[Na2O]
    Na2O -->|O2| Na2O2[Na2O2]
    Na -->|O2| Na2O2
    Na -->|Cl2, Fire| NaCl[NaCl]
    Na2O -->|H2O| NaOH[NaOH]
    Na -->|H2O| NaOH
    NaOH -->|CO2| Na2CO3[Na2CO3]
    Na2HCO3[Na2HCO3] -->|Heat| Na2CO3
    Na2CO3 -->|CO2| Na2HCO3
    Na2CO3 --> NaOH
    NaOH -->|HCl| NaCl
    Na2HCO3 -->|HCl| NaCl
    Na2O2 -->|H2O| NaOH
    Na -->|S| Na2S[Na2S]
    NaCl -->|H2O| NaOH
    NaCl -->|NH3, H2O, CO2| Na2HCO3
```


Puppeteer is so interesting!

Some key code:
```javascript
const path = require('path');
const puppeteer = require('puppeteer');

let browser = await puppeteer.launch(hexo.config.mermaid.puppeteerConfig);

const page = await browser.newPage();
page.setViewport(hexo.config.mermaid.defaultViewport);
await page.goto(`file://${path.join(__dirname, 'index.html')}`);
await page.evaluate(`document.body.style.background = '${hexo.config.mermaid.backgroundColor}'`);

//TODO
let mermaidConfig = { 
    theme:hexo.config.mermaid.theme
};
let css;
await page.$eval('#container', (container, definition, mermaidConfig, css) => {
    container.innerHTML = definition;
    window.mermaid.initialize(mermaidConfig);
    window.mermaid.init(undefined, container);
}, content, mermaidConfig, css);
const svg = await page.$eval('#container', container => container.innerHTML);
```