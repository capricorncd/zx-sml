/*!
 * zx-sml version 0.7.1
 * Author: Xing Zhong<zx198401@gmail.com>
 * Repository: https://github.com/capricorncd/zx-sml
 * Released on: 2023-05-14 01:35:32 (GMT+0000)
 */
(function(a,g){typeof exports=="object"&&typeof module!="undefined"?g(exports,require("node:fs"),require("node:os"),require("node:path")):typeof define=="function"&&define.amd?define(["exports","node:fs","node:os","node:path"],g):(a=typeof globalThis!="undefined"?globalThis:a||self,g(a["zx-docgen"]={},a.fs,a.os,a.path))})(this,function(a,g,A,fe){"use strict";var we=Object.defineProperty,Le=Object.defineProperties;var je=Object.getOwnPropertyDescriptors;var te=Object.getOwnPropertySymbols;var Re=Object.prototype.hasOwnProperty,Ce=Object.prototype.propertyIsEnumerable;var ne=(a,g,A)=>g in a?we(a,g,{enumerable:!0,configurable:!0,writable:!0,value:A}):a[g]=A,ce=(a,g)=>{for(var A in g||(g={}))Re.call(g,A)&&ne(a,A,g[A]);if(te)for(var A of te(g))Ce.call(g,A)&&ne(a,A,g[A]);return a},ae=(a,g)=>Le(a,je(g));function _(e){return e&&typeof e=="object"&&"default"in e?e:{default:e}}var $=_(g),P=_(A),M=_(fe);const f="",m={method:"method",type:"type",document:"document",constant:"constant",property:"property"};function oe(e){return Array.isArray(e)}function q(e){return typeof e=="object"&&e!==null&&!oe(e)}function ue(e){return e.replace(/^-?[1-9]\d{0,2}(,\d{3})+/,r=>r.replace(/,/g,""))}function H(e,r=!1){if(typeof e=="number")return e;if(typeof e=="string"){if(!r&&/^(-?\d+(?:\.\d+)?)\D*/.test(ue(e)))return H(RegExp.$1,!0);const s=Number(e);return isNaN(s)?0:s}return 0}const b={red:"\x1B[31m",green:"\x1B[32m",yellow:"\x1B[33m",white:"\x1B[37m"};function K(...e){console.log("\u{1F60E}",b.green,...e,b.white)}function k(...e){console.log("\u{1F615}",b.yellow,...e,b.white)}function ie(...e){console.log("\u{1F621}",b.red,...e,b.white)}const j="left",R=":--",le={left:R,center:":--:",right:"--:"};function w(e){if(!e||$.default.existsSync(e)){k(`The directory already exists, or is null, ${e}`);return}const r=e.lastIndexOf("/");if(r===-1){k(`The 'dir' maybe a valid directory name, ${e}`);return}const s=e.substring(0,r);$.default.existsSync(s)?$.default.mkdirSync(e):(w(s),w(e))}function I(e){return typeof e=="string"?/.+\.\w+$/.test(e):!1}function y(e){return Array.isArray(e)&&e.length>0}function G(e,r=" ",s="-"){const t=e.filter(n=>!!n);return t.length?t.join(r):s}function Y(e,r,s){let t=-1;for(let n=0;n<s&&(t=e.indexOf(r,t+1),t!==-1);n++);return t}function S(e){return typeof e=="undefined"?[]:Array.isArray(e)?e:[e]}function C(e){return e=e.trim(),e.endsWith(";")&&(e=e.substr(0,e.length-1)),!e.includes("|")||/^(\w+<([^<]|\([^(]+\)\[\]|\w+<[^<]+>)+>|\([^(]+\)\[\])$/.test(e)?[e]:e.split(/\s*\|\s*/)}function v(e){return e.replace(/\|/g,"\\|")}function de(e){const r=Y(e,"`",2);return r===-1?"":e.substr(r+1)}function z(e){e=e.replace("@param","").trim();const r={raw:e,name:"",required:!1,types:[],desc:[]};if(/(\w+\??)\s+`([^`]+)`(.*)/.test(e)){const s=RegExp.$1;r.name=s.replace("?",""),r.required=!s.includes("?"),r.types.push(...C(RegExp.$2));const t=RegExp.$3||de(e);r.desc.push(t.trim())}return r}function U(e){e=e.replace(/@returns?/,"").trim();const r={raw:e,types:[],desc:[]};return/`([^`]+)`\s*(.*)/.test(e)&&(r.types.push(...C(RegExp.$1)),r.desc.push(RegExp.$2)),r}function J(e){return/@sort\s*(-?\d+)/.test(e)?H(RegExp.$1):0}function D(e){return e.replace(/^([\w.]+).*/,"$1")}function B(e,r,s="Name",t={}){if(!y(e))return[];const n=t.alias||{},c=n.tableHead||{};let o={0:"no",1:"yes"};n.requiredValues&&(n.requiredValues[r]?o=n.requiredValues[r]:n.requiredValues[0]&&n.requiredValues[1]&&(o=n.requiredValues));const u=t.tableAlign||{},l={align:{[s]:u[s]||j,Types:u.Types||j,Required:u.Required||j,Description:u.Description||j},thead:[c[s]||s,c.Types||"Types",c.Required||"Required",c.Description||"Description"],tbody:e.map(i=>{var E;return[i.name,"`"+v((E=i.types)==null?void 0:E.join("`/`"))+"`",o[+i.required],v(G(i.desc))]})},d=X(l);return d.push(f),d}function F(e,r){const s=Object.keys(e).reduce((t,n)=>(Object.keys(e[n]).forEach(c=>{t[c]=e[n][c]}),t),{});return Q(s,r)}function Q(e,r={}){const s=[],t=Object.keys(e);return r.disableKeySorting||t.sort(),t.forEach(n=>s.push(e[n])),s.some(n=>n.sort)&&s.sort((n,c)=>n.sort-c.sort),s}function O(e,r){if(e.props)return e.props;const s=[],t=e.codes[0]||"";/\sextends\s+(.+)\s*\{/.test(t)&&RegExp.$1.split(/\s*,\s*/).map(u=>D(u.trim())).forEach(u=>{const l=r.find(d=>d.name===u);l&&(l.props||(l.props=O(l,r)),s.push(...l.props))});let n=!1,c=[];return e.codes.forEach(o=>{if(!n&&/\{\s*$/.test(o))return n=!0;if(/^\s*(?:(?:readonly|static|public)\s+)?((?:(?:\w|\[.+\])+|(?:'.+')|(?:".+"))\??)\s*:\s*([^/]*)(?:\/\/(.*))?/.test(o)){const u=RegExp.$1,l=C(RegExp.$2);c.push(RegExp.$3.trim());const d={raw:o,name:u.replace(/('|")(.+)\1/,"$2").replace(/\?/g,""),required:!u.includes("?"),desc:c.filter(Boolean),types:l},i=s.findIndex(E=>E.name===d.name);i>=0&&s.splice(i,1),s.push(d),c=[]}else/^\s*\/\/(.+)/.test(o)&&(c||(c=[]),c.push(RegExp.$1.trim()))}),s}function X(e){if(!q(e)||!y(e.tbody))return[];const{align:r,thead:s,tbody:t}=e,n=[];let c=0;for(y(s)?(n.push(s.join("|")),r?n.push(s.map(o=>le[r[o]]||R).join("|")):n.push(s.map(()=>R).join("|"))):(n.push(t[0].join("|"),t[0].map(()=>R).join("|")),c=1);c<t.length;c++)n.push(t[c].join("|"));return n}function he(e,r,s={}){const t=Object.keys(m);y(s.expendTypes)&&s.expendTypes.forEach(p=>{p&&!t.includes(p)&&t.push(p)});const n=new RegExp(`^\\*\\s*@(${t.join("|")})\\s*(.+)`),c=[m.type,m.constant];y(s.codeTypes)&&s.codeTypes.forEach(p=>{c.push(p)});let o=!1,u=!1,l="",d="",i="",E="";return $.default.readFileSync(e,"utf8").toString().split(new RegExp(P.default.EOL)).forEach(p=>{var h;const N=p;if(p=p.trim(),n.test(p)){o=!0,l=RegExp.$1;const T=RegExp.$2.trim();d=D(T),i=`${l}_${d}`,r[i]={type:l,sort:0,name:d,fullName:T,desc:[],params:[],returns:[],codes:[],private:!1,path:e};return}else if(p==="*/"&&o){o=!1;return}if(p==="/**"&&(d=""),!o||!d){d&&c.includes(l)&&p&&r[i].codes.push(N.replace(/^export(\s+default)?\s*/,""));return}if(typeof((h=s.expendTypesHandlers)==null?void 0:h[l])=="function")s.expendTypesHandlers[l](r[i],p);else{if(/^\*\s*(```\w+|@code)/.test(p)&&(u=!0),/^\*(.*)/.test(p)){E=RegExp.$1;const T=E.trim();if(T.startsWith("@param"))r[i].params.push(z(T));else if(T.startsWith("@return"))r[i].returns.push(U(T));else if(T.startsWith("@private"))r[i].private=!0;else if(T.startsWith("@sort"))r[i].sort=J(T);else if(u){T.startsWith("@code")&&(s.isExtractCodeFromComments&&r[i].codes.push(""),E=E.replace(/@code\w*/,"").trim());const L=E.replace(/^\s/,"").replace("*\\/","*/");s.isExtractCodeFromComments?r[i].codes.push(L):r[i].desc.push(L)}else r[i].desc.push(T.replace("@description","").trim())}u&&/^\*\s*```$/.test(p)&&(u=!1)}}),r}function Z(e,r,s={}){const t={};return q(r)&&(s=r,r=!1),V(e,t,s),ye(t,s),r?F(t,s):t}function V(e,r,s){const{fileType:t=/\.(ts|js)$/}=s;if(Array.isArray(e))e.forEach(n=>{V(n,r,s)});else{const n=$.default.statSync(e);n.isDirectory()?$.default.readdirSync(e).forEach(c=>{V(M.default.join(e,c),r,s)}):n.isFile()&&t.test(e)&&(r[e]={},he(e,r[e],s))}}function ee(e){if(Array.isArray(e))return e.filter(t=>t.type===m.type);const r=[];let s;return Object.keys(e).forEach(t=>{Object.keys(e[t]).forEach(n=>{s=e[t][n],s.type===m.type&&r.push(s)})}),r}function ye(e,r){const s=ee(e);y(r.types)&&s.push(...r.types),s.forEach(t=>{t.props=O(t,s)})}function pe(e,r,s={}){e.returns.length||e.returns.push({raw:"`void`",types:["void"],desc:[]}),r.push(`### ${e.fullName}`,f,...e.desc,f,...s.methodWithRaw?e.params.map(t=>`- @param ${t.raw}`):B(e.params,m.method,"Param",s),f,...e.returns.map(t=>`- @returns ${t.raw}`),f),W(e.codes,r)}function W(e,r){y(e)&&r.push(...e,f)}function me(e,r,s={}){var i;r.push(`### ${e.fullName}`,f,...e.desc,f);const t=B(e.props,m.type,"Prop",s),n=["```ts",...e.codes,"```",f],c=(i=s.alias)==null?void 0:i.sourceCodeSummary,o=["<details>",`<summary>${c||"Source Code"}</summary>`,f,...n,f,"</details>",f],{typeWithSourceCode:u,typeWithTable:l,typeWithAuto:d}=s;u&&l?r.push(...t,...n):u?r.push(...n):l?r.push(...t):t.length?r.push(...t,...o):d?r.push(...n):r.push(...o)}function ge(e){let r=0;const s=[];return e.forEach(t=>{t===f?r++:r=0,!(r>1)&&s.push(t)}),s}function Te(e,r,s){var o,u,l;if(!y(e))return;const t=((o=r.alias)==null?void 0:o.types)||{},n=S((l=(u=r.lines)==null?void 0:u.afterTitle)==null?void 0:l[m.document]);let c=null;return e.forEach((d,i)=>{i===0?(c=d.name+".md",s.push(`# ${t[m.document]||d.fullName}`,f),y(n)&&s.push(...n,f)):s.push(`### ${d.fullName}`,f),s.push(...d.desc,f),W(d.codes,s)}),c}function Ee(e,r,s){!y(e)||(x(m.method,r,s),e.forEach(t=>{pe(t,s,r)}))}function Ae(e,r,s){!y(e)||(x(m.type,r,s),e.forEach(t=>{me(t,s,r)}))}function x(e,r,s){var o,u,l;const t=((o=r.alias)==null?void 0:o.types)||{},n={document:"Document",method:"Methods",type:"Types",constant:"Constants",property:"Property"};s.push(`## ${t[e]||n[e]||e}`,f);const c=S((l=(u=r.lines)==null?void 0:u.afterTitle)==null?void 0:l[e]);y(c)&&s.push(...c,f)}function $e(e,r,s){!y(e)||(x(m.constant,r,s),e.forEach(t=>{s.push(`### ${t.fullName}`,f,...t.desc,f),y(t.codes)&&s.push("```ts",...t.codes,"```",f)}))}function be(e,r,s){!y(e)||(x(m.property,r,s),e.forEach(t=>{s.push(`### ${t.fullName}`,f,...t.desc,f),W(t.codes,s)}))}function se(e,r,s={}){var E,p,N;console.log("Output file is start ...");const t={};let n=null;e.forEach(h=>{t[h.type]||(t[h.type]=[]),t[h.type].push(h)});const c=[],o=S((E=s.lines)==null?void 0:E.start);y(o)&&c.push(...o,f);const u=((p=s.lines)==null?void 0:p.afterType)||{};(y(s.outputDocTypesAndOrder)?s.outputDocTypesAndOrder:["document","method","type","constant"]).forEach(h=>{var L;const T=(L=s.handlers)==null?void 0:L[h];typeof T=="function"?T(t[h],s,c):h===m.document?n=Te(t[h],s,c):h===m.property?be(t[h],s,c):h===m.method?Ee(t[h],s,c):h===m.type?Ae(t[h],s,c):h===m.constant&&$e(t[h],s,c),u[h]&&c.push(...S(u[h]),f)});const d=S((N=s.lines)==null?void 0:N.end);y(d)&&c.push(...d,f);const i=ge(c);return r&&(I(r)?n=r:n&&(n=M.default.join(r,n)),n&&re(n,i)),K(n||"no files were output!"),console.log("Output file is ended."),{outputFileName:n,lines:i,data:e}}function re(e,r){Array.isArray(r)&&(r=r.join(P.default.EOL)),$.default.writeFileSync(e,r,"utf8")}function Se(e,r,s){q(r)&&(s=r,r=void 0),s=s||{},(typeof e=="string"||y(e)&&e.every(c=>typeof c=="string"))&&(e=Z(e,!0,s));const t=s.lines||{},n=s.alias||{};if(s=ae(ce({},s),{lines:t,alias:n}),r&&!$.default.existsSync(r))if(I(r)){const c=r.split("/");c.pop(),w(c.join("/"))}else w(r);return Array.isArray(e)?se(e,r,s):se(F(e,s),r,s)}a.BLANK_LINE=f,a.DOC_TYPES=m,a.createPropsTable=B,a.error=ie,a.findCharIndex=Y,a.formatAsArray=S,a.formatAsTypes=C,a.getCommentsData=Z,a.getTypeName=D,a.getTypes=ee,a.handleParam=z,a.handleProps=O,a.handleReturn=U,a.handleSort=J,a.isFileLike=I,a.isValidArray=y,a.log=K,a.mergeIntoArray=F,a.mkdirSync=w,a.outputFile=Se,a.replaceVerticalBarsInTables=v,a.toArray=Q,a.toStrForStrArray=G,a.toTableLines=X,a.warn=k,a.writeFileSync=re,Object.defineProperties(a,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}})});
