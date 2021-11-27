import{r as f,P as a,l as g,j as p,R as y}from"./vendor.0a685a53.js";const v=function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))r(e);new MutationObserver(e=>{for(const s of e)if(s.type==="childList")for(const l of s.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&r(l)}).observe(document,{childList:!0,subtree:!0});function i(e){const s={};return e.integrity&&(s.integrity=e.integrity),e.referrerpolicy&&(s.referrerPolicy=e.referrerpolicy),e.crossorigin==="use-credentials"?s.credentials="include":e.crossorigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(e){if(e.ep)return;e.ep=!0;const s=i(e);fetch(e.href,s)}};v();function b(n,t,i){if(n.tagName){const r=Object.assign({key:"lo-"+i+"-"+t},n.properties),e=n.children?n.children.map(N(i+1)):null;return f.exports.createElement(n.tagName,r,e)}return n.value}const N=n=>(i,r)=>b(i,r,n),x=(n,t=1)=>n.reduce(function(i,r){if(r.type==="text"){if(r.value.indexOf(`
`)===-1)return r.lineNumber=t,i.nodes.push(r),i;const e=r.value.split(`
`);for(let s=0;s<e.length;s++)i.nodes.push({type:"text",value:s===e.length-1?e[s]:e[s]+`
`,lineNumber:s===0?t:++t});return i.lineNumber=t,i}if(r.children){r.lineNumber=t;const e=x(r.children,t);return r.children=e.nodes,i.lineNumber=e.lineNumber,i.nodes.push(r),i}return i.nodes.push(r),i},{nodes:[],lineNumber:t}),O=function(t,i,r){let e=0;const s=i.reduce(function(l,h){const c=h.line,m=[];for(;e<t.length;e++){if(t[e].lineNumber<c){l.push(t[e]);continue}if(t[e].lineNumber===c){m.push(t[e]);continue}if(t[e].lineNumber>c)break}return l.push({type:"element",tagName:"div",properties:{className:[h.className||r.prefix+"marker"]},children:m,lineNumber:c}),l},[]);for(;e<t.length;e++)s.push(t[e]);return s},j=(n,t)=>{const i=t.markers.map(s=>s.line?s:{line:s}).sort((s,l)=>s.line-l.line),r=x(n).nodes;return O(r,i,t)};function o(n){const t=n.language?g.highlight(n.language,n.value,{prefix:n.prefix}):g.highlightAuto(n.value,{prefix:n.prefix,subset:n.subset}),i=t.data.language?{className:"hljs "+t.data.language}:{className:"hljs"};n.inline&&(i.style={display:"inline"},i.className=n.className);let r=t.children;n.markers&&n.markers.length&&r.length&&(r=j(r,{prefix:n.prefix,markers:n.markers}));const e=r.length===0?n.value:r.map(N(0)),s=f.exports.createElement("code",i,e);return n.inline?s:f.exports.createElement("pre",{className:n.className},s)}o.propTypes={className:a.string,inline:a.bool,language:a.string,prefix:a.string,subset:a.arrayOf(a.string),value:a.string.isRequired,markers:a.arrayOf(a.oneOfType([a.number,a.shape({line:a.number.isRequired,className:a.string})]))};o.defaultProps={className:"lowlight",inline:!1,prefix:"hljs-"};o.registerLanguage=g.registerLanguage;o.hasLanguage=n=>g.listLanguages().includes(n);var L=`'use strict'

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

console.log(longMoo(5))
// "MoO0ooO0ooO0ooO0ooO0o"
`;const u=p.exports.jsx,d=p.exports.jsxs,w=()=>{const[n,t]=f.exports.useState(L);return d("div",{className:"container",children:[d("div",{className:"input",children:[u("h1",{children:"Input"}),u("textarea",{value:n,onChange:r=>{t(r.target.value)}})]}),d("div",{className:"output",children:[u("h1",{children:"Output"}),u(o,{language:"js",value:n})]})]})};y.render(u(w,{}),document.getElementById("root"));
