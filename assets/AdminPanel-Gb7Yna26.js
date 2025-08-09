import{g as ie,_ as Be,F as qe,i as He,a as $e,C as ze,r as de,S as Ge,b as k,o as Ve,j as c,R as G,m as ne,c as Xe,d as We,A as Ke,s as Ze,e as Ye,f as Je,h as Qe,k as et}from"./index-Cr9sub3c.js";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ye="firebasestorage.googleapis.com",Re="storageBucket",tt=120*1e3,st=600*1e3,nt=1e3;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class b extends qe{constructor(e,s,n=0){super(ee(e),`Firebase Storage: ${s} (${ee(e)})`),this.status_=n,this.customData={serverResponse:null},this._baseMessage=this.message,Object.setPrototypeOf(this,b.prototype)}get status(){return this.status_}set status(e){this.status_=e}_codeEquals(e){return ee(e)===this.code}get serverResponse(){return this.customData.serverResponse}set serverResponse(e){this.customData.serverResponse=e,this.customData.serverResponse?this.message=`${this._baseMessage}
${this.customData.serverResponse}`:this.message=this._baseMessage}}var _;(function(t){t.UNKNOWN="unknown",t.OBJECT_NOT_FOUND="object-not-found",t.BUCKET_NOT_FOUND="bucket-not-found",t.PROJECT_NOT_FOUND="project-not-found",t.QUOTA_EXCEEDED="quota-exceeded",t.UNAUTHENTICATED="unauthenticated",t.UNAUTHORIZED="unauthorized",t.UNAUTHORIZED_APP="unauthorized-app",t.RETRY_LIMIT_EXCEEDED="retry-limit-exceeded",t.INVALID_CHECKSUM="invalid-checksum",t.CANCELED="canceled",t.INVALID_EVENT_NAME="invalid-event-name",t.INVALID_URL="invalid-url",t.INVALID_DEFAULT_BUCKET="invalid-default-bucket",t.NO_DEFAULT_BUCKET="no-default-bucket",t.CANNOT_SLICE_BLOB="cannot-slice-blob",t.SERVER_FILE_WRONG_SIZE="server-file-wrong-size",t.NO_DOWNLOAD_URL="no-download-url",t.INVALID_ARGUMENT="invalid-argument",t.INVALID_ARGUMENT_COUNT="invalid-argument-count",t.APP_DELETED="app-deleted",t.INVALID_ROOT_OPERATION="invalid-root-operation",t.INVALID_FORMAT="invalid-format",t.INTERNAL_ERROR="internal-error",t.UNSUPPORTED_ENVIRONMENT="unsupported-environment"})(_||(_={}));function ee(t){return"storage/"+t}function oe(){const t="An unknown error occurred, please check the error payload for server response.";return new b(_.UNKNOWN,t)}function rt(t){return new b(_.OBJECT_NOT_FOUND,"Object '"+t+"' does not exist.")}function it(t){return new b(_.QUOTA_EXCEEDED,"Quota for bucket '"+t+"' exceeded, please view quota on https://firebase.google.com/pricing/.")}function ot(){const t="User is not authenticated, please authenticate using Firebase Authentication and try again.";return new b(_.UNAUTHENTICATED,t)}function at(){return new b(_.UNAUTHORIZED_APP,"This app does not have permission to access Firebase Storage on this project.")}function lt(t){return new b(_.UNAUTHORIZED,"User does not have permission to access '"+t+"'.")}function Te(){return new b(_.RETRY_LIMIT_EXCEEDED,"Max retry time for operation exceeded, please try again.")}function xe(){return new b(_.CANCELED,"User canceled the upload/download.")}function ct(t){return new b(_.INVALID_URL,"Invalid URL '"+t+"'.")}function ut(t){return new b(_.INVALID_DEFAULT_BUCKET,"Invalid default bucket '"+t+"'.")}function ht(){return new b(_.NO_DEFAULT_BUCKET,"No default bucket found. Did you set the '"+Re+"' property when initializing the app?")}function we(){return new b(_.CANNOT_SLICE_BLOB,"Cannot slice blob for upload. Please retry the upload.")}function dt(){return new b(_.SERVER_FILE_WRONG_SIZE,"Server recorded incorrect upload file size, please retry the upload.")}function ft(){return new b(_.NO_DOWNLOAD_URL,"The given file does not have any download URLs.")}function pt(t){return new b(_.UNSUPPORTED_ENVIRONMENT,`${t} is missing. Make sure to install the required polyfills. See https://firebase.google.com/docs/web/environments-js-sdk#polyfills for more information.`)}function re(t){return new b(_.INVALID_ARGUMENT,t)}function ke(){return new b(_.APP_DELETED,"The Firebase app was deleted.")}function _t(t){return new b(_.INVALID_ROOT_OPERATION,"The operation '"+t+"' cannot be performed on a root reference, create a non-root reference using child, such as .child('file.png').")}function z(t,e){return new b(_.INVALID_FORMAT,"String does not match format '"+t+"': "+e)}function $(t){throw new b(_.INTERNAL_ERROR,"Internal error: "+t)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class S{constructor(e,s){this.bucket=e,this.path_=s}get path(){return this.path_}get isRoot(){return this.path.length===0}fullServerUrl(){const e=encodeURIComponent;return"/b/"+e(this.bucket)+"/o/"+e(this.path)}bucketOnlyServerUrl(){return"/b/"+encodeURIComponent(this.bucket)+"/o"}static makeFromBucketSpec(e,s){let n;try{n=S.makeFromUrl(e,s)}catch{return new S(e,"")}if(n.path==="")return n;throw ut(e)}static makeFromUrl(e,s){let n=null;const r="([A-Za-z0-9.\\-_]+)";function i(x){x.path.charAt(x.path.length-1)==="/"&&(x.path_=x.path_.slice(0,-1))}const o="(/(.*))?$",l=new RegExp("^gs://"+r+o,"i"),a={bucket:1,path:3};function u(x){x.path_=decodeURIComponent(x.path)}const h="v[A-Za-z0-9_]+",d=s.replace(/[.]/g,"\\."),p="(/([^?#]*).*)?$",y=new RegExp(`^https?://${d}/${h}/b/${r}/o${p}`,"i"),m={bucket:1,path:3},T=s===ye?"(?:storage.googleapis.com|storage.cloud.google.com)":s,g="([^?#]*)",P=new RegExp(`^https?://${T}/${r}/${g}`,"i"),w=[{regex:l,indices:a,postModify:i},{regex:y,indices:m,postModify:u},{regex:P,indices:{bucket:1,path:2},postModify:u}];for(let x=0;x<w.length;x++){const O=w[x],C=O.regex.exec(e);if(C){const f=C[O.indices.bucket];let R=C[O.indices.path];R||(R=""),n=new S(f,R),O.postModify(n);break}}if(n==null)throw ct(e);return n}}class mt{constructor(e){this.promise_=Promise.reject(e)}getPromise(){return this.promise_}cancel(e=!1){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function gt(t,e,s){let n=1,r=null,i=null,o=!1,l=0;function a(){return l===2}let u=!1;function h(...g){u||(u=!0,e.apply(null,g))}function d(g){r=setTimeout(()=>{r=null,t(y,a())},g)}function p(){i&&clearTimeout(i)}function y(g,...P){if(u){p();return}if(g){p(),h.call(null,g,...P);return}if(a()||o){p(),h.call(null,g,...P);return}n<64&&(n*=2);let w;l===1?(l=2,w=0):w=(n+Math.random())*1e3,d(w)}let m=!1;function T(g){m||(m=!0,p(),!u&&(r!==null?(g||(l=2),clearTimeout(r),d(0)):g||(l=1)))}return d(0),i=setTimeout(()=>{o=!0,T(!0)},s),T}function bt(t){t(!1)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function yt(t){return t!==void 0}function Rt(t){return typeof t=="function"}function Tt(t){return typeof t=="object"&&!Array.isArray(t)}function Y(t){return typeof t=="string"||t instanceof String}function fe(t){return ae()&&t instanceof Blob}function ae(){return typeof Blob<"u"}function pe(t,e,s,n){if(n<e)throw re(`Invalid value for '${t}'. Expected ${e} or greater.`);if(n>s)throw re(`Invalid value for '${t}'. Expected ${s} or less.`)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function V(t,e,s){let n=e;return s==null&&(n=`https://${e}`),`${s}://${n}/v0${t}`}function Ue(t){const e=encodeURIComponent;let s="?";for(const n in t)if(t.hasOwnProperty(n)){const r=e(n)+"="+e(t[n]);s=s+r+"&"}return s=s.slice(0,-1),s}var L;(function(t){t[t.NO_ERROR=0]="NO_ERROR",t[t.NETWORK_ERROR=1]="NETWORK_ERROR",t[t.ABORT=2]="ABORT"})(L||(L={}));/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ee(t,e){const s=t>=500&&t<600,r=[408,429].indexOf(t)!==-1,i=e.indexOf(t)!==-1;return s||r||i}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xt{constructor(e,s,n,r,i,o,l,a,u,h,d,p=!0,y=!1){this.url_=e,this.method_=s,this.headers_=n,this.body_=r,this.successCodes_=i,this.additionalRetryCodes_=o,this.callback_=l,this.errorCallback_=a,this.timeout_=u,this.progressCallback_=h,this.connectionFactory_=d,this.retry=p,this.isUsingEmulator=y,this.pendingConnection_=null,this.backoffId_=null,this.canceled_=!1,this.appDelete_=!1,this.promise_=new Promise((m,T)=>{this.resolve_=m,this.reject_=T,this.start_()})}start_(){const e=(n,r)=>{if(r){n(!1,new W(!1,null,!0));return}const i=this.connectionFactory_();this.pendingConnection_=i;const o=l=>{const a=l.loaded,u=l.lengthComputable?l.total:-1;this.progressCallback_!==null&&this.progressCallback_(a,u)};this.progressCallback_!==null&&i.addUploadProgressListener(o),i.send(this.url_,this.method_,this.isUsingEmulator,this.body_,this.headers_).then(()=>{this.progressCallback_!==null&&i.removeUploadProgressListener(o),this.pendingConnection_=null;const l=i.getErrorCode()===L.NO_ERROR,a=i.getStatus();if(!l||Ee(a,this.additionalRetryCodes_)&&this.retry){const h=i.getErrorCode()===L.ABORT;n(!1,new W(!1,null,h));return}const u=this.successCodes_.indexOf(a)!==-1;n(!0,new W(u,i))})},s=(n,r)=>{const i=this.resolve_,o=this.reject_,l=r.connection;if(r.wasSuccessCode)try{const a=this.callback_(l,l.getResponse());yt(a)?i(a):i()}catch(a){o(a)}else if(l!==null){const a=oe();a.serverResponse=l.getErrorText(),this.errorCallback_?o(this.errorCallback_(l,a)):o(a)}else if(r.canceled){const a=this.appDelete_?ke():xe();o(a)}else{const a=Te();o(a)}};this.canceled_?s(!1,new W(!1,null,!0)):this.backoffId_=gt(e,s,this.timeout_)}getPromise(){return this.promise_}cancel(e){this.canceled_=!0,this.appDelete_=e||!1,this.backoffId_!==null&&bt(this.backoffId_),this.pendingConnection_!==null&&this.pendingConnection_.abort()}}class W{constructor(e,s,n){this.wasSuccessCode=e,this.connection=s,this.canceled=!!n}}function wt(t,e){e!==null&&e.length>0&&(t.Authorization="Firebase "+e)}function kt(t,e){t["X-Firebase-Storage-Version"]="webjs/"+(e??"AppManager")}function Ut(t,e){e&&(t["X-Firebase-GMPID"]=e)}function Et(t,e){e!==null&&(t["X-Firebase-AppCheck"]=e)}function At(t,e,s,n,r,i,o=!0,l=!1){const a=Ue(t.urlParams),u=t.url+a,h=Object.assign({},t.headers);return Ut(h,e),wt(h,s),kt(h,i),Et(h,n),new xt(u,t.method,h,t.body,t.successCodes,t.additionalRetryCodes,t.handler,t.errorHandler,t.timeout,t.progressCallback,r,o,l)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Pt(){return typeof BlobBuilder<"u"?BlobBuilder:typeof WebKitBlobBuilder<"u"?WebKitBlobBuilder:void 0}function St(...t){const e=Pt();if(e!==void 0){const s=new e;for(let n=0;n<t.length;n++)s.append(t[n]);return s.getBlob()}else{if(ae())return new Blob(t);throw new b(_.UNSUPPORTED_ENVIRONMENT,"This browser doesn't seem to support creating Blobs")}}function Nt(t,e,s){return t.webkitSlice?t.webkitSlice(e,s):t.mozSlice?t.mozSlice(e,s):t.slice?t.slice(e,s):null}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ct(t){if(typeof atob>"u")throw pt("base-64");return atob(t)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const v={RAW:"raw",BASE64:"base64",BASE64URL:"base64url",DATA_URL:"data_url"};class te{constructor(e,s){this.data=e,this.contentType=s||null}}function vt(t,e){switch(t){case v.RAW:return new te(Ae(e));case v.BASE64:case v.BASE64URL:return new te(Pe(t,e));case v.DATA_URL:return new te(It(e),Dt(e))}throw oe()}function Ae(t){const e=[];for(let s=0;s<t.length;s++){let n=t.charCodeAt(s);if(n<=127)e.push(n);else if(n<=2047)e.push(192|n>>6,128|n&63);else if((n&64512)===55296)if(!(s<t.length-1&&(t.charCodeAt(s+1)&64512)===56320))e.push(239,191,189);else{const i=n,o=t.charCodeAt(++s);n=65536|(i&1023)<<10|o&1023,e.push(240|n>>18,128|n>>12&63,128|n>>6&63,128|n&63)}else(n&64512)===56320?e.push(239,191,189):e.push(224|n>>12,128|n>>6&63,128|n&63)}return new Uint8Array(e)}function Ot(t){let e;try{e=decodeURIComponent(t)}catch{throw z(v.DATA_URL,"Malformed data URL.")}return Ae(e)}function Pe(t,e){switch(t){case v.BASE64:{const r=e.indexOf("-")!==-1,i=e.indexOf("_")!==-1;if(r||i)throw z(t,"Invalid character '"+(r?"-":"_")+"' found: is it base64url encoded?");break}case v.BASE64URL:{const r=e.indexOf("+")!==-1,i=e.indexOf("/")!==-1;if(r||i)throw z(t,"Invalid character '"+(r?"+":"/")+"' found: is it base64 encoded?");e=e.replace(/-/g,"+").replace(/_/g,"/");break}}let s;try{s=Ct(e)}catch(r){throw r.message.includes("polyfill")?r:z(t,"Invalid character found")}const n=new Uint8Array(s.length);for(let r=0;r<s.length;r++)n[r]=s.charCodeAt(r);return n}class Se{constructor(e){this.base64=!1,this.contentType=null;const s=e.match(/^data:([^,]+)?,/);if(s===null)throw z(v.DATA_URL,"Must be formatted 'data:[<mediatype>][;base64],<data>");const n=s[1]||null;n!=null&&(this.base64=Lt(n,";base64"),this.contentType=this.base64?n.substring(0,n.length-7):n),this.rest=e.substring(e.indexOf(",")+1)}}function It(t){const e=new Se(t);return e.base64?Pe(v.BASE64,e.rest):Ot(e.rest)}function Dt(t){return new Se(t).contentType}function Lt(t,e){return t.length>=e.length?t.substring(t.length-e.length)===e:!1}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class D{constructor(e,s){let n=0,r="";fe(e)?(this.data_=e,n=e.size,r=e.type):e instanceof ArrayBuffer?(s?this.data_=new Uint8Array(e):(this.data_=new Uint8Array(e.byteLength),this.data_.set(new Uint8Array(e))),n=this.data_.length):e instanceof Uint8Array&&(s?this.data_=e:(this.data_=new Uint8Array(e.length),this.data_.set(e)),n=e.length),this.size_=n,this.type_=r}size(){return this.size_}type(){return this.type_}slice(e,s){if(fe(this.data_)){const n=this.data_,r=Nt(n,e,s);return r===null?null:new D(r)}else{const n=new Uint8Array(this.data_.buffer,e,s-e);return new D(n,!0)}}static getBlob(...e){if(ae()){const s=e.map(n=>n instanceof D?n.data_:n);return new D(St.apply(null,s))}else{const s=e.map(o=>Y(o)?vt(v.RAW,o).data:o.data_);let n=0;s.forEach(o=>{n+=o.byteLength});const r=new Uint8Array(n);let i=0;return s.forEach(o=>{for(let l=0;l<o.length;l++)r[i++]=o[l]}),new D(r,!0)}}uploadData(){return this.data_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ne(t){let e;try{e=JSON.parse(t)}catch{return null}return Tt(e)?e:null}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function jt(t){if(t.length===0)return null;const e=t.lastIndexOf("/");return e===-1?"":t.slice(0,e)}function Ft(t,e){const s=e.split("/").filter(n=>n.length>0).join("/");return t.length===0?s:t+"/"+s}function Ce(t){const e=t.lastIndexOf("/",t.length-2);return e===-1?t:t.slice(e+1)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Mt(t,e){return e}class E{constructor(e,s,n,r){this.server=e,this.local=s||e,this.writable=!!n,this.xform=r||Mt}}let K=null;function Bt(t){return!Y(t)||t.length<2?t:Ce(t)}function ve(){if(K)return K;const t=[];t.push(new E("bucket")),t.push(new E("generation")),t.push(new E("metageneration")),t.push(new E("name","fullPath",!0));function e(i,o){return Bt(o)}const s=new E("name");s.xform=e,t.push(s);function n(i,o){return o!==void 0?Number(o):o}const r=new E("size");return r.xform=n,t.push(r),t.push(new E("timeCreated")),t.push(new E("updated")),t.push(new E("md5Hash",null,!0)),t.push(new E("cacheControl",null,!0)),t.push(new E("contentDisposition",null,!0)),t.push(new E("contentEncoding",null,!0)),t.push(new E("contentLanguage",null,!0)),t.push(new E("contentType",null,!0)),t.push(new E("metadata","customMetadata",!0)),K=t,K}function qt(t,e){function s(){const n=t.bucket,r=t.fullPath,i=new S(n,r);return e._makeStorageReference(i)}Object.defineProperty(t,"ref",{get:s})}function Ht(t,e,s){const n={};n.type="file";const r=s.length;for(let i=0;i<r;i++){const o=s[i];n[o.local]=o.xform(n,e[o.server])}return qt(n,t),n}function Oe(t,e,s){const n=Ne(e);return n===null?null:Ht(t,n,s)}function $t(t,e,s,n){const r=Ne(e);if(r===null||!Y(r.downloadTokens))return null;const i=r.downloadTokens;if(i.length===0)return null;const o=encodeURIComponent;return i.split(",").map(u=>{const h=t.bucket,d=t.fullPath,p="/b/"+o(h)+"/o/"+o(d),y=V(p,s,n),m=Ue({alt:"media",token:u});return y+m})[0]}function Ie(t,e){const s={},n=e.length;for(let r=0;r<n;r++){const i=e[r];i.writable&&(s[i.server]=t[i.local])}return JSON.stringify(s)}class B{constructor(e,s,n,r){this.url=e,this.method=s,this.handler=n,this.timeout=r,this.urlParams={},this.headers={},this.body=null,this.errorHandler=null,this.progressCallback=null,this.successCodes=[200],this.additionalRetryCodes=[]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function I(t){if(!t)throw oe()}function le(t,e){function s(n,r){const i=Oe(t,r,e);return I(i!==null),i}return s}function zt(t,e){function s(n,r){const i=Oe(t,r,e);return I(i!==null),$t(i,r,t.host,t._protocol)}return s}function X(t){function e(s,n){let r;return s.getStatus()===401?s.getErrorText().includes("Firebase App Check token is invalid")?r=at():r=ot():s.getStatus()===402?r=it(t.bucket):s.getStatus()===403?r=lt(t.path):r=n,r.status=s.getStatus(),r.serverResponse=n.serverResponse,r}return e}function De(t){const e=X(t);function s(n,r){let i=e(n,r);return n.getStatus()===404&&(i=rt(t.path)),i.serverResponse=r.serverResponse,i}return s}function Gt(t,e,s){const n=e.fullServerUrl(),r=V(n,t.host,t._protocol),i="GET",o=t.maxOperationRetryTime,l=new B(r,i,le(t,s),o);return l.errorHandler=De(e),l}function Vt(t,e,s){const n=e.fullServerUrl(),r=V(n,t.host,t._protocol),i="GET",o=t.maxOperationRetryTime,l=new B(r,i,zt(t,s),o);return l.errorHandler=De(e),l}function Xt(t,e){return t&&t.contentType||e&&e.type()||"application/octet-stream"}function Le(t,e,s){const n=Object.assign({},s);return n.fullPath=t.path,n.size=e.size(),n.contentType||(n.contentType=Xt(null,e)),n}function Wt(t,e,s,n,r){const i=e.bucketOnlyServerUrl(),o={"X-Goog-Upload-Protocol":"multipart"};function l(){let w="";for(let x=0;x<2;x++)w=w+Math.random().toString().slice(2);return w}const a=l();o["Content-Type"]="multipart/related; boundary="+a;const u=Le(e,n,r),h=Ie(u,s),d="--"+a+`\r
Content-Type: application/json; charset=utf-8\r
\r
`+h+`\r
--`+a+`\r
Content-Type: `+u.contentType+`\r
\r
`,p=`\r
--`+a+"--",y=D.getBlob(d,n,p);if(y===null)throw we();const m={name:u.fullPath},T=V(i,t.host,t._protocol),g="POST",P=t.maxUploadRetryTime,N=new B(T,g,le(t,s),P);return N.urlParams=m,N.headers=o,N.body=y.uploadData(),N.errorHandler=X(e),N}class Z{constructor(e,s,n,r){this.current=e,this.total=s,this.finalized=!!n,this.metadata=r||null}}function ce(t,e){let s=null;try{s=t.getResponseHeader("X-Goog-Upload-Status")}catch{I(!1)}return I(!!s&&(e||["active"]).indexOf(s)!==-1),s}function Kt(t,e,s,n,r){const i=e.bucketOnlyServerUrl(),o=Le(e,n,r),l={name:o.fullPath},a=V(i,t.host,t._protocol),u="POST",h={"X-Goog-Upload-Protocol":"resumable","X-Goog-Upload-Command":"start","X-Goog-Upload-Header-Content-Length":`${n.size()}`,"X-Goog-Upload-Header-Content-Type":o.contentType,"Content-Type":"application/json; charset=utf-8"},d=Ie(o,s),p=t.maxUploadRetryTime;function y(T){ce(T);let g;try{g=T.getResponseHeader("X-Goog-Upload-URL")}catch{I(!1)}return I(Y(g)),g}const m=new B(a,u,y,p);return m.urlParams=l,m.headers=h,m.body=d,m.errorHandler=X(e),m}function Zt(t,e,s,n){const r={"X-Goog-Upload-Command":"query"};function i(u){const h=ce(u,["active","final"]);let d=null;try{d=u.getResponseHeader("X-Goog-Upload-Size-Received")}catch{I(!1)}d||I(!1);const p=Number(d);return I(!isNaN(p)),new Z(p,n.size(),h==="final")}const o="POST",l=t.maxUploadRetryTime,a=new B(s,o,i,l);return a.headers=r,a.errorHandler=X(e),a}const _e=256*1024;function Yt(t,e,s,n,r,i,o,l){const a=new Z(0,0);if(o?(a.current=o.current,a.total=o.total):(a.current=0,a.total=n.size()),n.size()!==a.total)throw dt();const u=a.total-a.current;let h=u;r>0&&(h=Math.min(h,r));const d=a.current,p=d+h;let y="";h===0?y="finalize":u===h?y="upload, finalize":y="upload";const m={"X-Goog-Upload-Command":y,"X-Goog-Upload-Offset":`${a.current}`},T=n.slice(d,p);if(T===null)throw we();function g(x,O){const C=ce(x,["active","final"]),f=a.current+h,R=n.size();let U;return C==="final"?U=le(e,i)(x,O):U=null,new Z(f,R,C==="final",U)}const P="POST",N=e.maxUploadRetryTime,w=new B(s,P,g,N);return w.headers=m,w.body=T.uploadData(),w.progressCallback=l||null,w.errorHandler=X(t),w}const A={RUNNING:"running",PAUSED:"paused",SUCCESS:"success",CANCELED:"canceled",ERROR:"error"};function se(t){switch(t){case"running":case"pausing":case"canceling":return A.RUNNING;case"paused":return A.PAUSED;case"success":return A.SUCCESS;case"canceled":return A.CANCELED;case"error":return A.ERROR;default:return A.ERROR}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jt{constructor(e,s,n){if(Rt(e)||s!=null||n!=null)this.next=e,this.error=s??void 0,this.complete=n??void 0;else{const i=e;this.next=i.next,this.error=i.error,this.complete=i.complete}}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function F(t){return(...e)=>{Promise.resolve().then(()=>t(...e))}}class Qt{constructor(){this.sent_=!1,this.xhr_=new XMLHttpRequest,this.initXhr(),this.errorCode_=L.NO_ERROR,this.sendPromise_=new Promise(e=>{this.xhr_.addEventListener("abort",()=>{this.errorCode_=L.ABORT,e()}),this.xhr_.addEventListener("error",()=>{this.errorCode_=L.NETWORK_ERROR,e()}),this.xhr_.addEventListener("load",()=>{e()})})}send(e,s,n,r,i){if(this.sent_)throw $("cannot .send() more than once");if(He(e)&&n&&(this.xhr_.withCredentials=!0),this.sent_=!0,this.xhr_.open(s,e,!0),i!==void 0)for(const o in i)i.hasOwnProperty(o)&&this.xhr_.setRequestHeader(o,i[o].toString());return r!==void 0?this.xhr_.send(r):this.xhr_.send(),this.sendPromise_}getErrorCode(){if(!this.sent_)throw $("cannot .getErrorCode() before sending");return this.errorCode_}getStatus(){if(!this.sent_)throw $("cannot .getStatus() before sending");try{return this.xhr_.status}catch{return-1}}getResponse(){if(!this.sent_)throw $("cannot .getResponse() before sending");return this.xhr_.response}getErrorText(){if(!this.sent_)throw $("cannot .getErrorText() before sending");return this.xhr_.statusText}abort(){this.xhr_.abort()}getResponseHeader(e){return this.xhr_.getResponseHeader(e)}addUploadProgressListener(e){this.xhr_.upload!=null&&this.xhr_.upload.addEventListener("progress",e)}removeUploadProgressListener(e){this.xhr_.upload!=null&&this.xhr_.upload.removeEventListener("progress",e)}}class es extends Qt{initXhr(){this.xhr_.responseType="text"}}function M(){return new es}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ts{isExponentialBackoffExpired(){return this.sleepTime>this.maxSleepTime}constructor(e,s,n=null){this._transferred=0,this._needToFetchStatus=!1,this._needToFetchMetadata=!1,this._observers=[],this._error=void 0,this._uploadUrl=void 0,this._request=void 0,this._chunkMultiplier=1,this._resolve=void 0,this._reject=void 0,this._ref=e,this._blob=s,this._metadata=n,this._mappings=ve(),this._resumable=this._shouldDoResumable(this._blob),this._state="running",this._errorHandler=r=>{if(this._request=void 0,this._chunkMultiplier=1,r._codeEquals(_.CANCELED))this._needToFetchStatus=!0,this.completeTransitions_();else{const i=this.isExponentialBackoffExpired();if(Ee(r.status,[]))if(i)r=Te();else{this.sleepTime=Math.max(this.sleepTime*2,nt),this._needToFetchStatus=!0,this.completeTransitions_();return}this._error=r,this._transition("error")}},this._metadataErrorHandler=r=>{this._request=void 0,r._codeEquals(_.CANCELED)?this.completeTransitions_():(this._error=r,this._transition("error"))},this.sleepTime=0,this.maxSleepTime=this._ref.storage.maxUploadRetryTime,this._promise=new Promise((r,i)=>{this._resolve=r,this._reject=i,this._start()}),this._promise.then(null,()=>{})}_makeProgressCallback(){const e=this._transferred;return s=>this._updateProgress(e+s)}_shouldDoResumable(e){return e.size()>256*1024}_start(){this._state==="running"&&this._request===void 0&&(this._resumable?this._uploadUrl===void 0?this._createResumable():this._needToFetchStatus?this._fetchStatus():this._needToFetchMetadata?this._fetchMetadata():this.pendingTimeout=setTimeout(()=>{this.pendingTimeout=void 0,this._continueUpload()},this.sleepTime):this._oneShotUpload())}_resolveToken(e){Promise.all([this._ref.storage._getAuthToken(),this._ref.storage._getAppCheckToken()]).then(([s,n])=>{switch(this._state){case"running":e(s,n);break;case"canceling":this._transition("canceled");break;case"pausing":this._transition("paused");break}})}_createResumable(){this._resolveToken((e,s)=>{const n=Kt(this._ref.storage,this._ref._location,this._mappings,this._blob,this._metadata),r=this._ref.storage._makeRequest(n,M,e,s);this._request=r,r.getPromise().then(i=>{this._request=void 0,this._uploadUrl=i,this._needToFetchStatus=!1,this.completeTransitions_()},this._errorHandler)})}_fetchStatus(){const e=this._uploadUrl;this._resolveToken((s,n)=>{const r=Zt(this._ref.storage,this._ref._location,e,this._blob),i=this._ref.storage._makeRequest(r,M,s,n);this._request=i,i.getPromise().then(o=>{o=o,this._request=void 0,this._updateProgress(o.current),this._needToFetchStatus=!1,o.finalized&&(this._needToFetchMetadata=!0),this.completeTransitions_()},this._errorHandler)})}_continueUpload(){const e=_e*this._chunkMultiplier,s=new Z(this._transferred,this._blob.size()),n=this._uploadUrl;this._resolveToken((r,i)=>{let o;try{o=Yt(this._ref._location,this._ref.storage,n,this._blob,e,this._mappings,s,this._makeProgressCallback())}catch(a){this._error=a,this._transition("error");return}const l=this._ref.storage._makeRequest(o,M,r,i,!1);this._request=l,l.getPromise().then(a=>{this._increaseMultiplier(),this._request=void 0,this._updateProgress(a.current),a.finalized?(this._metadata=a.metadata,this._transition("success")):this.completeTransitions_()},this._errorHandler)})}_increaseMultiplier(){_e*this._chunkMultiplier*2<32*1024*1024&&(this._chunkMultiplier*=2)}_fetchMetadata(){this._resolveToken((e,s)=>{const n=Gt(this._ref.storage,this._ref._location,this._mappings),r=this._ref.storage._makeRequest(n,M,e,s);this._request=r,r.getPromise().then(i=>{this._request=void 0,this._metadata=i,this._transition("success")},this._metadataErrorHandler)})}_oneShotUpload(){this._resolveToken((e,s)=>{const n=Wt(this._ref.storage,this._ref._location,this._mappings,this._blob,this._metadata),r=this._ref.storage._makeRequest(n,M,e,s);this._request=r,r.getPromise().then(i=>{this._request=void 0,this._metadata=i,this._updateProgress(this._blob.size()),this._transition("success")},this._errorHandler)})}_updateProgress(e){const s=this._transferred;this._transferred=e,this._transferred!==s&&this._notifyObservers()}_transition(e){if(this._state!==e)switch(e){case"canceling":case"pausing":this._state=e,this._request!==void 0?this._request.cancel():this.pendingTimeout&&(clearTimeout(this.pendingTimeout),this.pendingTimeout=void 0,this.completeTransitions_());break;case"running":const s=this._state==="paused";this._state=e,s&&(this._notifyObservers(),this._start());break;case"paused":this._state=e,this._notifyObservers();break;case"canceled":this._error=xe(),this._state=e,this._notifyObservers();break;case"error":this._state=e,this._notifyObservers();break;case"success":this._state=e,this._notifyObservers();break}}completeTransitions_(){switch(this._state){case"pausing":this._transition("paused");break;case"canceling":this._transition("canceled");break;case"running":this._start();break}}get snapshot(){const e=se(this._state);return{bytesTransferred:this._transferred,totalBytes:this._blob.size(),state:e,metadata:this._metadata,task:this,ref:this._ref}}on(e,s,n,r){const i=new Jt(s||void 0,n||void 0,r||void 0);return this._addObserver(i),()=>{this._removeObserver(i)}}then(e,s){return this._promise.then(e,s)}catch(e){return this.then(null,e)}_addObserver(e){this._observers.push(e),this._notifyObserver(e)}_removeObserver(e){const s=this._observers.indexOf(e);s!==-1&&this._observers.splice(s,1)}_notifyObservers(){this._finishPromise(),this._observers.slice().forEach(s=>{this._notifyObserver(s)})}_finishPromise(){if(this._resolve!==void 0){let e=!0;switch(se(this._state)){case A.SUCCESS:F(this._resolve.bind(null,this.snapshot))();break;case A.CANCELED:case A.ERROR:const s=this._reject;F(s.bind(null,this._error))();break;default:e=!1;break}e&&(this._resolve=void 0,this._reject=void 0)}}_notifyObserver(e){switch(se(this._state)){case A.RUNNING:case A.PAUSED:e.next&&F(e.next.bind(e,this.snapshot))();break;case A.SUCCESS:e.complete&&F(e.complete.bind(e))();break;case A.CANCELED:case A.ERROR:e.error&&F(e.error.bind(e,this._error))();break;default:e.error&&F(e.error.bind(e,this._error))()}}resume(){const e=this._state==="paused"||this._state==="pausing";return e&&this._transition("running"),e}pause(){const e=this._state==="running";return e&&this._transition("pausing"),e}cancel(){const e=this._state==="running"||this._state==="pausing";return e&&this._transition("canceling"),e}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class j{constructor(e,s){this._service=e,s instanceof S?this._location=s:this._location=S.makeFromUrl(s,e.host)}toString(){return"gs://"+this._location.bucket+"/"+this._location.path}_newRef(e,s){return new j(e,s)}get root(){const e=new S(this._location.bucket,"");return this._newRef(this._service,e)}get bucket(){return this._location.bucket}get fullPath(){return this._location.path}get name(){return Ce(this._location.path)}get storage(){return this._service}get parent(){const e=jt(this._location.path);if(e===null)return null;const s=new S(this._location.bucket,e);return new j(this._service,s)}_throwIfRoot(e){if(this._location.path==="")throw _t(e)}}function ss(t,e,s){return t._throwIfRoot("uploadBytesResumable"),new ts(t,new D(e),s)}function ns(t){t._throwIfRoot("getDownloadURL");const e=Vt(t.storage,t._location,ve());return t.storage.makeRequestWithTokens(e,M).then(s=>{if(s===null)throw ft();return s})}function rs(t,e){const s=Ft(t._location.path,e),n=new S(t._location.bucket,s);return new j(t.storage,n)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function is(t){return/^[A-Za-z]+:\/\//.test(t)}function os(t,e){return new j(t,e)}function je(t,e){if(t instanceof ue){const s=t;if(s._bucket==null)throw ht();const n=new j(s,s._bucket);return e!=null?je(n,e):n}else return e!==void 0?rs(t,e):t}function as(t,e){if(e&&is(e)){if(t instanceof ue)return os(t,e);throw re("To use ref(service, url), the first argument must be a Storage instance.")}else return je(t,e)}function me(t,e){const s=e?.[Re];return s==null?null:S.makeFromBucketSpec(s,t)}class ue{constructor(e,s,n,r,i,o=!1){this.app=e,this._authProvider=s,this._appCheckProvider=n,this._url=r,this._firebaseVersion=i,this._isUsingEmulator=o,this._bucket=null,this._host=ye,this._protocol="https",this._appId=null,this._deleted=!1,this._maxOperationRetryTime=tt,this._maxUploadRetryTime=st,this._requests=new Set,r!=null?this._bucket=S.makeFromBucketSpec(r,this._host):this._bucket=me(this._host,this.app.options)}get host(){return this._host}set host(e){this._host=e,this._url!=null?this._bucket=S.makeFromBucketSpec(this._url,e):this._bucket=me(e,this.app.options)}get maxUploadRetryTime(){return this._maxUploadRetryTime}set maxUploadRetryTime(e){pe("time",0,Number.POSITIVE_INFINITY,e),this._maxUploadRetryTime=e}get maxOperationRetryTime(){return this._maxOperationRetryTime}set maxOperationRetryTime(e){pe("time",0,Number.POSITIVE_INFINITY,e),this._maxOperationRetryTime=e}async _getAuthToken(){if(this._overrideAuthToken)return this._overrideAuthToken;const e=this._authProvider.getImmediate({optional:!0});if(e){const s=await e.getToken();if(s!==null)return s.accessToken}return null}async _getAppCheckToken(){if(Be(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const e=this._appCheckProvider.getImmediate({optional:!0});return e?(await e.getToken()).token:null}_delete(){return this._deleted||(this._deleted=!0,this._requests.forEach(e=>e.cancel()),this._requests.clear()),Promise.resolve()}_makeStorageReference(e){return new j(this,e)}_makeRequest(e,s,n,r,i=!0){if(this._deleted)return new mt(ke());{const o=At(e,this._appId,n,r,s,this._firebaseVersion,i,this._isUsingEmulator);return this._requests.add(o),o.getPromise().then(()=>this._requests.delete(o),()=>this._requests.delete(o)),o}}async makeRequestWithTokens(e,s){const[n,r]=await Promise.all([this._getAuthToken(),this._getAppCheckToken()]);return this._makeRequest(e,s,n,r).getPromise()}}const ge="@firebase/storage",be="0.14.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ls="storage";function cs(t,e,s){return t=ie(t),ss(t,e,s)}function us(t){return t=ie(t),ns(t)}function hs(t,e){return t=ie(t),as(t,e)}function ds(t,{instanceIdentifier:e}){const s=t.getProvider("app").getImmediate(),n=t.getProvider("auth-internal"),r=t.getProvider("app-check-internal");return new ue(s,n,r,e,Ge)}function fs(){$e(new ze(ls,ds,"PUBLIC").setMultipleInstances(!0)),de(ge,be,""),de(ge,be,"esm2020")}fs();const ps=G.memo(({onLogin:t,auth:e})=>{const[s,n]=k.useState(""),[r,i]=k.useState(""),[o,l]=k.useState(""),[a,u]=k.useState(!1),h=async d=>{d.preventDefault(),u(!0),l("");try{await Ze(e,s,r),t(!0)}catch(p){console.error("Login error:",p),l("Invalid credentials. Please try again.")}finally{u(!1)}};return c.jsx("div",{className:"max-w-md mx-auto mt-10",children:c.jsxs(ne.div,{initial:{opacity:0,y:-20},animate:{opacity:1,y:0},className:"p-8 rounded-2xl glass-card shadow-2xl border border-slate-200/50",children:[c.jsxs("div",{className:"text-center mb-8",children:[c.jsx("h2",{className:"text-3xl font-bold text-slate-700",children:"Admin Access"}),c.jsx("p",{className:"text-slate-500 mt-2",children:"Log in to manage your portfolio."})]}),c.jsxs("form",{onSubmit:h,className:"space-y-6",children:[c.jsxs("div",{className:"relative",children:[c.jsx(Xe,{className:"absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"}),c.jsx("input",{type:"email",placeholder:"Email",value:s,onChange:d=>n(d.target.value),className:"input-field pl-12",required:!0,disabled:a})]}),c.jsxs("div",{className:"relative",children:[c.jsx(We,{className:"absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"}),c.jsx("input",{type:"password",placeholder:"Password",value:r,onChange:d=>i(d.target.value),className:"input-field pl-12",required:!0,disabled:a})]}),c.jsx("button",{type:"submit",className:"btn-primary w-full !py-3 !text-base",disabled:a,children:a?"Logging in...":"Login"})]}),o&&c.jsx(ne.p,{initial:{opacity:0,y:10},animate:{opacity:1,y:0},className:"text-center mt-4 text-red-500 bg-red-100 p-3 rounded-lg",children:o})]})})});G.memo();G.memo();const _s=G.memo(({db:t,storage:e,fetchAllData:s,initialData:n,onDone:r})=>{const[i,o]=k.useState({licenses:"link",internships:"link"}),[l,a]=k.useState({licenses:null,internships:null}),[u,h]=k.useState({licensesPdfUrl:n.licensesPdfUrl||"",internshipsPdfUrl:n.internshipsPdfUrl||""}),[d,p]=k.useState({licenses:0,internships:0}),[y,m]=k.useState(""),[T,g]=k.useState(!1),P=(f,R)=>{o(U=>({...U,[f]:R}))},N=(f,R)=>{a(U=>({...U,[f]:R}))},w=f=>{const{name:R,value:U}=f.target;h(q=>({...q,[R]:U}))},x=(f,R)=>new Promise((U,q)=>{R||U(u[`${f}PdfUrl`]);const J=`certifications/${f}_${Date.now()}_${R.name}`,Q=hs(e,J),he=cs(Q,R);he.on("state_changed",H=>{const Fe=H.bytesTransferred/H.totalBytes*100;p(Me=>({...Me,[f]:Fe}))},H=>{console.error(`Upload error for ${f}:`,H),q(H)},()=>{us(he.snapshot.ref).then(U)})}),O=async f=>{f.preventDefault(),g(!0),m("Processing updates..."),p({licenses:0,internships:0});try{const R=i.licenses==="upload"?x("licenses",l.licenses):Promise.resolve(u.licensesPdfUrl),U=i.internships==="upload"?x("internships",l.internships):Promise.resolve(u.internshipsPdfUrl),[q,J]=await Promise.all([R,U]),Q=Qe(t,"portfolioAssets","pdfs");await et(Q,{licensesPdfUrl:q,internshipsPdfUrl:J},{merge:!0}),m("Assets updated successfully!"),s(),setTimeout(()=>r(),1500)}catch(R){console.error("Error updating assets:",R),m(`Error: ${R.message}`)}finally{g(!1)}},C=(f,R)=>c.jsxs("div",{children:[c.jsx("label",{className:"block text-sm font-medium text-[#4b5563] mb-2",children:R}),c.jsxs("div",{className:"flex gap-4 mb-3",children:[c.jsxs("button",{type:"button",onClick:()=>P(f,"link"),className:`flex items-center gap-2 px-4 py-2 rounded-lg text-sm ${i[f]==="link"?"bg-blue-500 text-white":"bg-gray-200"}`,children:[c.jsx(Ye,{})," Link"]}),c.jsxs("button",{type:"button",onClick:()=>P(f,"upload"),className:`flex items-center gap-2 px-4 py-2 rounded-lg text-sm ${i[f]==="upload"?"bg-blue-500 text-white":"bg-gray-200"}`,children:[c.jsx(Je,{})," Upload"]})]}),i[f]==="link"?c.jsx("input",{type:"url",name:`${f}PdfUrl`,placeholder:"Google Drive, Dropbox, etc. Link",value:u[`${f}PdfUrl`],onChange:w,className:"input-field"}):c.jsxs("div",{children:[c.jsx("input",{type:"file",accept:"application/pdf",onChange:U=>N(f,U.target.files[0]),className:"file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"}),d[f]>0&&d[f]<100&&c.jsx("div",{className:"w-full bg-gray-200 rounded-full h-2.5 mt-2",children:c.jsx("div",{className:"bg-blue-600 h-2.5 rounded-full",style:{width:`${d[f]}%`}})})]}),u[`${f}PdfUrl`]&&c.jsx("a",{href:u[`${f}PdfUrl`],target:"_blank",rel:"noopener noreferrer",className:"text-xs text-blue-600 hover:underline mt-1 block",children:"View Current PDF"})]});return c.jsxs("div",{className:"p-8 rounded-2xl glass-card",children:[c.jsx("h2",{className:"text-2xl font-bold text-[#334155] mb-6",children:"Manage Asset PDFs"}),c.jsxs("form",{onSubmit:O,className:"space-y-6",children:[C("licenses","Certifications PDF"),C("internships","Internships PDF"),c.jsx("button",{type:"submit",className:"btn-primary w-full",disabled:T,children:T?"Updating...":"Update Assets"}),c.jsx("button",{type:"button",onClick:r,className:"btn-secondary w-full",disabled:T,children:"Cancel"}),y&&c.jsx("p",{className:"text-center mt-4 text-[#2563eb]",children:y})]})]})}),ms=G.memo(({db:t,auth:e,storage:s,projects:n,skills:r,fetchAllData:i,licensesPdfUrl:o,internshipsPdfUrl:l})=>{const[a,u]=k.useState("projects"),[h,d]=k.useState(null),[p,y]=k.useState(null),[m,T]=k.useState(!1),[g,P]=k.useState(""),[N,w]=k.useState(!1),[x,O]=k.useState(null);return r&&[...new Set(r.map(C=>C.category))],m?c.jsx(_s,{db:t,storage:s,fetchAllData:i,initialData:{licensesPdfUrl:o,internshipsPdfUrl:l},onDone:()=>T(!1)}):c.jsxs("div",{children:[c.jsxs("div",{className:"flex justify-center border-b border-gray-300 mb-8",children:[c.jsx("button",{onClick:()=>u("projects"),className:`py-2 px-6 font-semibold ${a==="projects"?"text-[#2563eb] border-b-2 border-[#2563eb]":"text-gray-500"}`,children:"Manage Projects"}),c.jsx("button",{onClick:()=>u("skills"),className:`py-2 px-6 font-semibold ${a==="skills"?"text-[#2563eb] border-b-2 border-[#2563eb]":"text-gray-500"}`,children:"Manage Skills"}),c.jsx("button",{onClick:()=>u("assets"),className:`py-2 px-6 font-semibold ${a==="assets"?"text-[#2563eb] border-b-2 border-[#2563eb]":"text-gray-500"}`,children:"Manage Assets"})]}),c.jsx(Ke,{mode:"wait",children:c.jsx(ne.div,{children:a==="assets"&&c.jsxs("div",{className:"p-8 rounded-2xl glass-card",children:[c.jsx("div",{className:"glow-effect"}),c.jsx("h2",{className:"text-2xl font-bold text-[#334155] mb-6",children:"Certifications & Internships"}),c.jsx("p",{className:"text-[#4b5563] mb-4",children:"Update the links or upload new PDF files for your assets. Uploaded files will be stored securely."}),c.jsx("button",{onClick:()=>T(!0),className:"btn-primary w-full",children:"Update Asset PDFs"})]})},a)})]})}),bs=({db:t,auth:e,storage:s,projects:n,skills:r,fetchAllData:i,licensesPdfUrl:o,internshipsPdfUrl:l})=>{const[a,u]=k.useState(!1);return k.useEffect(()=>e?Ve(e,d=>{u(!!d)}):void 0,[e]),c.jsx("div",{className:"bg-[#f5f7fa] min-h-screen",children:c.jsx("div",{className:"container mx-auto px-6 py-12",children:a?c.jsxs(c.Fragment,{children:[c.jsx("h1",{className:"text-4xl font-bold text-[#334155] text-center mb-12",children:"Admin Dashboard"}),c.jsx(ms,{db:t,auth:e,storage:s,projects:n,skills:r,fetchAllData:i,licensesPdfUrl:o,internshipsPdfUrl:l})]}):c.jsx(ps,{onLogin:u,auth:e})})})};export{bs as default};
