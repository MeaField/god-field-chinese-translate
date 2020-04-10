// ==UserScript==
// @name         godfield.net汉化
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  make godfield language "pt" to Chinese!
// @supportURL   https://gitee.com/skydog/god-field-skydog-plugin
// @author       237th
// @match        https://godfield.net/?lang=pt
// @resource outJson http://skydog.gitee.io/god-field-skydog-plugin/cn.json
// @grant           GM_getResourceText
// @grant           unsafeWindow
// @run-at         document-start
// ==/UserScript==

(function (window) {
  'use strict';

  const myOut = GM_getResourceText("outJson");
  //console.log("myOut", myOut);

  var open_prototype = XMLHttpRequest.prototype.open,
    intercept_response = function (urlpattern, callback) {
      XMLHttpRequest.prototype.open = function () {
        arguments['1'].match(urlpattern) && this.addEventListener('readystatechange', function (event) {
          if (this.readyState === 4) {
            var response = callback(event.target.responseText);
            Object.defineProperty(this, 'response', {writable: true});
            Object.defineProperty(this, 'responseText', {writable: true});
            this.response = this.responseText = response;
          }
        });
        return open_prototype.apply(this, arguments);
      };
    };

  intercept_response(/pt\.json/i, function (response) {
    console.log("response will change", response, myOut);
    var new_response = myOut;
    return new_response;
  });


})(unsafeWindow);
