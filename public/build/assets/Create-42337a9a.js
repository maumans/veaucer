import{W as f,j as e}from"./app-2375f243.js";import{I as l}from"./InputError-68d6cb0c.js";import{P as b}from"./PanelLayout-e7050e06.js";/* empty css            */import d from"./NumberFormatCustomUtils-dd38754a.js";import{m as v}from"./motion-374d27a7.js";import{T as t,A as m,a as N}from"./TextField-5b383e78.js";import{B as C}from"./Button-360edc97.js";import"./createSvgIcon-ab9be74c.js";import"./index-c926b602.js";import"./Dropdown-1ce9c365.js";import"./transition-d812106d.js";function D({auth:r,typeProduits:u,typeProduit:p,sousCategories:x,fournisseurs:g,devises:w,uniteMesures:P,errors:i,success:y,error:k,referentiels:I}){const{data:c,setData:o,post:h,processing:A}=f({id:"",nom:"",prixAchat:"",prixVente:"",stockGlobal:"",stockMinimal:"",image:"",typeProduit:p,sousCategorie:null,fournisseur:null,uniteMesure:null,devise:null}),n=s=>{s.target.type==="checkbox"?o(s.target.name,s.target.checked):o(s.target.name,s.target.value)};function j(s){s.preventDefault(),h(route("admin.produit.store",r.user.id),{preserveScroll:!0})}return e.jsx(b,{auth:r,active:"catalogue",sousActive:"produit",breadcrumbs:[{text:"Inventaire",href:route("admin.produit.index",r.user.id),active:!1},{text:"Création",href:route("admin.produit.create",[r.user.id]),active:!0}],children:e.jsx("div",{children:e.jsx("div",{className:"w-full",children:e.jsx(v.div,{initial:{y:-10,opacity:0},animate:{y:0,opacity:1},transition:{duration:.5,type:"spring"},style:{width:"100%"},children:e.jsxs("form",{onSubmit:j,className:"w-full space-y-5 gap-5 rounded bg-white p-5",children:[e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-5 border p-3 rounded",children:[e.jsx("div",{className:"md:col-span-2 text-orange-500 font-bold",children:"Infos de base"}),e.jsxs("div",{children:[e.jsx(t,{value:c.nom,autoFocus:!0,id:"nom",name:"nom",label:"Nom",className:"bg-white",fullWidth:!0,onChange:n}),e.jsx(l,{message:i.nom,className:"mt-2"})]}),e.jsxs("div",{children:[e.jsx(m,{value:c.typeProduit,className:"w-full",onChange:(s,a)=>o("typeProduit",a),disablePortal:!0,options:u,getOptionLabel:s=>s.nom,isOptionEqualToValue:(s,a)=>s.id===a.id,renderInput:s=>e.jsx(t,{fullWidth:!0,...s,placeholder:"Type de produit",label:s.nom})}),e.jsx(l,{message:i["data.typeProduit"]})]}),e.jsxs("div",{children:[e.jsx(m,{className:"w-full",onChange:(s,a)=>o("sousCategorie",a),disablePortal:!0,options:x,groupBy:s=>s.categorie.libelle,getOptionLabel:s=>s.nom,isOptionEqualToValue:(s,a)=>s.id===a.id,renderInput:s=>e.jsx(t,{fullWidth:!0,...s,placeholder:"Categorie de produit",label:s.nom})}),e.jsx(l,{message:i["data.sousCategorie"]})]}),e.jsxs("div",{className:"md:col-span-2 mt-8",children:[e.jsx(N,{className:"w-full",name:"description",placeholder:"Description",style:{height:100},onChange:n,autoComplete:"description"}),e.jsx(l,{message:i["data.description"]})]})]}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-5 border p-3 rounded",children:[e.jsx("div",{className:"md:col-span-2 font-bold text-orange-500",children:"Fixation du prix"}),e.jsxs("div",{className:"w-full",children:[e.jsx(t,{InputProps:{inputComponent:d,endAdornment:"GNF",inputProps:{max:1e11,min:-1e12,name:"prixAchat"}},className:"w-full",label:"Prix d'achat",name:"prixAchat",onChange:n}),e.jsx(l,{message:i.prixAchat})]}),e.jsxs("div",{className:"w-full",children:[e.jsx(t,{InputProps:{inputComponent:d,endAdornment:"GNF",inputProps:{max:1e11,min:-1e12,name:"prixVente"}},className:"w-full",label:"Prix de vente",name:"prixVente",onChange:n}),e.jsx(l,{message:i.prixVente})]})]}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-5 border p-3 rounded",children:[e.jsx("div",{className:"md:col-span-2 font-bold text-orange-500",children:"Stock principal"}),e.jsxs("div",{className:"w-full",children:[e.jsx(t,{InputProps:{inputComponent:d,inputProps:{max:1e11,min:-1e12,name:"stockGlobal"}},className:"w-full",label:"Stock global",name:"stockGlobal",onChange:n}),e.jsx(l,{message:i.stockGlobal})]}),e.jsxs("div",{className:"w-full",children:[e.jsx(t,{InputProps:{inputComponent:d,inputProps:{max:1e11,min:-1e12,name:"stockMinimal"}},className:"w-full",label:"Stock minimal",name:"stockMinimal",onChange:n}),e.jsx(l,{message:i.stockMinimal})]})]}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-5 border p-3 rounded",children:[e.jsx("div",{className:"md:col-span-2 text-orange-500 font-bold",children:"Image"}),e.jsxs("div",{className:"w-full",children:[e.jsx(t,{className:"w-full",label:"Image",name:"image",onChange:n}),e.jsx(l,{message:i.image})]})]}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-5 border p-3 rounded",children:[e.jsx("div",{className:"md:col-span-2 text-orange-500 font-bold",children:"Fournisseur principal"}),e.jsxs("div",{children:[e.jsx(m,{className:"w-full",onChange:(s,a)=>o("fournisseur",a),disablePortal:!0,options:g,getOptionLabel:s=>s.nom,isOptionEqualToValue:(s,a)=>s.id===a.id,renderInput:s=>e.jsx(t,{fullWidth:!0,...s,placeholder:"Fournisseur principal",label:s.nom})}),e.jsx(l,{message:i["data.fournisseur"]})]})]}),e.jsx("div",{className:"w-full md:col-span-2 flex gap-2 justify-end",children:e.jsx(C,{variant:"contained",color:"success",type:"submit",children:"                                    Valider"})})]})})})})})}export{D as default};