/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const I=globalThis,j=I.ShadowRoot&&(I.ShadyCSS===void 0||I.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,B=Symbol(),q=new WeakMap;let ie=class{constructor(e,t,s){if(this._$cssResult$=!0,s!==B)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(j&&e===void 0){const s=t!==void 0&&t.length===1;s&&(e=q.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),s&&q.set(t,e))}return e}toString(){return this.cssText}};const le=i=>new ie(typeof i=="string"?i:i+"",void 0,B),ce=(i,...e)=>{const t=i.length===1?i[0]:e.reduce((s,n,r)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(n)+i[r+1],i[0]);return new ie(t,i,B)},de=(i,e)=>{if(j)i.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const t of e){const s=document.createElement("style"),n=I.litNonce;n!==void 0&&s.setAttribute("nonce",n),s.textContent=t.cssText,i.appendChild(s)}},K=j?i=>i:i=>i instanceof CSSStyleSheet?(e=>{let t="";for(const s of e.cssRules)t+=s.cssText;return le(t)})(i):i;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:ue,defineProperty:pe,getOwnPropertyDescriptor:fe,getOwnPropertyNames:$e,getOwnPropertySymbols:_e,getPrototypeOf:ge}=Object,k=globalThis,F=k.trustedTypes,me=F?F.emptyScript:"",Ae=k.reactiveElementPolyfillSupport,U=(i,e)=>i,x={toAttribute(i,e){switch(e){case Boolean:i=i?me:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,e){let t=i;switch(e){case Boolean:t=i!==null;break;case Number:t=i===null?null:Number(i);break;case Object:case Array:try{t=JSON.parse(i)}catch{t=null}}return t}},G=(i,e)=>!ue(i,e),J={attribute:!0,type:String,converter:x,reflect:!1,hasChanged:G};Symbol.metadata??=Symbol("metadata"),k.litPropertyMetadata??=new WeakMap;class E extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=J){if(t.state&&(t.attribute=!1),this._$Ei(),this.elementProperties.set(e,t),!t.noAccessor){const s=Symbol(),n=this.getPropertyDescriptor(e,s,t);n!==void 0&&pe(this.prototype,e,n)}}static getPropertyDescriptor(e,t,s){const{get:n,set:r}=fe(this.prototype,e)??{get(){return this[t]},set(o){this[t]=o}};return{get(){return n?.call(this)},set(o){const l=n?.call(this);r.call(this,o),this.requestUpdate(e,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??J}static _$Ei(){if(this.hasOwnProperty(U("elementProperties")))return;const e=ge(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(U("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(U("properties"))){const t=this.properties,s=[...$e(t),..._e(t)];for(const n of s)this.createProperty(n,t[n])}const e=this[Symbol.metadata];if(e!==null){const t=litPropertyMetadata.get(e);if(t!==void 0)for(const[s,n]of t)this.elementProperties.set(s,n)}this._$Eh=new Map;for(const[t,s]of this.elementProperties){const n=this._$Eu(t,s);n!==void 0&&this._$Eh.set(n,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const s=new Set(e.flat(1/0).reverse());for(const n of s)t.unshift(K(n))}else e!==void 0&&t.push(K(e));return t}static _$Eu(e,t){const s=t.attribute;return s===!1?void 0:typeof s=="string"?s:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const s of t.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return de(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,s){this._$AK(e,s)}_$EC(e,t){const s=this.constructor.elementProperties.get(e),n=this.constructor._$Eu(e,s);if(n!==void 0&&s.reflect===!0){const r=(s.converter?.toAttribute!==void 0?s.converter:x).toAttribute(t,s.type);this._$Em=e,r==null?this.removeAttribute(n):this.setAttribute(n,r),this._$Em=null}}_$AK(e,t){const s=this.constructor,n=s._$Eh.get(e);if(n!==void 0&&this._$Em!==n){const r=s.getPropertyOptions(n),o=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:x;this._$Em=n,this[n]=o.fromAttribute(t,r.type),this._$Em=null}}requestUpdate(e,t,s){if(e!==void 0){if(s??=this.constructor.getPropertyOptions(e),!(s.hasChanged??G)(this[e],t))return;this.P(e,t,s)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(e,t,s){this._$AL.has(e)||this._$AL.set(e,t),s.reflect===!0&&this._$Em!==e&&(this._$Ej??=new Set).add(e)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[n,r]of this._$Ep)this[n]=r;this._$Ep=void 0}const s=this.constructor.elementProperties;if(s.size>0)for(const[n,r]of s)r.wrapped!==!0||this._$AL.has(n)||this[n]===void 0||this.P(n,this[n],r)}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(t)):this._$EU()}catch(s){throw e=!1,this._$EU(),s}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Ej&&=this._$Ej.forEach(t=>this._$EC(t,this[t])),this._$EU()}updated(e){}firstUpdated(e){}}E.elementStyles=[],E.shadowRootOptions={mode:"open"},E[U("elementProperties")]=new Map,E[U("finalized")]=new Map,Ae?.({ReactiveElement:E}),(k.reactiveElementVersions??=[]).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const W=globalThis,H=W.trustedTypes,Z=H?H.createPolicy("lit-html",{createHTML:i=>i}):void 0,ne="$lit$",m=`lit$${Math.random().toFixed(9).slice(2)}$`,re="?"+m,ye=`<${re}>`,S=document,O=()=>S.createComment(""),T=i=>i===null||typeof i!="object"&&typeof i!="function",V=Array.isArray,Se=i=>V(i)||typeof i?.[Symbol.iterator]=="function",z=`[ 	
\f\r]`,w=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Q=/-->/g,X=/>/g,A=RegExp(`>|${z}(?:([^\\s"'>=/]+)(${z}*=${z}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ee=/'/g,te=/"/g,oe=/^(?:script|style|textarea|title)$/i,Ee=i=>(e,...t)=>({_$litType$:i,strings:e,values:t}),be=Ee(1),b=Symbol.for("lit-noChange"),c=Symbol.for("lit-nothing"),se=new WeakMap,y=S.createTreeWalker(S,129);function he(i,e){if(!V(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return Z!==void 0?Z.createHTML(e):e}const Ce=(i,e)=>{const t=i.length-1,s=[];let n,r=e===2?"<svg>":e===3?"<math>":"",o=w;for(let l=0;l<t;l++){const h=i[l];let d,p,a=-1,_=0;for(;_<h.length&&(o.lastIndex=_,p=o.exec(h),p!==null);)_=o.lastIndex,o===w?p[1]==="!--"?o=Q:p[1]!==void 0?o=X:p[2]!==void 0?(oe.test(p[2])&&(n=RegExp("</"+p[2],"g")),o=A):p[3]!==void 0&&(o=A):o===A?p[0]===">"?(o=n??w,a=-1):p[1]===void 0?a=-2:(a=o.lastIndex-p[2].length,d=p[1],o=p[3]===void 0?A:p[3]==='"'?te:ee):o===te||o===ee?o=A:o===Q||o===X?o=w:(o=A,n=void 0);const g=o===A&&i[l+1].startsWith("/>")?" ":"";r+=o===w?h+ye:a>=0?(s.push(d),h.slice(0,a)+ne+h.slice(a)+m+g):h+m+(a===-2?l:g)}return[he(i,r+(i[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),s]};class M{constructor({strings:e,_$litType$:t},s){let n;this.parts=[];let r=0,o=0;const l=e.length-1,h=this.parts,[d,p]=Ce(e,t);if(this.el=M.createElement(d,s),y.currentNode=this.el.content,t===2||t===3){const a=this.el.content.firstChild;a.replaceWith(...a.childNodes)}for(;(n=y.nextNode())!==null&&h.length<l;){if(n.nodeType===1){if(n.hasAttributes())for(const a of n.getAttributeNames())if(a.endsWith(ne)){const _=p[o++],g=n.getAttribute(a).split(m),R=/([.?@])?(.*)/.exec(_);h.push({type:1,index:r,name:R[2],strings:g,ctor:R[1]==="."?Ue:R[1]==="?"?Pe:R[1]==="@"?ve:D}),n.removeAttribute(a)}else a.startsWith(m)&&(h.push({type:6,index:r}),n.removeAttribute(a));if(oe.test(n.tagName)){const a=n.textContent.split(m),_=a.length-1;if(_>0){n.textContent=H?H.emptyScript:"";for(let g=0;g<_;g++)n.append(a[g],O()),y.nextNode(),h.push({type:2,index:++r});n.append(a[_],O())}}}else if(n.nodeType===8)if(n.data===re)h.push({type:2,index:r});else{let a=-1;for(;(a=n.data.indexOf(m,a+1))!==-1;)h.push({type:7,index:r}),a+=m.length-1}r++}}static createElement(e,t){const s=S.createElement("template");return s.innerHTML=e,s}}function C(i,e,t=i,s){if(e===b)return e;let n=s!==void 0?t._$Co?.[s]:t._$Cl;const r=T(e)?void 0:e._$litDirective$;return n?.constructor!==r&&(n?._$AO?.(!1),r===void 0?n=void 0:(n=new r(i),n._$AT(i,t,s)),s!==void 0?(t._$Co??=[])[s]=n:t._$Cl=n),n!==void 0&&(e=C(i,n._$AS(i,e.values),n,s)),e}class we{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:s}=this._$AD,n=(e?.creationScope??S).importNode(t,!0);y.currentNode=n;let r=y.nextNode(),o=0,l=0,h=s[0];for(;h!==void 0;){if(o===h.index){let d;h.type===2?d=new N(r,r.nextSibling,this,e):h.type===1?d=new h.ctor(r,h.name,h.strings,this,e):h.type===6&&(d=new Oe(r,this,e)),this._$AV.push(d),h=s[++l]}o!==h?.index&&(r=y.nextNode(),o++)}return y.currentNode=S,n}p(e){let t=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}}class N{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,s,n){this.type=2,this._$AH=c,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=n,this._$Cv=n?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=C(this,e,t),T(e)?e===c||e==null||e===""?(this._$AH!==c&&this._$AR(),this._$AH=c):e!==this._$AH&&e!==b&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Se(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==c&&T(this._$AH)?this._$AA.nextSibling.data=e:this.T(S.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:s}=e,n=typeof s=="number"?this._$AC(e):(s.el===void 0&&(s.el=M.createElement(he(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===n)this._$AH.p(t);else{const r=new we(n,this),o=r.u(this.options);r.p(t),this.T(o),this._$AH=r}}_$AC(e){let t=se.get(e.strings);return t===void 0&&se.set(e.strings,t=new M(e)),t}k(e){V(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let s,n=0;for(const r of e)n===t.length?t.push(s=new N(this.O(O()),this.O(O()),this,this.options)):s=t[n],s._$AI(r),n++;n<t.length&&(this._$AR(s&&s._$AB.nextSibling,n),t.length=n)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e&&e!==this._$AB;){const s=e.nextSibling;e.remove(),e=s}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}}class D{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,n,r){this.type=1,this._$AH=c,this._$AN=void 0,this.element=e,this.name=t,this._$AM=n,this.options=r,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=c}_$AI(e,t=this,s,n){const r=this.strings;let o=!1;if(r===void 0)e=C(this,e,t,0),o=!T(e)||e!==this._$AH&&e!==b,o&&(this._$AH=e);else{const l=e;let h,d;for(e=r[0],h=0;h<r.length-1;h++)d=C(this,l[s+h],t,h),d===b&&(d=this._$AH[h]),o||=!T(d)||d!==this._$AH[h],d===c?e=c:e!==c&&(e+=(d??"")+r[h+1]),this._$AH[h]=d}o&&!n&&this.j(e)}j(e){e===c?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class Ue extends D{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===c?void 0:e}}class Pe extends D{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==c)}}class ve extends D{constructor(e,t,s,n,r){super(e,t,s,n,r),this.type=5}_$AI(e,t=this){if((e=C(this,e,t,0)??c)===b)return;const s=this._$AH,n=e===c&&s!==c||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,r=e!==c&&(s===c||n);n&&this.element.removeEventListener(this.name,this,s),r&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class Oe{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){C(this,e)}}const Te=W.litHtmlPolyfillSupport;Te?.(M,N),(W.litHtmlVersions??=[]).push("3.2.1");const Me=(i,e,t)=>{const s=t?.renderBefore??e;let n=s._$litPart$;if(n===void 0){const r=t?.renderBefore??null;s._$litPart$=n=new N(e.insertBefore(O(),r),r,void 0,t??{})}return n._$AI(i),n};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let P=class extends E{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Me(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return b}};P._$litElement$=!0,P.finalized=!0,globalThis.litElementHydrateSupport?.({LitElement:P});const Ne=globalThis.litElementPolyfillSupport;Ne?.({LitElement:P});(globalThis.litElementVersions??=[]).push("4.1.1");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Re=i=>(e,t)=>{t!==void 0?t.addInitializer(()=>{customElements.define(i,e)}):customElements.define(i,e)};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ie={attribute:!0,type:String,converter:x,reflect:!1,hasChanged:G},xe=(i=Ie,e,t)=>{const{kind:s,metadata:n}=t;let r=globalThis.litPropertyMetadata.get(n);if(r===void 0&&globalThis.litPropertyMetadata.set(n,r=new Map),r.set(t.name,i),s==="accessor"){const{name:o}=t;return{set(l){const h=e.get.call(this);e.set.call(this,l),this.requestUpdate(o,h,i)},init(l){return l!==void 0&&this.P(o,void 0,i),l}}}if(s==="setter"){const{name:o}=t;return function(l){const h=this[o];e.call(this,l),this.requestUpdate(o,h,i)}}throw Error("Unsupported decorator location: "+s)};function $(i){return(e,t)=>typeof t=="object"?xe(i,e,t):((s,n,r)=>{const o=n.hasOwnProperty(r);return n.constructor.createProperty(r,o?{...s,wrapped:!0}:s),o?Object.getOwnPropertyDescriptor(n,r):void 0})(i,e,t)}/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const He=i=>i.strings===void 0;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Le={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},ke=i=>(...e)=>({_$litDirective$:i,values:e});let De=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,s){this._$Ct=e,this._$AM=t,this._$Ci=s}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const v=(i,e)=>{const t=i._$AN;if(t===void 0)return!1;for(const s of t)s._$AO?.(e,!1),v(s,e);return!0},L=i=>{let e,t;do{if((e=i._$AM)===void 0)break;t=e._$AN,t.delete(i),i=e}while(t?.size===0)},ae=i=>{for(let e;e=i._$AM;i=e){let t=e._$AN;if(t===void 0)e._$AN=t=new Set;else if(t.has(i))break;t.add(i),je(e)}};function ze(i){this._$AN!==void 0?(L(this),this._$AM=i,ae(this)):this._$AM=i}function Ye(i,e=!1,t=0){const s=this._$AH,n=this._$AN;if(n!==void 0&&n.size!==0)if(e)if(Array.isArray(s))for(let r=t;r<s.length;r++)v(s[r],!1),L(s[r]);else s!=null&&(v(s,!1),L(s));else v(this,i)}const je=i=>{i.type==Le.CHILD&&(i._$AP??=Ye,i._$AQ??=ze)};class Be extends De{constructor(){super(...arguments),this._$AN=void 0}_$AT(e,t,s){super._$AT(e,t,s),ae(this),this.isConnected=e._$AU}_$AO(e,t=!0){e!==this.isConnected&&(this.isConnected=e,e?this.reconnected?.():this.disconnected?.()),t&&(v(this,e),L(this))}setValue(e){if(He(this._$Ct))this._$Ct._$AI(e,this);else{const t=[...this._$Ct._$AH];t[this._$Ci]=e,this._$Ct._$AI(t,this,0)}}disconnected(){}reconnected(){}}/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ge=()=>new We;class We{}const Y=new WeakMap,Ve=ke(class extends Be{render(i){return c}update(i,[e]){const t=e!==this.Y;return t&&this.Y!==void 0&&this.rt(void 0),(t||this.lt!==this.ct)&&(this.Y=e,this.ht=i.options?.host,this.rt(this.ct=i.element)),c}rt(i){if(this.isConnected||(i=void 0),typeof this.Y=="function"){const e=this.ht??globalThis;let t=Y.get(e);t===void 0&&(t=new WeakMap,Y.set(e,t)),t.get(this.Y)!==void 0&&this.Y.call(this.ht,void 0),t.set(this.Y,i),i!==void 0&&this.Y.call(this.ht,i)}else this.Y.value=i}get lt(){return typeof this.Y=="function"?Y.get(this.ht??globalThis)?.get(this.Y):this.Y?.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}});var qe=Object.defineProperty,Ke=Object.getOwnPropertyDescriptor,f=(i,e,t,s)=>{for(var n=s>1?void 0:s?Ke(e,t):e,r=i.length-1,o;r>=0;r--)(o=i[r])&&(n=(s?o(e,t,n):o(n))||n);return s&&n&&qe(e,t,n),n};function Fe(i){return customElements.get(i)?e=>e:Re(i)}let u=class extends P{constructor(){super(),this.GISCUS_SESSION_KEY="giscus-session",this.GISCUS_DEFAULT_HOST="https://giscus.app",this.ERROR_SUGGESTION="Please consider reporting this error at https://github.com/giscus/giscus/issues/new.",this.__session="",this._iframeRef=Ge(),this.messageEventHandler=this.handleMessageEvent.bind(this),this.hasLoaded=!1,this.host=this.GISCUS_DEFAULT_HOST,this.strict="0",this.reactionsEnabled="1",this.emitMetadata="0",this.inputPosition="bottom",this.theme="light",this.lang="en",this.loading="eager",this.setupSession(),window.addEventListener("message",this.messageEventHandler)}get iframeRef(){var i;return(i=this._iframeRef)==null?void 0:i.value}get _host(){try{return new URL(this.host),this.host}catch{return this.GISCUS_DEFAULT_HOST}}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("message",this.messageEventHandler)}_formatError(i){return`[giscus] An error occurred. Error message: "${i}".`}setupSession(){const i=location.href,e=new URL(i),t=localStorage.getItem(this.GISCUS_SESSION_KEY),s=e.searchParams.get("giscus")??"";if(this.__session="",s){localStorage.setItem(this.GISCUS_SESSION_KEY,JSON.stringify(s)),this.__session=s,e.searchParams.delete("giscus"),e.hash="",history.replaceState(void 0,document.title,e.toString());return}if(t)try{this.__session=JSON.parse(t)}catch(n){localStorage.removeItem(this.GISCUS_SESSION_KEY),console.warn(`${this._formatError(n?.message)} Session has been cleared.`)}}signOut(){localStorage.removeItem(this.GISCUS_SESSION_KEY),this.__session="",this.update(new Map)}handleMessageEvent(i){if(i.origin!==this._host)return;const{data:e}=i;if(!(typeof e=="object"&&e.giscus))return;if(this.iframeRef&&e.giscus.resizeHeight&&(this.iframeRef.style.height=`${e.giscus.resizeHeight}px`),e.giscus.signOut){console.info("[giscus] User has logged out. Session has been cleared."),this.signOut();return}if(!e.giscus.error)return;const t=e.giscus.error;if(t.includes("Bad credentials")||t.includes("Invalid state value")||t.includes("State has expired")){if(localStorage.getItem(this.GISCUS_SESSION_KEY)!==null){console.warn(`${this._formatError(t)} Session has been cleared.`),this.signOut();return}console.error(`${this._formatError(t)} No session is stored initially. ${this.ERROR_SUGGESTION}`)}if(t.includes("Discussion not found")){console.warn(`[giscus] ${t}. A new discussion will be created if a comment/reaction is submitted.`);return}console.error(`${this._formatError(t)} ${this.ERROR_SUGGESTION}`)}sendMessage(i){var e;!((e=this.iframeRef)!=null&&e.contentWindow)||!this.hasLoaded||this.iframeRef.contentWindow.postMessage({giscus:i},this._host)}updateConfig(){const i={setConfig:{repo:this.repo,repoId:this.repoId,category:this.category,categoryId:this.categoryId,term:this.getTerm(),number:+this.getNumber(),strict:this.strict==="1",reactionsEnabled:this.reactionsEnabled==="1",emitMetadata:this.emitMetadata==="1",inputPosition:this.inputPosition,theme:this.theme,lang:this.lang}};this.sendMessage(i)}firstUpdated(){var i;(i=this.iframeRef)==null||i.addEventListener("load",()=>{var e;(e=this.iframeRef)==null||e.classList.remove("loading"),this.hasLoaded=!0,this.updateConfig()})}requestUpdate(i,e,t){if(!this.hasUpdated||i==="host"){super.requestUpdate(i,e,t);return}this.updateConfig()}getMetaContent(i,e=!1){const t=e?`meta[property='og:${i}'],`:"",s=document.querySelector(t+`meta[name='${i}']`);return s?s.content:""}_getCleanedUrl(){const i=new URL(location.href);return i.searchParams.delete("giscus"),i.hash="",i}getTerm(){switch(this.mapping){case"url":return this._getCleanedUrl().toString();case"title":return document.title;case"og:title":return this.getMetaContent("title",!0);case"specific":return this.term??"";case"number":return"";case"pathname":default:return location.pathname.length<2?"index":location.pathname.substring(1).replace(/\.\w+$/,"")}}getNumber(){return this.mapping==="number"?this.term??"":""}getIframeSrc(){const i=this._getCleanedUrl().toString(),e=`${i}${this.id?"#"+this.id:""}`,t=this.getMetaContent("description",!0),s=this.getMetaContent("giscus:backlink")||i,n={origin:e,session:this.__session,repo:this.repo,repoId:this.repoId??"",category:this.category??"",categoryId:this.categoryId??"",term:this.getTerm(),number:this.getNumber(),strict:this.strict,reactionsEnabled:this.reactionsEnabled,emitMetadata:this.emitMetadata,inputPosition:this.inputPosition,theme:this.theme,description:t,backLink:s},r=this._host,o=this.lang?`/${this.lang}`:"",l=new URLSearchParams(n);return`${r}${o}/widget?${l.toString()}`}render(){return be`
      <iframe
        title="Comments"
        scrolling="no"
        class="loading"
        ${Ve(this._iframeRef)}
        src=${this.getIframeSrc()}
        loading=${this.loading}
        allow="clipboard-write"
        part="iframe"
      ></iframe>
    `}};u.styles=ce`
    :host,
    iframe {
      width: 100%;
      border: none;
      min-height: 150px;
      color-scheme: light dark;
    }

    iframe.loading {
      opacity: 0;
    }
  `;f([$({reflect:!0})],u.prototype,"host",2);f([$({reflect:!0})],u.prototype,"repo",2);f([$({reflect:!0})],u.prototype,"repoId",2);f([$({reflect:!0})],u.prototype,"category",2);f([$({reflect:!0})],u.prototype,"categoryId",2);f([$({reflect:!0})],u.prototype,"mapping",2);f([$({reflect:!0})],u.prototype,"term",2);f([$({reflect:!0})],u.prototype,"strict",2);f([$({reflect:!0})],u.prototype,"reactionsEnabled",2);f([$({reflect:!0})],u.prototype,"emitMetadata",2);f([$({reflect:!0})],u.prototype,"inputPosition",2);f([$({reflect:!0})],u.prototype,"theme",2);f([$({reflect:!0})],u.prototype,"lang",2);f([$({reflect:!0})],u.prototype,"loading",2);u=f([Fe("giscus-widget")],u);
