// import GirafeDraggableElement from '../../base/GirafeDraggableElement';
// import GeoEvents from "../../models/events.ts";
// import {buffer, getHeight, getWidth} from "ol/extent";
// import GirafeHTMLElement from "../../base/GirafeHTMLElement.ts";
// import MessageManager from "../../tools/messagemanager.ts";
import GirafeDraggableElement from "../../base/GirafeDraggableElement.ts";
import StateManager from "../../tools/state/statemanager.ts";

// import MessageManager from "../../tools/messagemanager.ts";

class MapInteractionComponent extends GirafeDraggableElement {

  templateUrl = './template.html';
  styleUrl = './style.css';

  loaded = false;
  customText!: string;


  get state() {
    return this.stateManager.state;
  }

  constructor() {
    super('mapinteraction');
    // this.messageManager = MessageManager.getInstance();
    console.log('mm: ', this.messageManager);
  }


  async loadVersionInfos() {
    if (!this.loaded) {
      // Version infos were not loaded yet.
      // const response = await fetch('about.json');
      // const versionInfos = await response.json();
      // this.version = versionInfos.version;
      // this.build = versionInfos.build;
      // this.date = versionInfos.date;
      // this.loaded = true;
      // console.log(this.version);
      // console.log(this.build);
      // console.log(this.date);
      this.customText = 'Welcome to the custom component of opengis.ch'
    }

    this.render();
  }

  registerEvents() {
    (this.stateManager).subscribe(
      'interface.mapinteractionVisible', (_oldValue: boolean, newValue: boolean) => this.toggleMapInteraction(newValue)
    );
  }

  toggleMapInteraction(visible: boolean) {
    if (visible) {
      this.loadVersionInfos()
        .then(() => {
          ((this.shadow.getRootNode() as ShadowRoot).host as HTMLElement).style.display = 'block';
        });
    } else {
      ((this.shadow.getRootNode() as ShadowRoot).host as HTMLElement).style.display = 'none';
    }
  }

  closeWindow() {
    this.state!.interface.mapinteractionVisible = false;
  }


  clickLinkAndMoveToLaax() {
    console.log('clicked mapmove');

    console.log(this.messageManager);

    // StateManager.getInstance().state.position.center = [2739315.3, 1187067.3];
    // StateManager.getInstance().state.position.scale = 2000;
    this.state.position.center = [2739315.3, 1187067.3];
    this.state.position.scale = 2000;
    console.log(StateManager.getInstance().state.position);
  }

  connectedCallback() {
    this.loadConfig().then(() => {
      this.render();
      this.girafeTranslate();
      this.makeDraggable();
      this.registerEvents();
    });
  }
}

customElements.define('girafe-mapinteraction', MapInteractionComponent as any);

export default MapInteractionComponent;
