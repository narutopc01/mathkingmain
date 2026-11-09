/* MATHKING FX: confetti, stage cards, team intro, streaks, secret troll stage */
const FX=(()=>{
  const $=id=>document.getElementById(id);
  const RM=matchMedia("(prefers-reduced-motion: reduce)").matches;
  const COLORS=["#e6c260","#ff6b8a","#5ee0a0","#5ab8ff","#c58bff","#ff9d5c"];
  const ACC=["#e6c260","#5ee0a0","#5ab8ff","#c58bff","#ff9d5c","#ff6b8a","#ffe14d","#ff4d4d"];

  /* ---------- particles ---------- */
  const cv=document.createElement("canvas");cv.id="fxCanvas";document.body.appendChild(cv);
  const g=cv.getContext("2d");let P=[],running=false;
  function size(){cv.width=innerWidth;cv.height=innerHeight}
  size();addEventListener("resize",size);
  function loop(){
    g.clearRect(0,0,cv.width,cv.height);
    P=P.filter(p=>p.l>0);
    P.forEach(p=>{
      p.vy+=p.gr;p.x+=p.vx;p.y+=p.vy;p.r+=p.vr;p.l--;
      g.save();g.globalAlpha=Math.min(1,p.l/20);g.translate(p.x,p.y);g.rotate(p.r);
      g.fillStyle=p.c;g.fillRect(-p.s/2,-p.s/2,p.s,p.s*p.h);g.restore();
    });
    if(P.length)requestAnimationFrame(loop);else{running=false;g.clearRect(0,0,cv.width,cv.height)}
  }
  function burst(n,x,y,o){
    if(RM)return;
    for(let i=0;i<n;i++){
      const a=Math.random()*Math.PI*2,sp=o.sp*(.4+Math.random()*.8);
      P.push({x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-(o.up||0),gr:o.gr||.25,r:Math.random()*6,vr:(Math.random()-.5)*.4,
        s:o.s?o.s*(.6+Math.random()):6+Math.random()*6,h:o.h||1.6,l:(o.l||90)+Math.random()*40,
        c:(o.c||COLORS)[i%(o.c||COLORS).length]});
    }
    if(!running){running=true;requestAnimationFrame(loop)}
  }
  function confetti(x,y,n){
    x=x==null?innerWidth/2:x;y=y==null?innerHeight*.4:y;
    burst(n||70,x,y,{sp:11,up:6});
  }
  function shards(el){
    const r=el.getBoundingClientRect();
    burst(26,r.left+r.width/2,r.top+r.height/2,{sp:6,c:["#ff3b5c","#ff8fa3","#b3122f"],s:5,h:1,gr:.35,l:60});
  }
  function pop(text,x,y){
    const e=document.createElement("div");e.className="xppop";e.textContent=text;
    e.style.left=x+"px";e.style.top=y+"px";document.body.appendChild(e);setTimeout(()=>e.remove(),1100);
  }

  /* ---------- streak, pips, accent ---------- */
  function badge(k){
    const b=$("streakBadge");if(!b)return;
    b.classList.toggle("hidden",k<2);
    if(k>=2){b.textContent="🔥 x"+k;b.classList.remove("bump");void b.offsetWidth;b.classList.add("bump")}
  }
  function onCorrect(k,gain){
    const b=document.querySelector(".option.selected"),
      r=b?b.getBoundingClientRect():{left:innerWidth/2,top:innerHeight/2,width:0};
    const y=r.top+(r.height||0)/2;
    confetti(r.left+r.width/2,y,36+Math.min(k,6)*8);
    pop("+"+gain+" XP",r.left+r.width-70,y-10);
    setTimeout(()=>SFX.play("xp"),220);
    badge(k);
  }
  function pips(s,q){
    const p=$("pips");if(!p)return;
    p.innerHTML="";
    for(let i=0;i<8;i++){
      const e=document.createElement("span");
      if(i<s)e.className="done";
      else if(i===s){e.className="now";e.style.setProperty("--f",(q/3*100)+"%")}
      p.appendChild(e);
    }
  }
  function onQuestion(s,q){
    const o=$("quizOverlay");
    o.style.setProperty("--gold2",ACC[s]);o.style.setProperty("--gold",ACC[s]);
    pips(s,q);
    const h=$("question");h.classList.remove("slide");void h.offsetWidth;h.classList.add("slide");
  }
  let catToastTimer=null;
  const CAT_LINES={
    sideeye:{tag:"SIDE-EYE CAT",sound:"catMeow",face:"sideeye"},
    cry:{tag:"CRYING CAT",sound:"sadMeow",face:"cry"},
    smug:{tag:"SMUG CAT",sound:"catLaugh",face:"smug"},
    shock:{tag:"SHOCKED CAT",sound:"vineBoom",face:"shock"},
    sleepy:{tag:"SLEEPY CAT",sound:"bruh",face:"sleepy"},
    judge:{tag:"JUDGING CAT",sound:"bruh",face:"judge"}
  };
  function catSVG(face){
    const eye=(x,y,r=7)=>`<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r+2}" fill="#111"/>`;
    let eyes="",mouth="<path d='M43 65q7 8 14 0' fill='none' stroke='#111' stroke-width='3' stroke-linecap='round'/>";
    if(face==="sideeye"){eyes=`<ellipse cx="39" cy="49" rx="5" ry="8" fill="#111"/><ellipse cx="64" cy="49" rx="8" ry="5" fill="#111"/>`;mouth="<path d='M43 68q10-6 19 0' fill='none' stroke='#111' stroke-width='3'/>"}
    if(face==="cry"){eyes=`${eye(39,49)}${eye(64,49)}<path d='M35 57q-9 15 1 20q8-4 2-20M65 57q-8 16 2 20q8-5-2-20' fill='#65b8ff'/>`;mouth="<path d='M42 69q8-12 16 0' fill='none' stroke='#111' stroke-width='3'/>"}
    if(face==="smug"){eyes="<path d='M30 49q9-10 18 0M57 49q9-10 18 0' fill='none' stroke='#111' stroke-width='4' stroke-linecap='round'/>";mouth="<path d='M43 66q13 8 22-3' fill='none' stroke='#111' stroke-width='4' stroke-linecap='round'/>"}
    if(face==="shock"){eyes=`${eye(39,49,9)}${eye(64,49,9)}`;mouth="<ellipse cx='52' cy='69' rx='7' ry='10' fill='#111'/>"}
    if(face==="sleepy"){eyes="<path d='M29 52q10-9 20 0M57 52q10-9 20 0' fill='none' stroke='#111' stroke-width='4' stroke-linecap='round'/>";mouth="<path d='M44 68q8 4 16 0' fill='none' stroke='#111' stroke-width='3'/>"}
    if(face==="judge"){eyes="<path d='M29 47l20 5M57 52l20-5' stroke='#111' stroke-width='5' stroke-linecap='round'/>";mouth="<path d='M42 69h20' stroke='#111' stroke-width='4' stroke-linecap='round'/>"}
    const fur=face==="smug"?"#f2a34a":face==="cry"?"#d8dce5":face==="sleepy"?"#b9b9b3":"#fff";
    const inner=face==="smug"?"#c96f28":"#aaa";
    return `<svg viewBox='0 0 104 104' role='img' aria-label='Funny cat reaction'><rect width='104' height='104' fill='#e9e9e4'/><path d='M17 38L12 10Q29 13 38 29Q52 22 67 29Q78 12 93 10L87 43Q95 59 86 79Q76 96 52 96Q28 96 18 79Q9 59 17 38Z' fill='${fur}' stroke='#111' stroke-width='3'/><path d='M20 29L17 17Q29 20 36 32M84 29L88 17Q76 20 69 32' fill='${inner}' stroke='#111' stroke-width='2'/><path d='M29 39q9-6 18 0M57 39q9-6 18 0' fill='none' stroke='#111' stroke-width='3'/>${eyes}<path d='M48 59q4-5 8 0q-4 5-8 0' fill='#f28b9b' stroke='#111' stroke-width='1.5'/>${mouth}<path d='M20 62L4 58M20 68L4 70M84 62l16-4M84 68l16 2' stroke='#111' stroke-width='1.5'/>${face==="cry"?"<path d='M35 58q-10 17 0 22M67 58q10 17 0 22' stroke='#56a9ed' stroke-width='4' fill='none'/>":""}<path d='M38 87q14 7 28 0' fill='none' stroke='#ddd' stroke-width='3'/></svg>`;
  }
  function catReaction(kind,caption,sound){
    const cfg=CAT_LINES[kind]||CAT_LINES.sideeye,box=$("catMemeToast");
    if(!box)return;
    clearTimeout(catToastTimer);
    $("catMemeArt").innerHTML=catSVG(cfg.face);
    $("catMemeTag").textContent=cfg.tag;
    $("catMemeCaption").textContent=caption||"The cat has reviewed your decision.";
    box.classList.remove("hidden","show");void box.offsetWidth;box.classList.add("show");
    SFX.play(sound||cfg.sound);
    catToastTimer=setTimeout(()=>{box.classList.remove("show");setTimeout(()=>box.classList.add("hidden"),380)},3100);
  }
  function trollMood(score){
    if(score===3){confetti(null,null,90);catReaction("smug","A perfect score? The cat suspects academic fraud.","catLaugh")}
    else if(score===2)catReaction("sideeye","2/3. The cat expected more. It always does.","catMeow");
    else if(score===1)catReaction("cry","1/3. Even the cat is trying not to laugh.","sadMeow");
    else catReaction("shock","0/3. The calculator has requested a new owner.","vineBoom");
  }

  /* ---------- stage card ---------- */
  function stageCard(s,cb){
    const c=$("stageCard");
    $("scNum").textContent="STAGE "+String(s+1).padStart(2,"0");
    $("scName").textContent=STAGES[s];
    $("scTag").textContent=s===7?"FINAL BOSS · DO NOT BLINK · 30 XP PER ANSWER"
      :s>=HARD?"HARD MODE · 45 SECOND TIMER · 30 XP PER ANSWER":"WARM START · 20 XP PER ANSWER";
    c.style.setProperty("--acc",ACC[s]);
    c.classList.remove("hidden","go");void c.offsetWidth;c.classList.add("go");
    SFX.play("stage");
    setTimeout(()=>{c.classList.add("hidden");cb()},RM?500:1700);
  }

  /* ---------- team intro (first run of each visit) ---------- */
  function teamIntro(cb){
    if(sessionStorage.getItem("mk_intro")){cb();return}
    sessionStorage.setItem("mk_intro","1");
    const t=$("teamIntro");let au=null,tt=0,done=false;
    $("tiTeam").textContent=MK_CONFIG.team;
    t.classList.remove("hidden");
    const end=()=>{
      if(done)return;done=true;clearTimeout(tt);
      if(au&&au.pause)au.pause();
      t.classList.add("hidden");cb();
    };
    au=SFX.play("intro");
    tt=setTimeout(end,RM?1200:4800);
    $("tiSkip").onclick=end;
  }

  /* ---------- secret troll stage ---------- */
  let sI=0,sLeft=20,sClicks=0,secretOn=false;
  function secretClick(b){
    if(!secretOn||hearts<=0)return;
    sClicks++;
    b.classList.remove("wrong");void b.offsetWidth;b.classList.add("wrong");
    loseHeart();
    const m=["Wrong! 💔","Nope! 😂","Still wrong! 🤣","Are you even reading? 👀"];
    $("smsg").textContent=m[sClicks%m.length];
    if(hearts<=0){
      setTimeout(()=>{
        if(!secretOn)return;
        setHearts(3);$("smsg").textContent="Hearts reloaded! There is no game over here. Just wait… 😏";
      },1100);
    }
  }
  function secretStage(cb){
    secretOn=true;sClicks=0;sLeft=20;setHearts(3);
    const o=$("quizOverlay");o.style.setProperty("--gold2",ACC[7]);o.style.setProperty("--gold",ACC[7]);
    $("stageLabel").textContent="SECRET STAGE / ???";$("questionNumber").textContent="";
    $("timer").textContent="";$("timebar").classList.add("hidden");
    $("progress").style.width="100%";
    $("smsg").textContent="";$("psst").classList.remove("on");$("ssecs").textContent=sLeft;
    document.querySelectorAll("#secretView .option").forEach(b=>{b.disabled=false;b.classList.remove("wrong","selected","correct")});
    $("secretView").classList.remove("hidden");
    SFX.play("stage");
    const bar=$("sbar");
    bar.style.transition="none";bar.style.width="100%";void bar.offsetWidth;
    bar.style.transition="width 20s linear";bar.style.width="0";
    clearInterval(sI);
    sI=setInterval(()=>{
      sLeft--;$("ssecs").textContent=Math.max(sLeft,0);
      if(sLeft>0&&sLeft<=10)SFX.play(sLeft<=5?"tick2":"tick");
      if(sLeft===12)$("psst").classList.add("on");
      if(sLeft<=0){clearInterval(sI);reveal(cb)}
    },1000);
  }
  function reveal(cb){
    secretOn=false;
    const f=$("faaah");
    f.classList.remove("hidden","go");void f.offsetWidth;f.classList.add("go");
    SFX.play("faaah");
    setTimeout(()=>{
      f.classList.add("hidden");f.classList.remove("go");
      $("secretView").classList.add("hidden");
      $("quizOverlay").style.setProperty("--gold2","#e6c260");
      cb(sClicks
        ?{xp:25,msg:"Secret stage: you clicked "+sClicks+" time"+(sClicks>1?"s":"")+" and broke hearts for nothing. Troll bonus +25 XP."}
        :{xp:100,msg:"Secret stage: you did not touch a thing. Patience bonus +100 XP!"});
    },RM?900:2300);
  }
  function stopSecret(){
    clearInterval(sI);secretOn=false;
    $("secretView").classList.add("hidden");$("faaah").classList.add("hidden");
  }

  /* ---------- misc ---------- */
  function enterFS(){
    try{const r=document.documentElement.requestFullscreen&&document.documentElement.requestFullscreen();if(r&&r.catch)r.catch(()=>{})}catch(e){}
  }
  function syncSound(){
    document.querySelectorAll(".sound-btn").forEach(b=>b.textContent=SFX.isMuted()?"🔇":"🔊");
  }
  function soundBtn(){
    const b=document.createElement("button");
    b.type="button";b.className="sound-btn";b.setAttribute("aria-label","Turn sound on or off");
    b.onclick=()=>{SFX.toggle();syncSound();SFX.play("select")};
    return b;
  }

  /* ---------- one-time setup ---------- */
  (function init(){
    const panel=document.querySelector("#quizOverlay .quiz-panel"),head=panel.querySelector(".quiz-head");
    // floating maths symbols behind the quiz
    const bg=document.createElement("div");bg.className="bgsym";
    "+ − × ÷ π ∑ √ ∞ % = x² ∫ ∆ ≈ θ".split(" ").forEach((s,i)=>{
      const e=document.createElement("span");e.textContent=s;
      e.style.cssText="left:"+(i*7.3%96)+"%;--sz:"+(26+(i*13)%40)+"px;--d:"+(16+(i*5)%14)+"s;--dl:-"+((i*3)%16)+"s;--r:"+(i%2?240:-240)+"deg";
      bg.appendChild(e);
    });
    panel.prepend(bg);
    // streak badge + sound buttons
    const st=document.createElement("span");st.id="streakBadge";st.className="streak hidden";
    head.insertBefore(st,$("closeQuiz"));
    head.insertBefore(soundBtn(),$("closeQuiz"));
    document.querySelector(".topbar").appendChild(soundBtn());
    syncSound();
    // stage pips
    const pp=document.createElement("div");pp.id="pips";pp.className="pips";
    panel.insertBefore(pp,panel.querySelector(".progress"));
    // secret stage + faaah face use the troll drawing from the stage result
    const face=document.querySelector("#stageResult .troll");
    if(face)$("faaahFace").appendChild(face.cloneNode(true));
    document.querySelectorAll("#secretView .option").forEach(b=>b.onclick=()=>secretClick(b));
    // keyboard: A-D or 1-4 to choose, Enter to submit
    addEventListener("keydown",e=>{
      if(e.repeat||$("quizOverlay").classList.contains("hidden"))return;
      if(e.target.matches&&e.target.matches("input,select,textarea"))return;
      if(!$("stageCard").classList.contains("hidden"))return;
      if(!$("questionView").classList.contains("hidden")){
        const opts=document.querySelectorAll("#options .option"),
          i="ABCD".indexOf(e.key.toUpperCase()),j=["1","2","3","4"].indexOf(e.key),idx=i>=0?i:j;
        if(idx>=0&&opts[idx]&&!opts[idx].disabled)opts[idx].click();
        else if(e.key==="Enter"&&!$("submit").disabled){e.preventDefault();$("submit").click()}
      }else if(e.key==="Enter"&&!$("stageResult").classList.contains("hidden")){
        $("nextStage").click();
      }
    });
  })();

  return{confetti,shards,onCorrect,streak:badge,onQuestion,trollMood,catReaction,stageCard,teamIntro,secretStage,stopSecret,enterFS};
})();
