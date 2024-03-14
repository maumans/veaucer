/*!
 * Chart.js v4.4.1
 * https://www.chartjs.org
 * (c) 2023 Chart.js Contributors
 * Released under the MIT License
 */const u=new Map;function o(t,e){e=e||{};const n=t+JSON.stringify(e);let r=u.get(n);return r||(r=new Intl.NumberFormat(t,e),u.set(n,r)),r}function i(t,e,n){return o(e,n).format(t)}function f(){return typeof window<"u"&&typeof document<"u"}(function(){let t=!1;try{const e={get passive(){return t=!0,!1}};f()&&(window.addEventListener("test",null,e),window.removeEventListener("test",null,e))}catch{}return t})();export{i as f};
