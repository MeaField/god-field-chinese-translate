// ==UserScript==
// @name         godfield.net Chinese Translate
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  make godfield.net to Chinese. (ps. need to open a new page, F5 will become old languages)
// @supportURL   https://gitee.com/skydog/god-field-skydog-plugin
// @author       237th
// @match        *://godfield.net/*
// @resource outJson http://skydog.gitee.io/god-field-skydog-plugin/cn.json
// @grant           GM_getResourceText
// @run-at         document-start
// ==/UserScript==

(async function () {
  'use strict';

  const myOut = GM_getResourceText("outJson");
  //console.log("myOut", myOut);

  var open_prototype = XMLHttpRequest.prototype.open,
    intercept_response = function (urlpattern, callback) {
      XMLHttpRequest.prototype.open = function () {
        if (arguments['1'].match(urlpattern)) {
          console.log("open", arguments['1']);
          function doHack() {
            var response = callback(event.target.responseText);
            Object.defineProperty(this, 'response', {writable: true});
            Object.defineProperty(this, 'responseText', {writable: true});
            this.response = this.responseText = response;
          }

          this.addEventListener('readystatechange', function (event) {
            if (this.readyState === 4) {
              doHack.call(this);
            } else {
              console.log("readystatechange", this.readyState);
            }
          });
        }
        return open_prototype.apply(this, arguments);
      };
    };

  intercept_response(/(pt|ja|en)\.json/i, function (response) {
    console.log("response will change!");
    var new_response = myOut;
    return new_response;
  });
})();
