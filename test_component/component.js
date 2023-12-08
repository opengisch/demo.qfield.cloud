
// import { html, render as uRender } from "uhtml";
const template = document.createElement('template');
template.innerHTML = `<link rel="stylesheet" href="lib/fontawesome/css/all.min.css" />
  <style>
  :host {
   display: inline-block;
 }

 #button {
   border: none;
   border-right: solid 1px #fff;
   border-left: solid 1px #fff;
   width: 4rem;
   height: 4.6rem;
   background-color: var(--bkg-color-grad1);
   color: var(--text-color-grad1);
   padding: 0;
   cursor: pointer;
   margin: 0;
   display: inline-block;
   line-height: 4rem;
 }

 #container.transparent #button {
   background-color: transparent;
   color: var(--text-color-grad2);
 }

 #container.transparent #button:hover {
   background-color: transparent;
   color: var(--text-color);
 }

 #container.transparent.selected #button {
   background-color: var(--text-color-grad1);
   color: var(--text-color-grad1);
 }

 #container.transparent.selected #button:hover {
   background-color: var(--text-color-grad2);
 }

 #button.small {
   width: 2.3rem;
   height: 2.3rem;
   line-height: 2.3rem;
 }
 #button.extra-small {
   width: 1rem;
   height: 1rem;
   line-height: 1rem;
 }

 span {
   font-size: 1.3rem;
 }

 #button.large {
   width: 100%;
   height: 2.3rem;
   line-height: 2.3rem;
   padding-left: 1rem;
   padding-right: 1rem;
   text-align: left;
 }

 #button.large span {
   font-size: 0.8rem;
   display: inline-block;
 }

 #button.hybrid {
   display: flex;
   flex-direction: column;
 }

 #button.hybrid i {
   display: inline-block;
   height: 55%;
   width: 100%;
   line-height: 3.5rem;
 }

 #button.hybrid span {
   font-size: 0.8rem;
   height: 45%;
   width: 100%;
   line-height: 1.5rem;
 }

 #button:hover {
   background-color: var(--bkg-color);
 }

  </style>

  <div id="container">
    <button id="button" title="TODO: Generate this label from the button configuration" onclick="${() => this.clickLinkAndMoveToLaax()}">
    <i class="fa-2xl fa-solid fa-arrow-right-to-city"></i>
    </button>
  </div>
  `
class TestComponent extends HTMLElement {
  templateUrl = './template.html';
  styleUrl = './style.css';
  component = "test-component";
  shadow = null;
  template = `<link rel="stylesheet" href="lib/fontawesome/css/all.min.css" />
  <style>
  :host {
   display: inline-block;
 }
 
 #button {
   border: none;
   border-right: solid 1px #fff;
   border-left: solid 1px #fff;
   width: 4rem;
   height: 4.6rem;
   background-color: var(--bkg-color-grad1);
   color: var(--text-color-grad1);
   padding: 0;
   cursor: pointer;
   margin: 0;
   display: inline-block;
   line-height: 4rem;
 }
 
 #container.transparent #button {
   background-color: transparent;
   color: var(--text-color-grad2);
 }
 
 #container.transparent #button:hover {
   background-color: transparent;
   color: var(--text-color);
 }
 
 #container.transparent.selected #button {
   background-color: var(--text-color-grad1);
   color: var(--text-color-grad1);
 }
 
 #container.transparent.selected #button:hover {
   background-color: var(--text-color-grad2);
 }
 
 #button.small {
   width: 2.3rem;
   height: 2.3rem;
   line-height: 2.3rem;
 }
 #button.extra-small {
   width: 1rem;
   height: 1rem;
   line-height: 1rem;
 }
 
 span {
   font-size: 1.3rem;
 }
 
 #button.large {
   width: 100%;
   height: 2.3rem;
   line-height: 2.3rem;
   padding-left: 1rem;
   padding-right: 1rem;
   text-align: left;
 }
 
 #button.large span {
   font-size: 0.8rem;
   display: inline-block;
 }
 
 #button.hybrid {
   display: flex;
   flex-direction: column;
 }
 
 #button.hybrid i {
   display: inline-block;
   height: 55%;
   width: 100%;
   line-height: 3.5rem;
 }
 
 #button.hybrid span {
   font-size: 0.8rem;
   height: 45%;
   width: 100%;
   line-height: 1.5rem;
 }
 
 #button:hover {
   background-color: var(--bkg-color);
 }
 
  </style>

  <div id="container">
    <button id="button" title="TODO: Generate this label from the button configuration" onclick="${() => this.clickLinkAndMoveToLaax()}">
    <i class="fa-2xl fa-solid fa-arrow-right-to-city"></i>
    </button>
  </div>
  `

  state = document.state;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.shadow.appendChild(template.content.cloneNode(true));
  }


  render() {
    // uRender(this.shadow, this.template);
    const template_div = this.shadow.querySelector('div');
    const btn = template_div.querySelector('button');
    btn.addEventListener('click', () => { this.clickLinkAndMoveToLaax() });
    // return this.template
  }

  clickLinkAndMoveToLaax() {
    console.log('clicked go to laax');
    document.state.position.center = [2739315.3, 1187067.3];
    document.state.position.scale = 2000;
  }


  connectedCallback() {
    console.log('Rating added to DOM');
    this.render();
  }
}



export default TestComponent;
