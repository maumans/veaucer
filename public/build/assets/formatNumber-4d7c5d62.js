function l(t){let e=Number(t).toFixed(2).replace(/\d(?=(\d{3})+\.)/g,"$&,"),r=e.split(".");return r.length>1&&(e=r[0].replace(",",".")),e.replace(",",".")}export{l as f};
