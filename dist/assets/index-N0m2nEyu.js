(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))n(o);new MutationObserver(o=>{for(const s of o)if(s.type==="childList")for(const i of s.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&n(i)}).observe(document,{childList:!0,subtree:!0});function t(o){const s={};return o.integrity&&(s.integrity=o.integrity),o.referrerPolicy&&(s.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?s.credentials="include":o.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(o){if(o.ep)return;o.ep=!0;const s=t(o);fetch(o.href,s)}})();let y=1;function C(r){let e=0,t=0,n=0,o=0;const s=()=>{r.style.zIndex=y++},i=a=>{s()},c=a=>{a=a||window.event,a.preventDefault(),s(),n=a.clientX,o=a.clientY,document.onmouseup=g,document.onmousemove=f};r.onmousedown=i;const p=r.querySelector(".title-bar");p&&(p.onmousedown=a=>{c(a),a.stopPropagation()});const f=a=>{a=a||window.event,a.preventDefault(),e=n-a.clientX,t=o-a.clientY,n=a.clientX,o=a.clientY;let d=r.offsetTop-t,u=r.offsetLeft-e;d=Math.max(0,Math.min(d,window.innerHeight-r.offsetHeight)),u=Math.max(0,Math.min(u,window.innerWidth-r.offsetWidth)),r.style.top=d+"px",r.style.left=u+"px"},g=()=>{document.onmouseup=null,document.onmousemove=null}}function m(r,e){const t=document.createElement("div");t.className="window",t.style.zIndex=y++,t.innerHTML=`
        <div class="title-bar">
            <span class="title">${r}</span>
            <span class="close-icon">X</span>
        </div>
        <div class="window-content">
            ${e}
        </div>
    `,document.getElementById("desktop").appendChild(t),t.style.left=Math.random()*100+"px",t.style.top=Math.random()*100+"px",t.querySelector(".window-content").focus(),C(t),t.querySelector(".close-icon").addEventListener("click",()=>t.remove());const n=t.querySelector('button, input, [tabindex]:not([tabindex="-1"])');return n&&n.focus(),t}class w{constructor(e){this.windowContent=e,this.moves=0,this.timer=0,this.timerInterval=null,this.currentFocusIndex=0,this.totalCards=16,this.gridSize={rows:4,cols:4},this.openCards=[];const t=this.totalCards/2;this.generateCardValues(t),this.bindEventListeners(),this.startGame()}bindEventListeners(){this.windowContent.querySelector("#restartButton").addEventListener("click",()=>this.startGame()),this.windowContent.querySelector("#grid4x4Button").addEventListener("click",()=>this.setGridSize(4,4)),this.windowContent.querySelector("#grid2x2Button").addEventListener("click",()=>this.setGridSize(2,2)),this.windowContent.querySelector("#grid4x2Button").addEventListener("click",()=>this.setGridSize(4,2)),document.addEventListener("keydown",s=>this.handleKeyDown(s))}setGridSize(e,t){this.gridSize={rows:e,cols:t},this.updateGridLayout(t),this.startGame();const n=this.windowContent.querySelector(".grid-size-buttons");n.style.display="none";const o=this.windowContent.querySelector(".game-container");o.style.display="block",this.windowContent.querySelector("#gameBoard").focus()}updateGridLayout(e){const t=this.windowContent.querySelector("#gameBoard");t.style.gridTemplateColumns=`repeat(${e}, 1fr)`}startGame(){clearInterval(this.timerInterval),this.memoryBoard=this.windowContent.querySelector("#gameBoard"),this.memoryBoard.innerHTML="",this.moves=0,this.updateMoveCounter(),this.timer=0,this.updateTimerDisplay(),this.timerInterval=setInterval(()=>this.updateTimer(),1e3),this.currentFocusIndex=0,this.totalCards=this.gridSize.rows*this.gridSize.cols;const e=this.totalCards/2;this.generateCardValues(e).forEach((s,i)=>{const c=this.createCardElement(s,i);this.memoryBoard.appendChild(c)});const n=this.windowContent.querySelector("#gameBoard");n.style.display="grid",this.revealCardsTemporarily();const o=this.windowContent.querySelector(".victory-message");o.textContent="",o.style.display="none"}revealCardsTemporarily(){const e=this.memoryBoard.querySelectorAll(".memory-tile");e.forEach(t=>t.classList.add("flipped")),setTimeout(()=>{e.forEach(t=>t.classList.remove("flipped"))},2e3)}generateCardValues(e){const t=[],n=Array.from({length:8},(o,s)=>s);for(let o=0;o<e;o++){const s=Math.floor(Math.random()*n.length),i=n.splice(s,1)[0];t.push(i,i)}return this.shuffle(t)}createCardElement(e,t){const n=document.createElement("div");n.classList.add("memory-tile");const o=`card${e}`;n.classList.add(o);const s=document.createElement("div");s.classList.add("card-front");const i=document.createElement("div");return i.classList.add("card-back"),n.appendChild(s),n.appendChild(i),n.dataset.value=e,n.addEventListener("click",()=>this.flipCard(n)),n.tabIndex=0,n.dataset.index=t,n}flipCard(e){this.openCards.length<2&&!e.classList.contains("flipped")&&(e.classList.add("flipped"),this.openCards.push(e),this.openCards.length===2&&(setTimeout(this.checkForMatch.bind(this),500),this.moves++,this.updateMoveCounter()))}checkForMatch(){const[e,t]=this.openCards;e.dataset.value===t.dataset.value?(e.classList.add("match"),t.classList.add("match")):(e.classList.remove("flipped"),t.classList.remove("flipped")),this.openCards=[],this.checkGameOver()}stopTimer(){clearInterval(this.timerInterval)}checkGameOver(){if(this.memoryBoard.querySelectorAll(".memory-tile.match").length===this.totalCards){this.stopTimer();const t=this.windowContent.querySelector("#gameBoard");t.style.display="none",setTimeout(()=>{const n=this.windowContent.querySelector(".victory-message");n.textContent="Congratulations! You have matched all the cards!",n.style.display="block"},500)}}handleKeyDown(e){const t=this.gridSize.cols,n=this.memoryBoard.querySelectorAll(".memory-tile");let o=this.currentFocusIndex;if(this.windowContent.contains(document.activeElement)){switch(e.key){case"ArrowRight":e.preventDefault(),o=(o+1)%n.length;break;case"ArrowLeft":e.preventDefault(),o=(o-1+n.length)%n.length;break;case"ArrowUp":e.preventDefault(),o=(o-t+n.length)%n.length;break;case"ArrowDown":e.preventDefault(),o=(o+t)%n.length;break;case"Enter":e.preventDefault(),this.flipCardIfNotFlipped(o);return}this.focusCard(o)}}focusCard(e){const t=this.memoryBoard.querySelectorAll(".memory-tile");e>=0&&e<t.length&&(t[e].focus(),this.currentFocusIndex=e)}flipCardIfNotFlipped(e){const t=this.memoryBoard.querySelectorAll(".memory-tile");if(e>=0&&e<t.length){const n=t[e];n.classList.contains("flipped")||this.flipCard(n)}}updateTimer(){this.timer++,this.updateTimerDisplay()}updateTimerDisplay(){const e=Math.floor(this.timer/60),t=this.timer%60,n=this.windowContent.querySelector("#timer");n.textContent=`Time: ${e}m ${t}s`}updateMoveCounter(){const e=this.windowContent.querySelector("#moveCounter");e.textContent=`Moves: ${this.moves}`}shuffle(e){for(let t=e.length-1;t>0;t--){const n=Math.floor(Math.random()*(t+1));[e[t],e[n]]=[e[n],e[t]]}return e}}function S(){document.addEventListener("DOMContentLoaded",function(){const r=document.getElementById("btn-memory-game");r&&r.addEventListener("click",function(){const e=m("Memory Game",b()),t=e.querySelector(".game-container");t.style.display="none";const n=e.querySelector(".grid-size-buttons");return n.style.display="block",new w(e.querySelector(".window-content"))})})}function b(){return`
        <div class="grid-size-buttons">
          <button id="grid4x4Button">Create 4x4 Grid</button>
          <button id="grid2x2Button">Create 2x2 Grid</button>
          <button id="grid4x2Button">Create 4x2 Grid</button>
        </div>
        <div class="game-container">
          <div class="game-board" id="gameBoard" tabindex="0"></div>
          <div class="game-info">
            <span id="moveCounter">Moves: 0</span>
            <span id="timer">Time: 0m 0s</span>
            <button id="restartButton">Restart Game</button>
          </div>
          <div class="victory-message"></div>
        </div>
      `}S();function B(){return`
    <div class="currency-converter">
        <input type="number" id="amount" placeholder="Amount" />
        <select id="fromCurrency">
            <!-- Currency options will be loaded here -->
        </select>
        <select id="toCurrency">
            <!-- Currency options will be loaded here -->
        </select>
        <button id="convert">Convert</button>
        <div id="result">Converted Amount: <span id="convertedAmount"></span></div>
    </div>
  `}document.addEventListener("DOMContentLoaded",function(){const r=document.getElementById("btn-currency-converter");r&&r.addEventListener("click",function(){const e=m("Currency Converter",B());q(e.querySelector(".window-content"))})});function q(r){fetch("https://api.exchangerate-api.com/v4/latest/USD").then(t=>t.json()).then(t=>{L(r,t.rates)}).catch(t=>{console.error("Error fetching currency list:",t)}),r.querySelector("#convert").addEventListener("click",function(){const t=r.querySelector("#amount").value,n=r.querySelector("#fromCurrency").value,o=r.querySelector("#toCurrency").value;E(t,n,o,r)})}function L(r,e){const t=r.querySelector("#fromCurrency"),n=r.querySelector("#toCurrency");Object.keys(e).forEach(o=>{const s=new Option(o,o);t.add(s.cloneNode(!0)),n.add(s)})}function E(r,e,t,n){const o=n.querySelector("#amount");if(!r||isNaN(r)){o.style.borderColor="red";return}else o.style.borderColor="";fetch(`https://api.exchangerate-api.com/v4/latest/${e}`).then(s=>s.json()).then(s=>{const i=s.rates[t],c=(r*i).toFixed(2);n.querySelector("#convertedAmount").innerText=`${c} ${t}`}).catch(s=>{console.error("Error fetching currency data:",s)})}function x(){return`
    <div class="username-container" style="display: block;">
      <input type="text" id="username-input" placeholder="Enter your username" />
      <button id="username-submit">Enter Chat</button>
    </div>
    <div class="chat-container" style="display: none;">
      <div class="chat-messages"></div>
      <div class="chat-input-container">
        <textarea class="chat-input"></textarea>
        <select class="emoji-picker">
        <option value="">Select Emoji</option>
        <option value="😀">😀</option>
        <option value="😢">😢</option>
        <option value="😂">😂</option>
        <option value="😍">😍 </option>
        <option value="😊">😊</option>
        <option value="😎">😎</option>
        <option value="😒">😒</option>
        <option value="😱">😱 -</option>
        <option value="👍">👍</option>
        <option value="👎">👎</option>
        <option value="👏">👏</option>
        <option value="💪">💪</option>
        </select>
      </div>
    </div>
  `}const v=new WebSocket("wss://courselab.lnu.se/message-app/socket"),l=[],h=new Set;v.onmessage=function(r){const e=JSON.parse(r.data);e.type==="heartbeat"||e.username==="Server"||(e.type==="user-update"?e.action==="joined"?h.add(e.username):e.action==="left"&&h.delete(e.username):(l.push(e),l.length>20&&l.shift(),M()))};function M(){document.querySelectorAll(".chat-messages").forEach(r=>{r.innerHTML=l.map(e=>`<p><b>${e.username||"Anonymous"}:</b> ${e.data}</p>`).join(""),r.scrollTop=r.scrollHeight})}function k(r){const e=r.querySelector("#username-input"),t=r.querySelector("#username-submit"),n=r.querySelector(".username-container"),o=r.querySelector(".chat-container");t.addEventListener("click",()=>{const s=e.value.trim();s?(localStorage.setItem("username",s),n.style.display="none",o.style.display="block",I(s,o)):alert("Please enter a username.")})}function I(r,e){const t=e.querySelector(".chat-input"),n=e.querySelector(".emoji-picker"),o=e.querySelector(".chat-messages");o.innerHTML=l.map(i=>`<p><b>${i.username||"Anonymous"}:</b> ${i.data}</p>`).join("");const s=()=>{const i=t.value;i.trim()!==""&&(v.send(JSON.stringify({type:"message",data:i,username:r||"Anonymous",channel:"my, not so secret, channel",key:"eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd"})),t.value="",n.value="")};t.addEventListener("keypress",i=>{i.keyCode===13&&(i.preventDefault(),s())}),n.addEventListener("change",()=>{t.value+=n.value,n.value=""})}document.querySelector(".btn-chat").addEventListener("click",function(){const r=x(),e=m("Chat",r);k(e.querySelector(".window-content"))});
