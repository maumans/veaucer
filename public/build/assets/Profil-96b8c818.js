import{j as e,a as o,y as a}from"./app-2375f243.js";import{G as d}from"./GuestLayout-1407b1cb.js";import{r as i,i as x}from"./createSvgIcon-ab9be74c.js";import"./ApplicationLogo-7805c721.js";import"./index-c926b602.js";var r={},u=x;Object.defineProperty(r,"__esModule",{value:!0});var l=r.default=void 0,m=u(i()),p=e,j=(0,m.default)((0,p.jsx)("path",{d:"M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"}),"Person");l=r.default=j;function N({authProfil:t}){function c(s){a.get(route("profil.connect",s))}return e.jsxs(d,{children:[e.jsx(o,{title:"Profil"}),e.jsxs("div",{className:"flex flex-col",children:[e.jsxs("div",{className:"text-center w-full text-xl font-bold",children:["Bienvenu(e) ",e.jsx("span",{className:"capitalize",children:t.prenom})," ",e.jsx("span",{className:"uppercase",children:t.nom})]}),e.jsx("div",{className:"text-center my-3",children:"Avec quel profil souhaitez-vous vous connecter?"}),e.jsx("div",{className:"flex justify-center flex-wrap gap-4 py-5 rounded w-full",children:t==null?void 0:t.profils.map(s=>{var n;return e.jsxs("button",{style:{width:200},className:"bg-gray-200 p-5 flex flex-col space-y-4 items-center rounded border-orange-500 border-2 w-full",onClick:()=>c(s.id),children:[e.jsx("div",{className:"p-5 rounded-full bg-white w-fit border border-orange-500 border-2",children:e.jsx(l,{className:"text-5xl"})}),e.jsx("div",{children:s.role.libelle}),(s==null?void 0:s.societe)&&e.jsxs("span",{children:["Chez ",e.jsx("span",{className:"font-bold text-orange-500",children:(n=s.societe)==null?void 0:n.nom})]})]},s.id)})}),e.jsx("div",{className:"flex justify-center",children:e.jsx("button",{className:"ml-4 bg-black p-2 rounded text-white",onClick:()=>a.post(route("logout")),children:"Déconnexion"})})]})]})}export{N as default};
