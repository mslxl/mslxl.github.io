function i(){return i=Object.assign?Object.assign.bind():function(s){for(var e=1;e<arguments.length;e++){var r=arguments[e];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(s[n]=r[n])}return s},i.apply(this,arguments)}const w=s=>String(s).split(".").map(e=>String(parseInt(e||"0",10))).concat(["0","0"]).slice(0,3).join(".");class y{constructor(){this.isSwupPlugin=!0,this.swup=void 0,this.version=void 0,this.requires={},this.handlersToUnregister=[]}mount(){}unmount(){this.handlersToUnregister.forEach(e=>e()),this.handlersToUnregister=[]}_beforeMount(){if(!this.name)throw new Error("You must define a name of plugin when creating a class.")}_afterUnmount(){}_checkRequirements(){return typeof this.requires!="object"||Object.entries(this.requires).forEach(([e,r])=>{if(!function(n,o,u){const d=function(a,h){var c;if(a==="swup")return(c=h.version)!=null?c:"";{var f;const l=h.findPlugin(a);return(f=l?.version)!=null?f:""}}(n,u);return!!d&&((a,h)=>h.every(c=>{const[,f,l]=c.match(/^([\D]+)?(.*)$/)||[];var m,p;return((v,b)=>{const g={"":t=>t===0,">":t=>t>0,">=":t=>t>=0,"<":t=>t<0,"<=":t=>t<=0};return(g[b]||g[""])(v)})((p=l,m=w(m=a),p=w(p),m.localeCompare(p,void 0,{numeric:!0})),f||">=")}))(d,o)}(e,r=Array.isArray(r)?r:[r],this.swup)){const n=`${e} ${r.join(", ")}`;throw new Error(`Plugin version mismatch: ${this.name} requires ${n}`)}}),!0}on(e,r,n={}){var o;r=!(o=r).name.startsWith("bound ")||o.hasOwnProperty("prototype")?r.bind(this):r;const u=this.swup.hooks.on(e,r,n);return this.handlersToUnregister.push(u),u}once(e,r,n={}){return this.on(e,r,i({},n,{once:!0}))}before(e,r,n={}){return this.on(e,r,i({},n,{before:!0}))}replace(e,r,n={}){return this.on(e,r,i({},n,{replace:!0}))}off(e,r){return this.swup.hooks.off(e,r)}}export{y as e};
