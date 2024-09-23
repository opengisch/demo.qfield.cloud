var x=Object.defineProperty;var $=(n,s,e)=>s in n?x(n,s,{enumerable:!0,configurable:!0,writable:!0,value:e}):n[s]=e;var o=(n,s,e)=>$(n,typeof s!="symbol"?s+"":s,e);import{X as k,h as i,b as w,c as d,D as g,M as v,K as m,d as y,V as r,g as p,p as h,O as M,l as u,Q as f,R as I,C as S,I as L,U as C,W as B,S as b,u as O}from"./component-DmEB9E06.js";import"./lazy-CNpw-HpO.js";class E extends k{constructor(){super(...arguments);o(this,"template",()=>i`<style>
.hidden{display:none}#searchbox{background-color:var(--bkg-color);border-right:none;height:2.25rem;border-radius:6px;border:none;width:100%;display:flex;flex-direction:row;box-shadow:var(--bx-shdw);position:absolute;z-index:101}#search{font-size:1rem;outline:0;margin:0 0 0 .5rem;padding-left:.8rem;border:0;height:2.25rem;width:auto;flex:1 1 auto;-ms-flex:1 1 auto;-webkit-flex:1 1 auto;-webkit-appearance:none;background:0 0;color:var(--text-color)}.close-icon,.search-icon,.select-color-icon{width:14px;color:var(--text-color);padding:0 1rem}.close-button,.select-color-button{border:none;padding:0;background-color:transparent;cursor:pointer}#results{z-index:100;position:fixed;top:0;left:0;right:0;background-color:var(--bkg-color);overflow-x:hidden;scrollbar-width:thin;bottom:0;padding-top:7vh}.result,.title{display:inline-block;padding:.3rem 1rem;width:Calc(36rem - 2rem);line-height:1.3rem}.title{color:var(--text-color);font-weight:600;line-height:2.5rem;font-size:1.3rem;padding-top:1.5rem}.result{cursor:pointer;border:none;border-top:solid 1px #ccc;background:0 0;text-align:left;width:100%;color:var(--text-color)}.title img{margin-right:1rem;width:14px}.title span{text-transform:uppercase}.result.selected{background-color:#aaa!important;color:var(--text-color)}
</style>
<link rel="stylesheet" href="lib/vanilla-picker/vanilla-picker.csp.css" />

<div id="searchbox">
  <input
    id="search"
    length="20"
    maxlength="1000"
    autocomplete="off"
    autocorrect="off"
    i18n="Search"
    placeholder="Search..."
    oninput="${e=>this.doSearch(e)}"
    onkeydown="${e=>this.onKeyDown(e)}" />

  <img class="${this.allResults.length>0?"hidden":"search-icon"}" alt="search-icon" src="${this.searchIcon}" />
  <button class="${this.allResults.length>0?"close-button":"hidden"}" onclick="${()=>this.clearSearch(!0)}">
    <img class="close-icon" alt="close-icon" src="icons/close.svg" />
  </button>
</div>

<div id="results" class="${Object.keys(this.groupedResults).length===0||this.forceHide?"hidden":""}">
  ${Object.keys(this.groupedResults).map(e=>i`
  <div class="title">
    <img alt="result icon" src="${this.getIcon(e)}" />
    <span>${e}</span>
  </div>
  ${this.groupedResults[e].map(t=>{var a;return i`
  <button
    class="${t.selected?"result selected":"result"}"
    onmousedown="${()=>this.onMouseDown()}"
    onclick="${()=>this.onSelect(t)}">
    ${(a=t.properties)==null?void 0:a.label}
  </button>
  `})} `)}
</div>
`)}}class T extends w{constructor(){super("themes-mobile");o(this,"template",()=>i`<style>
button.main{border:none;width:4rem;height:4rem;background-color:#444;color:#fff;padding:.5rem;cursor:pointer}.themes{display:flex;flex-wrap:wrap;margin-top:0;overflow-x:hidden;overflow-y:scroll;scrollbar-width:thin;border:none;border-top:solid 1px #444;border-radius:0;padding:1rem;background-color:var(--bkg-color);flex-direction:row;position:fixed;bottom:0;left:0;right:0;height:27rem}h2{margin:0 .5rem}.category{height:8rem;display:flex;flex-direction:column;flex-wrap:wrap;overflow-x:auto;align-items:stretch;align-content:stretch}.category.row2{height:15rem}.category.row22{height:18rem}.theme{align-content:flex-end;position:relative;width:9rem;border:none;background-color:transparent;cursor:pointer;margin:.5rem;padding:0}.theme>img{width:100%}.theme>img.unselected{filter:grayscale(1)}button.select{border:none;padding:0;background-color:transparent;cursor:pointer}button.select>img{height:3rem;margin-bottom:1rem}button>span{display:inline-block;width:9rem;overflow:hidden;text-wrap:nowrap;text-align:left;text-overflow:ellipsis}
</style>
<link rel="stylesheet" href="styles/common.mobile.css" />

<button
  class="girafe-button-big"
  title="Theme Selection"
  onclick="${()=>this.toggleThemesList()}"
  onblur="${()=>this.onBlur()}">
  <img alt="menu-icon" src="icons/themes.svg" />
</button>

<div class="${this.menuOpen?"themes":"hidden"}">
  <h2 class="${this.showBasemaps?"":"hidden"}">Basemaps</h2>
  <div class="${this.showBasemaps?"category":"hidden"}">
    ${Object.values(this.state.basemaps).map(e=>d(e,e.id)`
    <button
      class="theme"
      onmousedown="${()=>this.changeBasemap(e)}"
      onmouseup="${()=>this.mouseUp()}"
      onblur="${()=>this.onBlur()}">
      <img alt="${"Icon for "+e.name}" src="images/basemap.png" />
      <span i18n="${e.name}">${e.name}</span>
    </button>
    `)}
  </div>

  <h2>Themes</h2>
  <div class="category row2">
    ${Object.values(this.state.themes._allThemes??{}).map(e=>d(e,e.id)`
    <button
      class="theme"
      onmousedown="${()=>this.onThemeChanged(e)}"
      onmouseup="${()=>this.mouseUp()}"
      onblur="${()=>this.onBlur()}">
      <img alt="${"Icon for "+e.name}" src="${e.icon}" />
      <span i18n="${e.name}">${e.name}</span>
    </button>
    `)}
  </div>

  <h2 class="${this.state.layers.layersList.length>0?"":"hidden"}">Layers</h2>
  <div class="${this.state.layers.layersList.length>0?"category row22":"hidden"}">
    ${this.state.layers.layersList.filter(e=>e instanceof g).map(e=>d(e,e.treeItemId)`
    <button
      class="theme"
      onmousedown="${()=>this.onLayerSelected(e)}"
      onmouseup="${()=>this.mouseUp()}"
      onblur="${()=>this.onBlur()}">
      <img
        alt="${"Icon for "+e.name}"
        src="${this.state.themes.lastSelectedTheme.icon}"
        class="${e.active?"selected":"unselected"}" />
      <span i18n="${e.parent.name}">${e.parent.name}</span>
      <span i18n="${e.name}">${e.name}</span>
    </button>
    `)}
  </div>
</div>
`);o(this,"showBasemaps",!0);o(this,"menuOpen",!1);o(this,"preventBlur",!1);this.configManager.loadConfig().then(()=>{this.showBasemaps=this.configManager.Config.basemaps.show})}toggleThemesList(){this.menuOpen=!this.menuOpen,super.render()}onBlur(){this.preventBlur||(this.menuOpen=!1,super.render())}mouseUp(){this.preventBlur=!1}onThemeChanged(e){if(this.preventBlur=!0,this.state.themes.lastSelectedTheme=e,e.location!=null||e.zoom!=null){const t=v.getInstance().getMap().getView();t.animate({center:e.location??t.getCenter(),zoom:e.zoom??t.getZoom(),duration:1e3})}}onLayerSelected(e){this.preventBlur=!0,e instanceof g?(m.getInstance().toggleLayer(e),this.render()):console.warn("This method should only be called for layers, not groups.")}onBasemapsLoaded(e){if(super.render(),!y.getInstance().hasSharedState()){for(const t of Object.values(e))if(t.name===this.configManager.Config.basemaps.defaultBasemap){this.state.activeBasemap=t;break}}}changeBasemap(e){this.preventBlur=!0,e.projection&&(this.state.projection=e.projection),this.state.activeBasemap=e}registerEvents(){this.stateManager.subscribe("themes",()=>{super.render(),super.girafeTranslate()}),this.stateManager.subscribe("layers.layersList",()=>{for(const e of this.state.layers.layersList)m.getInstance().activateIfDefaultChecked(e);super.render(),super.girafeTranslate()}),this.stateManager.subscribe("basemaps",(e,t)=>this.onBasemapsLoaded(t))}connectedCallback(){this.loadConfig().then(()=>{super.render(),this.registerEvents()})}}class _ extends w{constructor(){super("themes-mobile");o(this,"template",()=>i`<style>
.offline-download,.offline-status{position:fixed;bottom:7rem;left:1rem;z-index:8}.progress-download{position:fixed;bottom:0;left:0;right:0;width:100%;border:solid 1px #000;height:.5rem}.offline-status{width:1.4rem;height:1.4rem;align-items:center;padding:.5rem;border-radius:4rem;border:solid 1px #000;background-color:var(--bkg-color-grad1);display:flex;flex-direction:column;color:var(--text-color)}
</style>
<link rel="stylesheet" href="styles/common.mobile.css" />

<button
  class="${this.state.isOffline||this.downloadStartZoom&&this.downloadStartZoom>this.state.position.zoom?"hidden":"offline-download girafe-button-big"}"
  onclick="${()=>this.exportData()}">
  <img alt="download-icon" src="icons/offline-download.svg" />
</button>

<img class="${this.state.isOffline?"offline-status":"hidden"}" alt="offline-icon" src="icons/offline.svg" />

<progress
  class="${this.downloadInProgress?"progress-download":"hidden"}"
  max="100"
  value="${this.downloadProgressValue}"></progress>
`);o(this,"downloadInProgress",!1);o(this,"downloadProgressValue",0);o(this,"offlineManager");o(this,"downloadStartZoom");o(this,"downloadEndZoom");this.offlineManager=r.getInstance(),this.configManager.loadConfig().then(()=>{var e;this.downloadStartZoom=(e=this.configManager.Config.offline)==null?void 0:e.downloadStartZoom})}registerEvents(){this.stateManager.subscribe("isOffline",()=>{super.render()}),this.stateManager.subscribe("position",()=>{super.render()})}exportData(){const e=this.getAllWmtsLayers(),t=`This will export all the data for the layers [${e.map(a=>a.name).join(", ")}].`;if(confirm(t)){this.downloadInProgress=!0,this.downloadProgressValue=0,super.render();const a=v.getInstance().getMap(),l=a.getView().calculateExtent(a.getSize());this.offlineManager.exportWMTSTiles(l,e,this.progressCallback.bind(this))}}getAllWmtsLayers(){var l;const e=((l=this.stateManager.state.activeBasemap)==null?void 0:l.layersList.filter(c=>c instanceof p))||[],t=this.state.layers.layersList.filter(c=>c instanceof p&&c.active);return[...e,...t]}progressCallback(e){e==100?this.downloadInProgress=!1:this.downloadProgressValue=e,super.render()}connectedCallback(){this.loadConfig().then(()=>{super.render(),this.registerEvents()})}}!navigator.userAgent.includes("iPhone")&&!navigator.userAgent.includes("Android")&&(window.location.href="index.html");try{const s="geogirafe-cache";navigator!=null&&navigator.serviceWorker&&navigator.serviceWorker.register("service-worker.js").then(e=>{r.getInstance().setServiceWorker(e.active,6,s)}),window.cordova?document.addEventListener("deviceready",()=>{const t=navigator.connection.type===Connection.NONE;r.getInstance().initializeOfflineState(t)},!1):r.getInstance().initializeOfflineState(!navigator.onLine),window.CESIUM_BASE_URL="lib/cesium/",h.defs("EPSG:21781","+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +k_0=1 +x_0=600000 +y_0=200000 +ellps=bessel +towgs84=660.077,13.551,369.344,2.484,1.783,2.939,5.66 +units=m +no_defs"),h.defs("EPSG:2056","+proj=somerc +lat_0=46.9524055555556 +lon_0=7.43958333333333 +k_0=1 +x_0=2600000 +y_0=1200000 +ellps=bessel +towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs +type=crs"),M(h),u.getInstance().initMobile(),u.getInstance().loadConfig(),f.getInstance().initLogging().then(()=>{I.getInstance(),S.getInstance(),L.getInstance(),C.getInstance(),B.getInstance(),f.getInstance(),document.geogirafe={state:b.getInstance().state,stateManager:b.getInstance(),shareManager:y.getInstance(),offlineManager:r.getInstance()},customElements.define("girafe-map",O),customElements.define("girafe-search",E),customElements.define("girafe-theme-select",T),customElements.define("girafe-offline",_)})}finally{document.documentElement.style.opacity="1"}
//# sourceMappingURL=mobile-De-uos_D.js.map
