import{r as a,W as ce,j as e,y as de}from"./app-2375f243.js";import"./PanelLayout-e7050e06.js";import{R as ue}from"./ReferentielLayout-7339f89f.js";import{u as me,D as m,a as g,b as h,c as N,C as ge,M as he}from"./index.esm-24e1cabb.js";import{V as xe,E as pe,D as je,C as O,A as fe,M as ve}from"./index.esm-858d862c.js";import{I as x}from"./InputError-68d6cb0c.js";import{B as n}from"./Button-360edc97.js";import{T as p}from"./TextField-5b383e78.js";import"./createSvgIcon-ab9be74c.js";import"./index-c926b602.js";import"./Dropdown-1ce9c365.js";import"./transition-d812106d.js";/* empty css            */import"./Search-d7112b9b.js";function Le({auth:y,errors:l,referentiels:T,liens:o,error:w,success:B}){const[P,A]=a.useState([]),[k,E]=a.useState(!1),[W,j]=a.useState(!1),[K,c]=a.useState(!1),[V,F]=a.useState(0),[f,_]=a.useState([]),[v,G]=a.useState(""),[C,U]=a.useState([]),[i,q]=a.useState({pageIndex:o.current_page-1,pageSize:o.per_page});a.useEffect(()=>{F(o.total),A(o.data),c(!1)},[o]),a.useEffect(()=>{c(!0),j(!0),axios.post(route("superAdmin.lien.paginationFiltre"),{start:i.pageIndex*i.pageSize,size:i.pageSize,filters:f??[],globalFilter:v??"",sorting:C??[]}).then(s=>{A(s.data.data),F(s.data.rowCount),j(!1),c(!1)}).catch(s=>{E(!0),console.error(w)}),E(!1),j(!1),c(!1)},[f,v,i.pageIndex,i.pageSize,C]);const{data:t,setData:r,post:H,put:J,reset:b}=ce({id:"",nom:"",slug:""}),[Q,d]=a.useState(!1),[X,S]=a.useState(!1),[Y,z]=a.useState(!1),[Z,D]=a.useState(!1),$=()=>{b(),d(!0)},I=()=>{d(!1)},R=()=>{S(!1)},ee=()=>{z(!1)},L=()=>{D(!1)},u=s=>{s.target.type==="checkbox"?r(s.target.name,s.target.checked):r(s.target.name,s.target.value)},se=()=>{H(route("superAdmin.lien.store"),{onSuccess:()=>{b(),d(!1)}})},ae=s=>{r({id:s.id,nom:s.nom||"",slug:s.slug||""}),S(!0)},ne=s=>{r({id:s.id,nom:s.nom||"",slug:s.slug||""}),z(!0)},M=(s,re)=>{r({id:s,message:re}),D(!0)},te=()=>{J(route("superAdmin.lien.update",t.id),{onSuccess:()=>{b(),S(!1)}})},ie=()=>{d(!1),de.delete(route("superAdmin.lien.destroy",{id:t.id}))},le=a.useMemo(()=>[{accessorKey:"nom",header:"Nom"},{accessorKey:"slug",header:"Slug"},{accessorKey:"status",header:"Status",Cell:({row:s})=>s.original.status?e.jsx("div",{className:"p-2 font-bold bg-green-500 text-white w-fit h-fit rounded",children:"Actif"}):e.jsx("div",{className:"p-2 font-bold bg-red-500 text-white w-fit h-fit rounded",children:"Inactif"})},{accessorKey:"action",header:"Action",Cell:({row:s})=>e.jsxs("div",{className:"flex gap-2",children:[e.jsx(n,{onClick:()=>ne(s.original),variant:"contained",size:"small",color:"info",children:e.jsx(xe,{})}),e.jsx(n,{onClick:()=>ae(s.original),variant:"contained",size:"small",color:"secondary",children:e.jsx(pe,{})}),s.original.status?e.jsx(n,{onClick:()=>M(s.original.id,"delete"),variant:"contained",size:"small",color:"error",children:e.jsx(je,{})}):e.jsx(n,{onClick:()=>M(s.original.id,"check"),variant:"contained",size:"small",color:"success",children:e.jsx(O,{})})]},s.original.id)}],[]),oe=me({columns:le,data:P,getRowId:s=>s.id,initialState:{showColumnFilters:!1},manualFiltering:!0,manualPagination:!0,manualSorting:!0,muiToolbarAlertBannerProps:k?{color:"error",children:"Error loading data"}:void 0,onColumnFiltersChange:_,onGlobalFilterChange:G,onPaginationChange:q,onSortingChange:U,rowCount:V,state:{columnFilters:f,globalFilter:v,isLoading:W,pagination:i,showAlertBanner:k,showProgressBars:K,sorting:C},localization:ve});return e.jsx(ue,{success:B,error:w,auth:y,errors:l,referentiels:T,referentiel:"Liens",active:"referentiel",sousActive:"superAdmin.lien.index",breadcrumbs:[{text:"Lien",href:route("superAdmin.lien.index",[y.user.id]),active:!1}],children:e.jsxs("div",{className:"grid gap-5 bg-gray-200 p-2 rounded border",children:[e.jsxs("div",{className:"flex justify-end",children:[e.jsxs(n,{color:"warning",variant:"contained",onClick:$,children:[e.jsx(fe,{className:"mr-1"})," Ajout lien"]}),e.jsxs(m,{open:Q,onClose:I,children:[e.jsx(g,{className:"bg-orange-600 text-white",children:"Ajout du lien"}),e.jsx(h,{className:"space-y-5",children:e.jsxs("div",{className:"grid sm:grid-cols-2 grid-cols-1 bg-gray-50 gap-5 p-2 m-2 rounded",children:[e.jsxs("div",{children:[e.jsx(p,{value:t.nom,autoFocus:!0,id:"nom",name:"nom",label:"Nom",className:"bg-white",fullWidth:!0,onChange:u}),e.jsx(x,{message:l.nom,className:"mt-2"})]}),e.jsxs("div",{children:[e.jsx(p,{value:t.slug,id:"slug",name:"slug",label:"Slug",className:"bg-white",fullWidth:!0,onChange:u}),e.jsx(x,{message:l.slug,className:"mt-2"})]})]})}),e.jsxs(N,{children:[e.jsx(n,{variant:"contained",color:"error",onClick:I,children:"Annuler"}),e.jsx(n,{variant:"contained",color:"success",onClick:se,children:"Enregistrer"})]})]}),e.jsxs(m,{open:X,onClose:R,children:[e.jsx(g,{className:"bg-orange-600 text-white",children:"Modification du lien"}),e.jsx(h,{className:"space-y-5",children:e.jsxs("div",{className:"grid sm:grid-cols-2 grid-cols-1 bg-gray-50 gap-5 p-2 m-2 rounded",children:[e.jsxs("div",{children:[e.jsx(p,{value:t.nom,autoFocus:!0,id:"nom",name:"nom",label:"Nom",className:"bg-white",fullWidth:!0,onChange:u}),e.jsx(x,{message:l.nom,className:"mt-2"})]}),e.jsxs("div",{children:[e.jsx(p,{value:t.slug,id:"slug",name:"slug",label:"Slug",className:"bg-white",fullWidth:!0,onChange:u}),e.jsx(x,{message:l.slug,className:"mt-2"})]})]})}),e.jsxs(N,{children:[e.jsx(n,{variant:"contained",color:"error",onClick:R,children:"Annuler"}),e.jsx(n,{variant:"contained",color:"success",onClick:te,children:"Enregistrer"})]})]}),e.jsxs(m,{open:Y,onClose:ee,children:[e.jsx(g,{className:"bg-orange-600 text-white",children:"Details du lien"}),e.jsx(h,{className:"space-y-5",children:e.jsxs("div",{className:"grid grid-cols-2 mt-5 divide-y divide-x border w-96 min-w-fi",children:[e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"font-bold py-2 px-2",children:"NOM"}),e.jsx("div",{className:"py-2 px-2",children:t.nom})]}),e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"font-bold py-2 px-2",children:"SLUG"}),e.jsx("div",{className:"py-2 px-2",children:t.slug})]})]})})]}),e.jsxs(m,{open:Z,onClose:L,children:[e.jsx(g,{className:"bg-orange-600 text-white",children:"Suppression du lien"}),e.jsx(h,{className:"space-y-5",children:e.jsxs("div",{className:"mt-5",children:[t.message==="delete"&&"Voulez-vous vraiment suspendre ce lien",t.message==="check"&&"Voulez-vous vraiment débloquer ce lien"]})}),e.jsxs(N,{children:[e.jsxs(n,{variant:"contained",color:"error",onClick:L,children:[e.jsx(ge,{}),"  Non"]}),e.jsxs(n,{variant:"contained",color:"success",onClick:ie,children:[e.jsx(O,{})," Oui"]})]})]})]}),e.jsx(he,{table:oe})]})})}export{Le as default};