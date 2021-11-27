import{r as o,l as f,j as g,R as x}from"./vendor.aa160431.js";const v=function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))i(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const l of t.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&i(l)}).observe(document,{childList:!0,subtree:!0});function s(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerpolicy&&(t.referrerPolicy=e.referrerpolicy),e.crossorigin==="use-credentials"?t.credentials="include":e.crossorigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function i(e){if(e.ep)return;e.ep=!0;const t=s(e);fetch(e.href,t)}};v();function y(n,r,s){if(n.tagName){const i=Object.assign({key:"lo-"+s+"-"+r},n.properties),e=n.children?n.children.map(p(s+1)):null;return o.exports.createElement(n.tagName,i,e)}return n.value}const p=n=>(s,i)=>y(s,i,n),N=(n,r=1)=>n.reduce(function(s,i){if(i.type==="text"){if(i.value.indexOf(`
`)===-1)return i.lineNumber=r,s.nodes.push(i),s;const e=i.value.split(`
`);for(let t=0;t<e.length;t++)s.nodes.push({type:"text",value:t===e.length-1?e[t]:e[t]+`
`,lineNumber:t===0?r:++r});return s.lineNumber=r,s}if(i.children){i.lineNumber=r;const e=N(i.children,r);return i.children=e.nodes,s.lineNumber=e.lineNumber,s.nodes.push(i),s}return s.nodes.push(i),s},{nodes:[],lineNumber:r}),b=function(r,s,i){let e=0;const t=s.reduce(function(l,a){const d=a.line,m=[];for(;e<r.length;e++){if(r[e].lineNumber<d){l.push(r[e]);continue}if(r[e].lineNumber===d){m.push(r[e]);continue}if(r[e].lineNumber>d)break}return l.push({type:"element",tagName:"div",properties:{className:[a.className||i.prefix+"marker"]},children:m,lineNumber:d}),l},[]);for(;e<r.length;e++)t.push(r[e]);return t},O=(n,r)=>{const s=r.markers.map(t=>t.line?t:{line:t}).sort((t,l)=>t.line-l.line),i=N(n).nodes;return b(i,s,r)},u=o.exports.forwardRef((n,r)=>{const s=n.language?f.highlight(n.language,n.value,{prefix:n.prefix}):f.highlightAuto(n.value,{prefix:n.prefix,subset:n.subset});let i=s.children;n.markers&&n.markers.length&&i.length&&(i=O(i,{prefix:n.prefix,markers:n.markers}));const e=i.length===0?n.value:i.map(p(0)),t={className:"hljs",style:{},ref:null},l={ref:r,className:n.className};s.data.language&&(t.className+=" "+s.data.language),n.inline&&(t.style={display:"inline"},t.className=n.className,t.ref=r);const a=o.exports.createElement("code",t,e);return n.inline?a:o.exports.createElement("pre",l,a)});u.displayName="Lowlight";u.defaultProps={className:"lowlight",inline:!1,prefix:"hljs-"};u.registerLanguage=f.registerLanguage;u.hasLanguage=n=>f.listLanguages().includes(n);var L=`'use strict'

function longMoo (count) {
  if (count < 1) {
    return ''
  }

  let result = ''
  let pattern = 'oO0o'
  while (count > 1) {
    if (count & 1) {
      result += pattern
    }

    count >>= 1, pattern += pattern
  }

  return 'M' + result + pattern
}

console.log(longMoo(5)) // -> "MoO0ooO0ooO0ooO0ooO0o"
`;const c=g.exports.jsx,h=g.exports.jsxs,w=()=>{const[n,r]=o.exports.useState(L);return h("div",{className:"container",children:[h("div",{className:"input",children:[c("h1",{children:"Input"}),c("textarea",{value:n,onChange:i=>{r(i.target.value)}})]}),h("div",{className:"output",children:[c("h1",{children:"Output"}),c(u,{language:"js",value:n})]})]})};x.render(c(w,{}),document.getElementById("root"));
