if(!self.define){let e,s={};const c=(c,i)=>(c=new URL(c+".js",i).href,s[c]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=c,e.onload=s,document.head.appendChild(e)}else e=c,importScripts(c),s()})).then((()=>{let e=s[c];if(!e)throw new Error(`Module ${c} didn’t register its module`);return e})));self.define=(i,f)=>{const a=e||("document"in self?document.currentScript.src:"")||location.href;if(s[a])return;let n={};const r=e=>c(e,a),o={module:{uri:a},exports:n,require:r};s[a]=Promise.all(i.map((e=>o[e]||r(e)))).then((e=>(f(...e),n)))}}define(["./workbox-37fde244"],(function(e){"use strict";e.setCacheNameDetails({prefix:"front"}),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"android-chrome-192x192.png",revision:"946bf39982d17b2d6a857d5e44b090d5"},{url:"android-chrome-512x512.png",revision:"6f0fa42e158bcf63c191ed1bb7dc15bc"},{url:"apple-touch-icon.png",revision:"b12ae80bacbec8919cc4b06430823c74"},{url:"assets/axios.61fb82af.js",revision:"1e6b04367c98fc4417e646861388b611"},{url:"assets/BPS.296fab04.png",revision:"0bd38a95e1d5f17bb9501193db72e2a5"},{url:"assets/ErrorNotFound.cf899e88.js",revision:"9fd13f60b637854fb139576e9b4e6f21"},{url:"assets/fa-brands-400.232c6f6a.woff2",revision:"b55b1345f0b919f0cab774ec25d6654e"},{url:"assets/fa-brands-400.e28096fa.ttf",revision:"b7dee83cb5ee2c47b053e2620f4bbb78"},{url:"assets/fa-regular-400.9174757e.ttf",revision:"3c264849ff4eb9b6e99eab9cd54c80ae"},{url:"assets/fa-regular-400.c27da6f8.woff2",revision:"aa7c5fa494807f7a9ec907defee083e8"},{url:"assets/fa-solid-900.ae17c16a.woff2",revision:"1ec0ba058c021acf7feaa18081445d63"},{url:"assets/fa-solid-900.b4990d0d.ttf",revision:"0a95f951745ba02faa8773ea6a1ebaed"},{url:"assets/fa-v4compatibility.c7a869fa.woff2",revision:"fdb652dcc200dd23b8b8040176858c36"},{url:"assets/fa-v4compatibility.ff8f525f.ttf",revision:"95b97efa98f9e3fb869bc9634c43a0cc"},{url:"assets/flUhRq6tzZclQEJ-Vdg-IuiaDsNa.fd84f88b.woff",revision:"3e1afe59fa075c9e04c436606b77f640"},{url:"assets/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.4a4dbc62.woff2",revision:"a4160421d2605545f69a4cd6cd642902"},{url:"assets/index.704ab825.js",revision:"f45eb3539b406caa0727f8055d18b9cb"},{url:"assets/index.7dab83ce.css",revision:"82386de21765e3f211c2597859bc1bc4"},{url:"assets/IndexPage.42af4b26.js",revision:"67b11caa3670bc6607b11333ca0ce492"},{url:"assets/IndexPage.5169f1e7.css",revision:"e9f462685ac17670638bb820071c4bea"},{url:"assets/KFOkCnqEu92Fr1MmgVxIIzQ.34e9582c.woff",revision:"4aa2e69855e3b83110a251c47fdd05fc"},{url:"assets/KFOlCnqEu92Fr1MmEU9fBBc-.9ce7f3ac.woff",revision:"40bcb2b8cc5ed94c4c21d06128e0e532"},{url:"assets/KFOlCnqEu92Fr1MmSU5fBBc-.bf14c7d7.woff",revision:"ea60988be8d6faebb4bc2a55b1f76e22"},{url:"assets/KFOlCnqEu92Fr1MmWUlfBBc-.e0fd57c0.woff",revision:"0774a8b7ca338dc1aba5a0ec8f2b9454"},{url:"assets/KFOlCnqEu92Fr1MmYUtfBBc-.f6537e32.woff",revision:"bcb7c7e2499a055f0e2f93203bdb282b"},{url:"assets/KFOmCnqEu92Fr1Mu4mxM.f2abf7fb.woff",revision:"d3907d0ccd03b1134c24d3bcaf05b698"},{url:"assets/MainLayout.64523c38.js",revision:"f0598e0c7732e24b6e4adfd4d421408c"},{url:"assets/MainLayout.f78d5d8b.css",revision:"5b2a3017b7dc3e95a5ce0a1c21b4c268"},{url:"assets/MPW.4ee8cfda.png",revision:"e8e20262217968fd0042b890c8c873af"},{url:"assets/plugin-vue_export-helper.07685ab7.js",revision:"d47e9522a96ea8de6174896833c27cd8"},{url:"assets/QBtn.1457b911.js",revision:"71dd565c75cba339f2f19b0a6dd23756"},{url:"assets/vm.dbe5639f.js",revision:"0a964a261869e474b96b81069974ba2f"},{url:"favicon-16x16.png",revision:"af5523f6be59dd56487ec0399514da4e"},{url:"favicon-32x32.png",revision:"bee281721f589b2074fe8130c92d18db"},{url:"favicon.ico",revision:"48b685a6cf602fd3358abb72f143fbdd"},{url:"icons/apple-icon-120x120.png",revision:"d082235f6e6d2109e84e397f66fa868d"},{url:"icons/apple-icon-152x152.png",revision:"3c728ce3e709b7395be487becf76283a"},{url:"icons/apple-icon-167x167.png",revision:"3fec89672a18e4b402ede58646917c2d"},{url:"icons/apple-icon-180x180.png",revision:"aa47843bd47f34b7ca4b99f65dd25955"},{url:"icons/favicon-128x128.png",revision:"ab92df0270f054ca388127c9703a4911"},{url:"icons/favicon-16x16.png",revision:"e4b046d41e08e6fa06626d6410ab381d"},{url:"icons/favicon-32x32.png",revision:"410858b01fa6d3d66b7bf21447c5f1fc"},{url:"icons/favicon-96x96.png",revision:"db2bde7f824fb4057ffd1c42f6ed756e"},{url:"icons/icon-128x128.png",revision:"34065cfabcd52300e0ac49e965e91e6d"},{url:"icons/icon-144x144.png",revision:"bb3937c7690645434d461f352accc48a"},{url:"icons/icon-152x152.png",revision:"2df7b574c641e667d58e221474dc27d6"},{url:"icons/icon-192x192.png",revision:"24462437904798ddc987edfa70e0973b"},{url:"icons/icon-256x256.png",revision:"cf5ad3498fb6fda43bdafd3c6ce9b824"},{url:"icons/icon-384x384.png",revision:"d41d8cd98f00b204e9800998ecf8427e"},{url:"icons/icon-512x512.png",revision:"cb7ad94789b5d4b2c4e17798f3cab775"},{url:"icons/icon-72x72.png",revision:"e8c72b56d1f8d5efe6e3574509430680"},{url:"icons/icon-96x96.png",revision:"ad7348123faab5d2552cb028cd2ee9d2"},{url:"icons/ms-icon-144x144.png",revision:"8de1b0e67a62b881cd22d935f102a0e6"},{url:"icons/safari-pinned-tab.svg",revision:"3e4c3730b00c89591de9505efb73afd3"},{url:"index.html",revision:"38d8df885c7285925c203fc565fc895d"},{url:"manifest.json",revision:"1554ac563a5963e1456940f64c1c2e4c"},{url:"site.webmanifest",revision:"053100cb84a50d2ae7f5492f7dd7f25e"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html"),{denylist:[/sw\.js$/,/workbox-(.)*\.js$/]}))}));
