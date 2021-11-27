import{r as c,l as g,P as a,j as p,R as y}from"./vendor.0a685a53.js";const v=function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))s(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const l of t.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&s(l)}).observe(document,{childList:!0,subtree:!0});function i(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerpolicy&&(t.referrerPolicy=e.referrerpolicy),e.crossorigin==="use-credentials"?t.credentials="include":e.crossorigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function s(e){if(e.ep)return;e.ep=!0;const t=i(e);fetch(e.href,t)}};v();function b(n,r,i){if(n.tagName){const s=Object.assign({key:"lo-"+i+"-"+r},n.properties),e=n.children?n.children.map(N(i+1)):null;return c.exports.createElement(n.tagName,s,e)}return n.value}const N=n=>(i,s)=>b(i,s,n),x=(n,r=1)=>n.reduce(function(i,s){if(s.type==="text"){if(s.value.indexOf(`
`)===-1)return s.lineNumber=r,i.nodes.push(s),i;const e=s.value.split(`
`);for(let t=0;t<e.length;t++)i.nodes.push({type:"text",value:t===e.length-1?e[t]:e[t]+`
`,lineNumber:t===0?r:++r});return i.lineNumber=r,i}if(s.children){s.lineNumber=r;const e=x(s.children,r);return s.children=e.nodes,i.lineNumber=e.lineNumber,i.nodes.push(s),i}return i.nodes.push(s),i},{nodes:[],lineNumber:r}),O=function(r,i,s){let e=0;const t=i.reduce(function(l,u){const d=u.line,m=[];for(;e<r.length;e++){if(r[e].lineNumber<d){l.push(r[e]);continue}if(r[e].lineNumber===d){m.push(r[e]);continue}if(r[e].lineNumber>d)break}return l.push({type:"element",tagName:"div",properties:{className:[u.className||s.prefix+"marker"]},children:m,lineNumber:d}),l},[]);for(;e<r.length;e++)t.push(r[e]);return t},L=(n,r)=>{const i=r.markers.map(t=>t.line?t:{line:t}).sort((t,l)=>t.line-l.line),s=x(n).nodes;return O(s,i,r)},o=c.exports.forwardRef((n,r)=>{const i=n.language?g.highlight(n.language,n.value,{prefix:n.prefix}):g.highlightAuto(n.value,{prefix:n.prefix,subset:n.subset});let s=i.children;n.markers&&n.markers.length&&s.length&&(s=L(s,{prefix:n.prefix,markers:n.markers}));const e=s.length===0?n.value:s.map(N(0)),t={className:"hljs",style:{},ref:null},l={ref:r,className:n.className};i.data.language&&(t.className+=" "+i.data.language),n.inline&&(t.style={display:"inline"},t.className=n.className,t.ref=r);const u=c.exports.createElement("code",t,e);return n.inline?u:c.exports.createElement("pre",l,u)});o.displayName="Lowlight";o.propTypes={className:a.string,inline:a.bool,language:a.string,prefix:a.string,subset:a.arrayOf(a.string),value:a.string.isRequired,markers:a.arrayOf(a.oneOfType([a.number,a.shape({line:a.number.isRequired,className:a.string})]))};o.defaultProps={className:"lowlight",inline:!1,prefix:"hljs-"};o.registerLanguage=g.registerLanguage;o.hasLanguage=n=>g.listLanguages().includes(n);var w=`'use strict'

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
`;const f=p.exports.jsx,h=p.exports.jsxs,j=()=>{const[n,r]=c.exports.useState(w);return h("div",{className:"container",children:[h("div",{className:"input",children:[f("h1",{children:"Input"}),f("textarea",{value:n,onChange:s=>{r(s.target.value)}})]}),h("div",{className:"output",children:[f("h1",{children:"Output"}),f(o,{language:"js",value:n})]})]})};y.render(f(j,{}),document.getElementById("root"));
