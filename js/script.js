(function(){
  var nav=document.getElementById('nav'),par=[].slice.call(document.querySelectorAll('[data-speed]'));
  document.getElementById('yr').textContent=new Date().getFullYear();
  function onScroll(){
    var y=window.scrollY;nav.classList.toggle('solid',y>40);
    if(y<900)par.forEach(function(e){e.style.translate='0 '+(y*parseFloat(e.dataset.speed))+'px'});
  }
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();
  var hero=document.querySelector('.hero');
  hero.addEventListener('mousemove',function(e){
    var x=(e.clientX/innerWidth-.5),y=(e.clientY/innerHeight-.5);
    document.querySelectorAll('.blob').forEach(function(b,i){b.style.marginLeft=(x*(i+1)*24)+'px';b.style.marginTop=(y*(i+1)*24)+'px'});
  });
  var io=new IntersectionObserver(function(es){es.forEach(function(e){
    if(!e.isIntersecting)return;e.target.classList.add('in');
    io.unobserve(e.target);
  })},{threshold:.15});
  document.querySelectorAll('.rv').forEach(function(e){io.observe(e)});
  /* mobile menu */
  var bg=document.getElementById('burger'),lk=document.getElementById('links');
  function menu(o){lk.classList.toggle('open',o);bg.classList.toggle('open',o);bg.setAttribute('aria-expanded',o);nav.classList.toggle('menu',o)}
  bg.addEventListener('click',function(){menu(!lk.classList.contains('open'))});
  lk.addEventListener('click',function(e){if(e.target.closest('a'))menu(false)});
  /* call & email: copy as fallback when no phone / mail app opens */
  var toast=document.createElement('div');toast.className='toast';document.body.appendChild(toast);var tt;
  function say(m){toast.textContent=m;toast.classList.add('show');clearTimeout(tt);tt=setTimeout(function(){toast.classList.remove('show')},2600)}
  function copy(v){
    if(navigator.clipboard&&window.isSecureContext)return navigator.clipboard.writeText(v);
    return new Promise(function(ok,no){try{var t=document.createElement('textarea');t.value=v;t.style.position='fixed';t.style.opacity='0';document.body.appendChild(t);t.select();document.execCommand('copy')?ok():no();document.body.removeChild(t)}catch(x){no(x)}});
  }
  document.querySelectorAll('a[href^="tel:"],a[href^="mailto:"]').forEach(function(a){
    a.addEventListener('click',function(e){
      if(a.hasAttribute('data-email'))return;
      var h=a.getAttribute('href')||'';if(!h)return;var tel=h.indexOf('tel:')===0,v=h.replace(/^(tel|mailto):/,''),touch=matchMedia('(pointer:coarse)').matches;
      if(tel&&touch)return;                       /* phones dial directly */
      if(tel)e.preventDefault();                  /* computers cannot dial */
      copy(v).then(function(){say(tel?'Number copied: '+v:'Email address copied')},function(){say(tel?'Please call '+v:'Write to '+v)});
    });
  });
})();

(function(){
  var rm=matchMedia('(prefers-reduced-motion:reduce)').matches,fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
  /* scroll progress + back to top */
  var pr=document.getElementById('progress'),tt=document.getElementById('totop'),fb=document.querySelector('.fab');
  function sc(){var y=scrollY,m=document.documentElement.scrollHeight-innerHeight;pr.style.transform='scaleX('+(m>0?y/m:0)+')';tt.classList.toggle('show',y>600);fb&&fb.classList.toggle('show',y>320)}
  addEventListener('scroll',sc,{passive:true});sc();
  tt.addEventListener('click',function(){scrollTo({top:0,behavior:rm?'auto':'smooth'})});
  /* active menu link */
  var links=[].slice.call(document.querySelectorAll('.links a:not(.btn)'));
  var spy=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)links.forEach(function(a){a.classList.toggle('active',a.getAttribute('href')==='#'+e.target.id)})})},{rootMargin:'-45% 0px -50% 0px'});
  document.querySelectorAll('#services,#about,#approach,#faq,#contact').forEach(function(s){spy.observe(s)});
  /* card spotlight + 3D tilt */
  if(fine&&!rm)document.querySelectorAll('.card').forEach(function(c){
    c.addEventListener('mousemove',function(e){
      var r=c.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;
      c.style.setProperty('--mx',x+'px');c.style.setProperty('--my',y+'px');c.classList.add('tilting');
      c.style.transform='perspective(700px) rotateX('+((.5-y/r.height)*8)+'deg) rotateY('+((x/r.width-.5)*8)+'deg) translateY(-8px)';
    });
    c.addEventListener('mouseleave',function(){c.classList.remove('tilting');c.style.transform=''});
  });
  /* hero network animation */
  var cv=document.getElementById('net');if(!cv||rm)return;
  var x=cv.getContext('2d'),W,H,P=[],d=Math.min(devicePixelRatio||1,2),on=true,m={x:-999,y:-999};
  function size(){var r=cv.getBoundingClientRect();W=r.width;H=r.height;cv.width=W*d;cv.height=H*d;x.setTransform(d,0,0,d,0,0);
    P=[];for(var i=0,n=Math.min(70,Math.round(W*H/15000));i<n;i++)P.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.4,vy:(Math.random()-.5)*.4})}
  var lw=0;size();lw=W;addEventListener('resize',function(){if(Math.abs(innerWidth-lw)>20||!P.length){size();lw=W}});
  cv.parentNode.addEventListener('mousemove',function(e){var r=cv.getBoundingClientRect();m.x=e.clientX-r.left;m.y=e.clientY-r.top});
  cv.parentNode.addEventListener('mouseleave',function(){m.x=m.y=-999});
  new IntersectionObserver(function(e){on=e[0].isIntersecting}).observe(cv);
  (function loop(){
    requestAnimationFrame(loop);if(!on)return;x.clearRect(0,0,W,H);
    P.forEach(function(p,i){
      p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1;
      x.fillStyle='rgba(205,220,240,.75)';x.beginPath();x.arc(p.x,p.y,1.7,0,6.283);x.fill();
      for(var k=i+1;k<P.length;k++){var q=P[k],dx=p.x-q.x,dy=p.y-q.y,s=dx*dx+dy*dy;if(s<14400){x.strokeStyle='rgba(150,190,235,'+(1-s/14400)*.35+')';x.beginPath();x.moveTo(p.x,p.y);x.lineTo(q.x,q.y);x.stroke()}}
      var mx=p.x-m.x,my=p.y-m.y,ms=mx*mx+my*my;if(ms<22500){x.strokeStyle='rgba(255,255,255,'+(1-ms/22500)*.5+')';x.beginPath();x.moveTo(p.x,p.y);x.lineTo(m.x,m.y);x.stroke()}
    });
  })();
})();

/* FAQ: keep one answer open at a time */
document.querySelectorAll('.acc details').forEach(function(d){d.addEventListener('toggle',function(){if(d.open)document.querySelectorAll('.acc details').forEach(function(o){if(o!==d)o.open=false})})});

/* page loader, headline words, magnetic buttons */
(function(){
  var rm=matchMedia('(prefers-reduced-motion:reduce)').matches,fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
  document.querySelectorAll('.hero h1').forEach(function(h){
    h.innerHTML=h.textContent.trim().split(/\s+/).map(function(w,i){return '<span class="w" style="--i:'+i+'">'+w+'</span>'}).join(' ');
  });
  var l=document.getElementById('loader'),t0=performance.now(),loaded=false,pct=0,MIN=1700;
  function after(){
    setTimeout(function(){
      l.classList.add('done');
      setTimeout(function(){document.body.classList.remove('loading')},450);
      setTimeout(function(){l.remove()},1700);
    },260);
  }
  if(!l){document.body.classList.remove('loading')}
  else if(rm){document.body.classList.remove('loading');l.remove()}
  else{
    var bar=l.querySelector('.ld-bar i'),num=l.querySelector('.ld-pct');
    var last=t0;
    (function tick(now){
      now=now||performance.now();var dt=Math.min(100,now-last);last=now;
      var el=now-t0,b=Math.min(1,el/MIN);b=1-Math.pow(1-b,3);
      var go=loaded&&el>=MIN,target=go?100:Math.min(92,b*92);
      pct+=(target-pct)*(1-Math.exp(-dt/(go?70:160)));
      if(go&&pct>99.4)pct=100;
      bar.style.width=pct+'%';num.textContent=Math.round(pct)+'%';
      if(pct<100)requestAnimationFrame(tick);else after();
    })();
    if(document.readyState==='complete')loaded=true;else addEventListener('load',function(){loaded=true});
    setTimeout(function(){loaded=true},2600);
  }
  if(fine&&!rm)document.querySelectorAll('.btn').forEach(function(b){
    b.addEventListener('mousemove',function(e){var r=b.getBoundingClientRect();b.style.translate=((e.clientX-r.left-r.width/2)*.18)+'px '+((e.clientY-r.top-r.height/2)*.28)+'px'});
    b.addEventListener('mouseleave',function(){b.style.translate=''});
  });
})();

/*        scroll effects: hero fade, steps light-up, ticker speed, side dots       */
(function(){
  var rm=matchMedia('(prefers-reduced-motion:reduce)').matches,
      hw=document.querySelector('.hero .wrap'),steps=[].slice.call(document.querySelectorAll('.step')),
      dots=[].slice.call(document.querySelectorAll('#dots a')),
      secs=dots.map(function(a){return document.querySelector(a.getAttribute('href'))}),
      tr=document.querySelector('.track'),an=tr&&tr.getAnimations&&tr.getAnimations()[0],last=scrollY,vel=0,tick=false;
  function frame(){
    tick=false;var y=scrollY,vh=innerHeight;
    if(!rm&&hw&&y<vh){var p=Math.min(y/(vh*.7),1);hw.style.opacity=1-p*.85;hw.style.translate='0 '+(y*.2)+'px';hw.style.scale=1-p*.05}
    steps.forEach(function(s){s.classList.toggle('on',s.getBoundingClientRect().top<vh*.78)});
    var cur=0;secs.forEach(function(s,i){if(s&&s.getBoundingClientRect().top<vh*.45)cur=i});
    dots.forEach(function(d,i){d.classList.toggle('on',i===cur)});
  }
  function onScroll(){if(!tick){tick=true;requestAnimationFrame(frame)}}
  addEventListener('scroll',onScroll,{passive:true});addEventListener('resize',onScroll);frame();
  /* ticker speeds up while you scroll, then eases back */
  if(an&&!rm)(function loop(){
    requestAnimationFrame(loop);
    var dy=Math.abs(scrollY-last);last=scrollY;vel+=(dy-vel)*.1;
    var r=1+Math.min(vel/5,7);if(Math.abs(an.playbackRate-r)>.02)an.playbackRate=r;
  })();
})();

/* contact pop-up: call, or email form that sends straight to your inbox */
(function(){
  var md=document.getElementById('contactModal');if(!md)return;
  var form=document.getElementById('mForm'),err=document.getElementById('mErr'),btn=form.querySelector('.m-send'),last=null,timer=null;
  function view(n){
    md.querySelectorAll('.m-view').forEach(function(v){v.classList.toggle('on',v.id==='v'+n)});
    setTimeout(function(){var t=n==='Form'?form.querySelector('input'):n==='Done'?md.querySelector('#vDone .btn'):md.querySelector('.m-x');if(t)t.focus({preventScroll:true})},70);
  }
  function open(n,notice){
    var cb=document.getElementById('mClosed');cb.textContent=notice||'';cb.hidden=!notice;
    if(!md.classList.contains('open')){last=document.activeElement;md.classList.add('open');md.setAttribute('aria-hidden','false');document.documentElement.style.overflow='hidden'}
    view(n||'Choose');
  }
  function reset(){form.reset();err.textContent='';btn.classList.remove('loading');form.querySelectorAll('.f').forEach(function(f){f.classList.remove('bad');var e=f.querySelector('.err');if(e)e.textContent=''});
    md.querySelectorAll('.m-view').forEach(function(v){v.classList.toggle('on',v.id==='vChoose')})}
  function close(){
    if(!md.classList.contains('open'))return;clearTimeout(timer);
    md.classList.remove('open');md.setAttribute('aria-hidden','true');document.documentElement.style.overflow='';
    if(last&&last.focus)last.focus({preventScroll:true});setTimeout(reset,450);
  }
  function done(name){
    document.getElementById('doneTxt').textContent='Thank you, '+(name||'').trim().split(' ')[0]+'. We have received your question and will contact you soon.';
    var bar=md.querySelector('.auto'),c=bar.cloneNode(true);bar.parentNode.replaceChild(c,bar);
    view('Done');clearTimeout(timer);timer=setTimeout(close,7000);
  }
  window.openContact=open;
  document.querySelectorAll('[data-contact]').forEach(function(a){a.addEventListener('click',function(e){e.preventDefault();open('Choose')})});
  document.querySelectorAll('[data-email]').forEach(function(a){a.addEventListener('click',function(e){e.preventDefault();open('Form')})});
  md.addEventListener('click',function(e){
    if(e.target.closest('[data-close]'))close();
    else if(e.target.closest('[data-view]'))view(e.target.closest('[data-view]').getAttribute('data-view'));
    else if(e.target.closest('.m-opt a'))setTimeout(close,300);
  });
  form.addEventListener('submit',function(e){
    e.preventDefault();err.textContent='';
    var bad=window.checkForm(form);if(bad){bad.focus();return}
    var d={};new FormData(form).forEach(function(v,k){d[k]=v});
    if(d._honey){done(d.name);return}
    btn.classList.add('loading');
    window.sendMail({_subject:'New enquiry from website: '+d.name,name:d.name,phone:d.phone,email:d.email,service:d.service,message:d.message,_replyto:d.email})
      .then(function(){btn.classList.remove('loading');done(d.name)},
            function(){btn.classList.remove('loading');err.textContent='Sorry, we could not send your message right now. Please try again, or call us on +91 98318 34544.'});
  });
  addEventListener('keydown',function(e){
    if(!md.classList.contains('open'))return;
    if(e.key==='Escape')close();
    if(e.key==='Tab'){var f=[].slice.call(md.querySelectorAll('button,a[href],input:not(.hp),select,textarea')).filter(function(x){return x.offsetParent!==null}),i=f.indexOf(document.activeElement);
      if(e.shiftKey&&i<=0){e.preventDefault();f[f.length-1].focus()}else if(!e.shiftKey&&i===f.length-1){e.preventDefault();f[0].focus()}}
  });
})();

/* business hours: live open/closed status in Indian time */
(function(){
  var els=document.querySelectorAll('[data-status]'),rows=document.querySelectorAll('.hr-list li'),tels=[].slice.call(document.querySelectorAll('a[href^="tel:"]')),MAIL='<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>';
  tels.forEach(function(a){a.setAttribute('data-tel',a.getAttribute('href'))});
  if(!els.length)return;
  function hrs(d){return d===0?[600,1080]:[540,1140]}
  function fmt(m){var h=Math.floor(m/60);return (h%12||12)+':'+('0'+m%60).slice(-2)+' '+(h>=12?'PM':'AM')}
  function now(){var o={};new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Kolkata',weekday:'short',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(new Date()).forEach(function(p){o[p.type]=p.value});
    return {d:['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(o.weekday),m:(+o.hour)*60+(+o.minute)}}

  function calls(open,when){
    document.documentElement.classList.toggle('closed',!open);
    tels.forEach(function(a){
      var s=a.querySelector('small'),btn=a.classList.contains('btn'),fab=a.classList.contains('fab');
      if(open){
        if(a.hasAttribute('data-tel')&&!a.getAttribute('href')){
          a.setAttribute('href',a.getAttribute('data-tel'));a.removeAttribute('aria-disabled');a.removeAttribute('role');a.removeAttribute('tabindex');a.classList.remove('call-off');
          if(s)s.textContent=a.getAttribute('data-lab');
          if(btn)a.textContent=a.getAttribute('data-lab');
          if(fab){a.innerHTML=a.getAttribute('data-lab');a.setAttribute('aria-label','Call us')}
        }
      }else if(a.getAttribute('href')){
        if(s)a.setAttribute('data-lab',s.textContent);
        if(btn)a.setAttribute('data-lab',a.textContent);
        if(fab)a.setAttribute('data-lab',a.innerHTML);
        a.removeAttribute('href');a.setAttribute('role','link');a.setAttribute('tabindex','0');a.setAttribute('aria-disabled','true');a.classList.add('call-off');
        if(s)s.textContent='Phone \u00b7 closed now';
        if(btn)a.textContent='Calls closed';
        if(fab){a.innerHTML=MAIL;a.setAttribute('aria-label','Email us')}
      }
    });
    document.querySelectorAll('[data-callnote]').forEach(function(n){n.hidden=open;n.textContent=open?'':'Our phone lines are closed right now. We open '+when+'. Please email us instead and we will reply.'});
    window.__closedWhen=open?'':when;
  }
  document.addEventListener('click',function(e){
    var a=e.target.closest&&e.target.closest('a.call-off');if(!a)return;
    e.preventDefault();e.stopPropagation();
    if(window.openContact)window.openContact('Form','Our phone lines are closed right now. We open '+window.__closedWhen+'. Please leave your question below and we will reply as soon as we can.');
  },true);
  document.addEventListener('keydown',function(e){if((e.key==='Enter'||e.key===' ')&&e.target.classList&&e.target.classList.contains('call-off')){e.preventDefault();e.target.click()}});
  function update(){
    try{
      var t=now(),h=hrs(t.d),open=t.m>=h[0]&&t.m<h[1],txt;
      if(open)txt='Open now \u00b7 Closes '+fmt(h[1]);
      else if(t.m<h[0])txt='Closed \u00b7 Opens today '+fmt(h[0]);
      else txt='Closed \u00b7 Opens tomorrow '+fmt(hrs((t.d+1)%7)[0]);
      els.forEach(function(e){e.className='status '+(open?'open':'closed');e.lastChild.textContent=txt});
      calls(open,open?'':(t.m<h[0]?'today at '+fmt(h[0]):'tomorrow at '+fmt(hrs((t.d+1)%7)[0])));
      var box=document.querySelector('.hours'),pct=Math.max(0,Math.min(100,(t.m-h[0])/(h[1]-h[0])*100));
      if(box)box.classList.toggle('is-open',open);
      rows.forEach(function(li){var td=li.getAttribute('data-days').split(',').indexOf(String(t.d))>-1,bar=li.querySelector('.bar');li.classList.toggle('today',td);if(bar)bar.style.width=(td&&open?pct:0)+'%'});
      var hh=document.getElementById('hH'),mm=document.getElementById('hM');
      if(hh&&mm){hh.style.transform='rotate('+(((Math.floor(t.m/60)%12)+(t.m%60)/60)*30)+'deg)';mm.style.transform='rotate('+((t.m%60)*6)+'deg)'}
    }catch(e){els.forEach(function(x){x.style.display='none'})}
  }
  update();setInterval(update,60000);
})();

/* footer credit: little hearts float up */
(function(){
  var card=document.getElementById('creditCard'),heart=card&&card.querySelector('.heart');
  if(!card||!heart||matchMedia('(prefers-reduced-motion:reduce)').matches)return;
  var busy=false;
  function burst(){
    if(busy)return;busy=true;setTimeout(function(){busy=false},700);
    var c=card.getBoundingClientRect(),h=heart.getBoundingClientRect();
    for(var i=0;i<7;i++){
      var s=document.createElement('span');s.className='fh';
      s.style.left=(h.left-c.left+h.width/2-7)+'px';s.style.top=(h.top-c.top)+'px';
      s.style.setProperty('--dx',((Math.random()-.5)*90)+'px');s.style.setProperty('--s',(.7+Math.random()*.8).toFixed(2));s.style.setProperty('--r',((Math.random()-.5)*50)+'deg');
      s.style.animationDelay=(i*70)+'ms';
      s.innerHTML='<svg viewBox="0 0 24 24"><path d="M12 21s-7.5-4.6-9.6-9.3C.9 8.2 3 4.5 6.7 4.5c2 0 3.7 1.1 5.3 3 1.6-1.9 3.3-3 5.3-3 3.7 0 5.8 3.7 4.3 7.2C19.5 16.4 12 21 12 21z"/></svg>';
      card.appendChild(s);setTimeout(function(el){el.remove()},1800+i*70,s);
    }
  }
  card.addEventListener('mouseenter',burst);card.addEventListener('click',burst);card.addEventListener('touchstart',burst,{passive:true});
  /* also once when it scrolls into view */
  new IntersectionObserver(function(e,o){if(e[0].isIntersecting){setTimeout(burst,500);o.disconnect()}},{threshold:.9}).observe(card);
})();

/* customer rating */
(function(){
  var form=document.getElementById('rateForm');if(!form)return;
  var starsBox=document.getElementById('stars'),stars=[].slice.call(starsBox.querySelectorAll('.star')),label=document.getElementById('starLabel'),
      rerr=document.getElementById('rateErr'),serr=document.getElementById('rErr'),btn=form.querySelector('.m-send'),val=0,
      words=['','Poor','Fair','Good','Very good','Excellent!'];
  var P='<svg viewBox="0 0 24 24"><path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z"/></svg>';
  function paint(v){stars.forEach(function(s,i){s.classList.toggle('lit',i<v)})}
  stars.forEach(function(s,i){
    s.addEventListener('mouseenter',function(){paint(i+1)});
    s.addEventListener('focus',function(){paint(i+1)});
    s.addEventListener('click',function(){
      val=i+1;paint(val);rerr.textContent='';label.textContent=words[val];
      stars.forEach(function(x,k){x.setAttribute('aria-checked',k===i?'true':'false')});
      s.classList.remove('pop');void s.offsetWidth;s.classList.add('pop');
    });
    s.addEventListener('keydown',function(e){
      var n=e.key==='ArrowRight'||e.key==='ArrowUp'?i+1:e.key==='ArrowLeft'||e.key==='ArrowDown'?i-1:-1;
      if(n>=0&&n<5){e.preventDefault();stars[n].focus();stars[n].click()}
    });
  });
  starsBox.addEventListener('mouseleave',function(){paint(val)});
  starsBox.addEventListener('focusout',function(){paint(val)});
  form.addEventListener('submit',function(e){
    e.preventDefault();serr.textContent='';
    var bad=window.checkForm(form),noStar=!val;
    if(noStar){rerr.textContent='Please select a star rating';if(!bad)stars[0].focus()}
    if(bad){bad.focus();return}if(noStar)return;
    var d={};new FormData(form).forEach(function(v,k){d[k]=v});
    function ok(){
      btn.classList.remove('loading');
      document.getElementById('rateThanks').textContent='Thank you, '+d.name.trim().split(' ')[0]+'. You rated us '+val+' out of 5.';
      form.hidden=true;document.getElementById('rateDone').hidden=false;
    }
    if(d._honey){ok();return}
    btn.classList.add('loading');
    window.sendMail({_subject:'New customer rating: '+val+'/5 from '+d.name,name:d.name,rating:val+' out of 5',feedback:d.comment})
      .then(ok,function(){btn.classList.remove('loading');serr.textContent='Sorry, we could not send your rating right now. Please try again in a moment.'});
  });
  /* real reviews from js/config.js */
  function sv(n){var s='';for(var i=1;i<=5;i++)s+=P.replace('<svg','<svg'+(i>n?' class="off"':''));return '<span class="sv" aria-label="'+n+' out of 5">'+s+'</span>'}
  window.renderReviews=function(R){
    var sum=document.getElementById('revSum'),box=document.getElementById('reviews');sum.innerHTML='';box.innerHTML='';
    if(!R||!R.length)return;
    var avg=R.reduce(function(a,r){return a+(+r.rating||0)},0)/R.length;
    sum.innerHTML='<b>'+avg.toFixed(1)+'</b><div>'+sv(Math.round(avg))+'<small>Based on '+R.length+' customer review'+(R.length>1?'s':'')+'</small></div>';
    R.forEach(function(r){
      var d=document.createElement('div');d.className='rev';
      d.innerHTML=sv(Math.round(+r.rating||0))+'<p></p><div><b></b><small></small></div>';
      d.querySelector('p').textContent=r.text||'';d.querySelector('b').textContent=r.name||'Customer';d.querySelector('small').textContent=r.date||'';
      box.appendChild(d);
    });
  };
  window.renderReviews(window.REVIEWS);
})();
