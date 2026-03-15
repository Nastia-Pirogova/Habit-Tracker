(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const r of s.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&n(r)}).observe(document,{childList:!0,subtree:!0});function a(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(i){if(i.ep)return;i.ep=!0;const s=a(i);fetch(i.href,s)}})();const y="habit-tracker:v1";function w(){try{const e=localStorage.getItem(y);if(!e)return[];const t=JSON.parse(e);return Array.isArray(t)?t:[]}catch(e){return console.warn("Failed to load habits:",e),[]}}function S(e){try{localStorage.setItem(y,JSON.stringify(e))}catch(t){console.warn("Failed to save habits:",t)}}function g(e){return String(e).padStart(2,"0")}function D(e){const t=e.getFullYear(),a=g(e.getMonth()+1),n=g(e.getDate());return`${t}-${a}-${n}`}function h(){return D(new Date)}function p(e,t){const a=new Date(e);return a.setDate(a.getDate()+t),a.toISOString().slice(0,10)}class v{constructor({id:t,title:a,description:n="",frequency:i={type:"daily"},createdAt:s,history:r=[],archived:o=!1}){if(!a||a.trim().length<2)throw new Error("Habit title is required (min 2 chars)");this.id=t??crypto.randomUUID(),this.title=a.trim(),this.description=n.trim(),this.frequency=i,this.createdAt=s??new Date().toISOString(),this.archived=o,this.history=new Set(r)}isDoneOn(t){return this.history.has(t)}toggle(t=h()){this.history.has(t)?this.history.delete(t):this.history.add(t)}toJSON(){return{id:this.id,title:this.title,description:this.description,frequency:this.frequency,createdAt:this.createdAt,archived:this.archived,history:[...this.history]}}getCurrentStreak(t){let a=0,n=t;for(;this.history.has(n);)a++,n=p(n,-1);return a}getBestStreak(){if(this.history.size===0)return 0;const t=[...this.history].sort();let a=1,n=1;for(let i=1;i<t.length;i++){const s=t[i-1],r=t[i],o=p(s,1);r===o?(n++,a=Math.max(a,n)):n=1}return a}getCompletion(t,a){let n=0;for(let i=0;i<t;i++){const s=p(a,-i);this.history.has(s)&&n++}return n}}class M{constructor(){this.state={habits:[],selectedHabitId:null,filter:"active",query:"",calendarYear:new Date().getFullYear(),calendarMonth:new Date().getMonth()},this.listeners=[]}init(){const t=w();this.state.habits=t.map(a=>new v(a)),this.notify()}subscribe(t){this.listeners.push(t)}notify(){this.listeners.forEach(t=>t(this.state))}save(){S(this.state.habits.map(t=>t.toJSON()))}addHabit(t){const a=new v(t);this.state.habits.push(a),this.save(),this.notify()}toggleHabit(t,a){const n=this.state.habits.find(i=>i.id===t);n&&(n.toggle(a),this.save(),this.notify())}deleteHabit(t){const a=this.state.habits.length;this.state.habits=this.state.habits.filter(n=>n.id!==t),this.state.habits.length!==a&&(this.save(),this.notify())}toggleArchive(t){const a=this.state.habits.find(n=>n.id===t);a&&(a.archived=!a.archived,this.save(),this.notify())}setFilter(t){this.state.filter=t,this.notify()}updateHabitTitle(t,a){const n=this.state.habits.find(s=>s.id===t);if(!n)return;const i=a.trim();i.length<3||(n.title=i,this.save(),this.notify())}setQuery(t){this.state.query=t,this.notify()}selectHabit(t){this.state.selectedHabitId=t,this.notify()}goToPrevMonth(){this.state.calendarMonth===0?(this.state.calendarMonth=11,this.state.calendarYear--):this.state.calendarMonth--,this.notify()}goToNextMonth(){this.state.calendarMonth===11?(this.state.calendarMonth=0,this.state.calendarYear++):this.state.calendarMonth++,this.notify()}reorderHabits(t,a){const n=[...this.state.habits],i=n.findIndex(o=>o.id===t),s=n.findIndex(o=>o.id===a);if(i===-1||s===-1)return;const[r]=n.splice(i,1);n.splice(s,0,r),this.state.habits=n,this.save(),this.notify()}}const d=new M;function I(e){$(),x(e),T(e),O(e),A(e)}function $(){const e=document.querySelector("#app");e.querySelector("#habit-list")||(e.innerHTML=`
    <h1>Habit Tracker</h1>
    <div id="stats"></div>
    
    <div class="toolbar">
      <button id="add-btn">Add Habit</button>
      <input id="search-input" type="text" placeholder="Search habits..." />
      <button id="theme-toggle">🌙</button>
      <button id="export-btn">Export JSON</button>
      <button id="import-btn">Import JSON</button>
      <input id="import-file" type="file" accept="application/json" hidden />
    </div>
    
    
    
    <ul id="habit-list"></ul>

    <div id="filters">
      <button class="filter-btn" data-filter="active">Active</button>
      <button class="filter-btn" data-filter="archived">Archived</button>
    </div>

    <div id="modal" class="modal hidden">
      <div class="modal-content">
        <h2 id="modal-title">Add Habit</h2>
    
        <input id="habit-input" type="text" placeholder="Habit title" />
    
        <div class="modal-actions">
          <button id="modal-save">Save</button>
          <button id="modal-cancel">Cancel</button>
        </div>
      </div>
    </div>
    <div id="calendar"></div>

  `)}function T(e){const t=document.querySelector("#filters"),a=t.querySelector('[data-filter="active"]'),n=t.querySelector('[data-filter="archived"]');a.classList.toggle("is-active",e.filter==="active"),n.classList.toggle("is-active",e.filter==="archived")}function O(e){const t=document.querySelector("#habit-list"),a=h(),n=N(e);if(n.length===0){let i="";e.query.trim()!==""?i="No habits match your search":i=e.filter==="active"?"No active habits yet":"No archived habits",t.innerHTML=`<li class="empty">${i}</li>`;return}t.innerHTML=n.map(i=>`
        <li data-id="${i.id}" class="habit-item${i.id===e.selectedHabitId?" selected":""}" draggable="true">
          <strong>${i.title}</strong>

          <button data-action="toggle">
            ${i.isDoneOn(a)?"✅":"⬜"}
          </button>

          <button data-action="delete" class="habit-btn-delete">🗑</button>

          <button data-action="archive" class="habit-btn-archive">
            ${i.archived?"Unarchive":"Archive"}
          </button>

          <button data-action="edit" class="habit-btn-edit">✏️</button>
           <span class="streak">🔥 ${i.getCurrentStreak(a)}</span>
           <span class="best">🏆 ${i.getBestStreak()}</span>
           <span class="stat">${i.getCompletion(7,a)}/7</span>
           <span class="stat">${i.getCompletion(30,a)}/30</span>
          
        </li>
      `).join("")}function N(e){let t=e.habits.filter(a=>e.filter==="active"?!a.archived:a.archived);return e.query.trim()===""?t:t.filter(a=>a.title.toLowerCase().includes(e.query.toLowerCase()))}function x(e){const t=document.querySelector("#stats"),a=h(),n=e.habits.length,i=e.habits.filter(r=>r.isDoneOn(a)).length,s=n===0?0:Math.round(i/n*100);t.innerHTML=`
        <div class="stats-item">Habits: ${n}</div>
        <div class="stats-item">Completed today: ${i}</div>
        <div class="stats-item">Completion: ${s}%</div>
    `}function A(e){const t=document.querySelector("#calendar");if(!e.selectedHabitId){t.innerHTML='<div class="calendar-empty">Select a habit</div>';return}const a=e.habits.find(c=>c.id===e.selectedHabitId);if(!a)return;const n=e.calendarYear,i=e.calendarMonth,s=new Date(n,i).toLocaleString("en-US",{month:"long"}),r=new Date(n,i+1,0).getDate(),o=new Date(n,i,1).getDay(),f=o===0?6:o-1,b=[],H=String(i+1).padStart(2,"0");for(let c=0;c<f;c++)b.push("");for(let c=1;c<=r;c++)b.push(c);t.innerHTML=`
        <div class="calendar-header">Calendar for: ${a.title}</div>
   
        <div class="calendar-nav">
          <button data-calendar-nav="prev">‹</button>
          <div class="calendar-month">${s} ${n}</div>
          <button data-calendar-nav="next">›</button>
        </div>
        
        <div class="calendar-weekdays">
            <span>Mo</span>
            <span>Tu</span>
            <span>We</span>
            <span>Th</span>
            <span>Fr</span>
            <span>Sa</span>
            <span>Su</span>
          </div>

       <div class="calendar-days">
          ${b.map(c=>{if(c==="")return"<span></span>";const L=String(c).padStart(2,"0"),q=`${n}-${H}-${L}`;return a.history.has(q)?`<span class="calendar-day done">${c}</span>`:`<span class="calendar-day">${c}</span>`}).join("")}
          
          
        </div>
    `}function k(e,t){let a;return function(...n){clearTimeout(a),a=setTimeout(()=>{e(...n)},t)}}d.subscribe(I);d.init();const C=localStorage.getItem("theme");C==="dark"&&document.body.classList.add("dark");let u="add",m=null,l=null;document.addEventListener("click",e=>{const t=e.target.dataset.action,a=e.target.dataset.filter,n=e.target.closest("li")?.dataset.id;if(t==="toggle"&&n&&d.toggleHabit(n,h()),e.target.id==="add-btn"&&(u="add",m=null,document.querySelector("#modal").classList.remove("hidden")),e.target.id==="modal-cancel"){const i=document.querySelector("#modal"),s=document.querySelector("#habit-input");i.classList.add("hidden"),s.value=""}if(e.target.id==="modal-save"){const i=document.querySelector("#modal"),s=document.querySelector("#habit-input"),r=s.value.trim();if(!r)return;if(u==="add")d.addHabit({title:r,frequency:{type:"daily"}});else if(u==="edit"){const o=s.value.trim();if(!o)return;o&&d.updateHabitTitle(m,o)}i.classList.add("hidden"),s.value=""}if(t==="edit"&&n){const i=document.querySelector("#modal"),s=document.querySelector("#habit-input"),r=document.querySelector("#modal-title"),o=d.state.habits.find(f=>f.id===n);if(!o)return;u="edit",m=n,r.innerText="Edit Habit",s.value=o.title,i.classList.remove("hidden"),s.focus()}if(t==="delete"&&n&&d.deleteHabit(n),t==="archive"&&n&&d.toggleArchive(n),a&&d.setFilter(a),e.target.id==="theme-toggle"){document.body.classList.toggle("dark");const i=document.body.classList.contains("dark")?"dark":"light";localStorage.setItem("theme",i)}if(e.target.id==="export-btn"){const i=JSON.stringify(d.state.habits,null,2),s=new Blob([i],{type:"application/json"}),r=URL.createObjectURL(s),o=document.createElement("a");o.href=r,o.download="habits.json",o.click(),URL.revokeObjectURL(r)}e.target.id==="import-btn"&&document.querySelector("#import-file").click(),n&&!t&&!a&&d.selectHabit(n),e.target.dataset.calendarNav==="prev"&&d.goToPrevMonth(),e.target.dataset.calendarNav==="next"&&d.goToNextMonth()});const E=k(e=>{d.setQuery(e)},300);document.addEventListener("input",e=>{e.target.id==="search-input"&&E(e.target.value)});document.addEventListener("change",e=>{if(e.target.id==="import-file"){const t=e.target.files[0];if(!t)return;const a=new FileReader;a.onload=()=>{try{const n=a.result,i=JSON.parse(n);if(!Array.isArray(i))return;S(i),d.init()}catch(n){console.error("Invalid JSON file",n)}},a.readAsText(t)}});document.addEventListener("dragstart",e=>{const t=e.target.closest("li");t&&(l=t.dataset.id)});document.addEventListener("dragover",e=>{e.target.closest("li")&&e.preventDefault()});document.addEventListener("drop",e=>{const t=e.target.closest("li");if(!t)return;e.preventDefault();const a=t.dataset.id;console.log("drop",{draggedHabitId:l,targetId:a}),!(!l||!a||l===a)&&(d.reorderHabits(l,a),l=null)});
