
async function applyConfig(){
  try{
    const res = await fetch('config.json');
    const cfg = await res.json();
    document.querySelectorAll('[data-link="instagram"]').forEach(a=>a.href=cfg.social.instagram);
    document.querySelectorAll('[data-link="tiktok"]').forEach(a=>a.href=cfg.social.tiktok);
    document.querySelectorAll('[data-link="goodreads"]').forEach(a=>a.href=cfg.social.goodreads);
    const nl = document.querySelector('[data-newsletter]');
    if(nl && cfg.newsletter.action_url){ nl.action = cfg.newsletter.action_url; }
    const cf = document.querySelector('[data-contact]');
    if(cf){
      if(cfg.contact.provider==='formspree' && cfg.contact.action_url){
        cf.action = cfg.contact.action_url; cf.removeAttribute('data-netlify');
      }else if(cfg.contact.provider==='netlify'){
        cf.setAttribute('data-netlify','true'); cf.removeAttribute('action');
      }else if(cfg.contact.provider==='mailto'){
        cf.addEventListener('submit',(e)=>{
          e.preventDefault();
          const params = new URLSearchParams(new FormData(cf));
          window.location = 'mailto:'+cfg.site.email+'?subject=Website%20message&body='+encodeURIComponent(params.get('message')+'\n\nFrom: '+params.get('name')+' ('+params.get('email')+')');
        });
      }
    }
    if(cfg.analytics.provider==='google' && cfg.analytics.google_measurement_id){
      const gtag = document.createElement('script');
      gtag.src = `https://www.googletagmanager.com/gtag/js?id=${cfg.analytics.google_measurement_id}`;
      gtag.async = true; document.head.appendChild(gtag);
      window.dataLayer = window.dataLayer || []; function g(){dataLayer.push(arguments)}; window.gtag = g;
      g('js', new Date()); g('config', cfg.analytics.google_measurement_id, { anonymize_ip: true });
    } else if(cfg.analytics.provider==='goatcounter' && cfg.analytics.goatcounter_domain){
      const s = document.createElement('script');
      s.src = 'https://' + cfg.analytics.goatcounter_domain + '/count.js';
      s.async = true; s.dataset.goatcounter = 'https://' + cfg.analytics.goatcounter_domain + '/count';
      document.head.appendChild(s);
    }
  }catch(e){ console.warn('Config not found or invalid', e); }
}
const toggle = document.querySelector('.nav-toggle');
const menu = document.getElementById('nav-menu');
if (toggle && menu){
  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
}
document.addEventListener('DOMContentLoaded', applyConfig);
