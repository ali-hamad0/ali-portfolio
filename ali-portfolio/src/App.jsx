import { useState, useEffect, useRef } from "react";
import * as api from "./api.js";

const FONT_STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Inter:ital,wght@0,300;0,400;0,500;0,600;1,300&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#f4f6ff;--bg2:#ffffff;--bg3:#edf0fb;--bg4:#e2e6f5;
  --border:rgba(0,0,0,0.07);--border2:rgba(0,0,0,0.13);--border3:rgba(0,0,0,0.22);
  --accent:#0ea5e9;--accent2:#6366f1;--accent3:#ec4899;
  --text:#0d0f1e;--muted:#b0b5d0;--muted2:#5c6280;--danger:#ef4444;
  --card-r:16px;--shadow:0 8px 40px rgba(0,0,0,0.09);
}
html{scroll-behavior:smooth;scroll-padding-top:72px}
body{font-family:'Inter',sans-serif;background:var(--bg);color:var(--text);min-height:100vh;overflow-x:hidden;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}
h1,h2,h3,h4,h5{font-family:'Syne',sans-serif}
::selection{background:rgba(14,165,233,0.18);color:var(--text)}
::-webkit-scrollbar{width:4px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:var(--bg4);border-radius:999px}

/* ── Background */
body::before{content:'';position:fixed;inset:0;pointer-events:none;z-index:0;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E");opacity:0.18}
body::after{content:'';position:fixed;inset:0;pointer-events:none;z-index:0;
  background-image:radial-gradient(circle at 1px 1px,rgba(0,0,0,0.045) 1px,transparent 0);
  background-size:38px 38px}

/* ── Orbs */
.orb{position:fixed;border-radius:50%;pointer-events:none;z-index:0;filter:blur(140px)}
.orb1{width:800px;height:800px;background:radial-gradient(circle,rgba(14,165,233,0.1),transparent 70%);top:-250px;left:-200px}
.orb2{width:600px;height:600px;background:radial-gradient(circle,rgba(99,102,241,0.09),transparent 70%);bottom:-150px;right:-150px}
.orb3{width:450px;height:450px;background:radial-gradient(circle,rgba(236,72,153,0.06),transparent 70%);top:45%;left:50%;transform:translateX(-50%)}

/* ── Scroll Progress */
.scroll-prog{position:fixed;top:0;left:0;height:2px;background:linear-gradient(90deg,var(--accent),var(--accent2),var(--accent3));z-index:300;transition:width .08s linear;pointer-events:none;border-radius:0 2px 2px 0}

/* ── Back to Top */
.back-top{position:fixed;bottom:84px;right:24px;z-index:150;width:42px;height:42px;border-radius:12px;background:var(--bg2);border:1px solid var(--border2);color:var(--muted2);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .28s cubic-bezier(0.16,1,0.3,1);opacity:0;transform:translateY(16px) scale(0.9);pointer-events:none;box-shadow:var(--shadow)}
.back-top.vis{opacity:1;transform:translateY(0) scale(1);pointer-events:auto}
.back-top:hover{background:var(--accent);color:#fff;border-color:var(--accent);transform:translateY(-3px) scale(1)}
@media(max-width:480px){.back-top{bottom:72px;right:16px}}

/* ── Layout */
.site-wrap{position:relative;z-index:1;max-width:1180px;margin:0 auto;padding:0 28px}
@media(max-width:480px){.site-wrap{padding:0 18px}}

/* ── Scroll reveal */
.reveal{opacity:0;transform:translateY(26px);transition:opacity 0.7s cubic-bezier(0.16,1,0.3,1),transform 0.7s cubic-bezier(0.16,1,0.3,1)}
.reveal.visible{opacity:1;transform:translateY(0)}
.rd1{transition-delay:0.07s}.rd2{transition-delay:0.14s}.rd3{transition-delay:0.21s}
.rd4{transition-delay:0.28s}.rd5{transition-delay:0.35s}.rd6{transition-delay:0.42s}

/* ── NAV */
nav{position:sticky;top:0;z-index:100;background:rgba(244,246,255,0.75);backdrop-filter:blur(28px);-webkit-backdrop-filter:blur(28px);border-bottom:1px solid transparent;transition:border-color .35s,background .35s}
nav.scrolled{background:rgba(255,255,255,0.97);border-bottom-color:var(--border)}
.nav-inner{max-width:1180px;margin:0 auto;padding:0 28px;display:flex;align-items:center;justify-content:space-between;height:68px}
.nav-logo{font-family:'Syne',sans-serif;font-weight:800;font-size:1.05rem;color:var(--text);text-decoration:none;display:flex;align-items:center;gap:10px;letter-spacing:-0.02em}
.logo-mark{width:34px;height:34px;border-radius:10px;background:linear-gradient(135deg,var(--accent),var(--accent2));display:flex;align-items:center;justify-content:center;font-size:0.68rem;color:#fff;font-weight:900;flex-shrink:0;letter-spacing:0}
.nav-links{display:flex;align-items:center;gap:2px}
.nav-links a{color:var(--muted2);font-size:0.82rem;text-decoration:none;transition:color .2s,background .2s;font-weight:500;padding:6px 12px;border-radius:8px;letter-spacing:0.01em}
.nav-links a:hover{color:var(--text);background:rgba(0,0,0,0.05)}
.nav-links a.active{color:var(--accent2);background:rgba(99,102,241,0.07)}
.btn-admin{padding:7px 14px;border-radius:8px;font-size:0.76rem;font-weight:600;background:rgba(0,0,0,0.03);border:1px solid var(--border2);color:var(--muted2);cursor:pointer;transition:all .2s;font-family:'Syne',sans-serif;letter-spacing:0.03em;margin-left:6px}
.btn-admin:hover{background:var(--accent);color:#fff;border-color:var(--accent)}
.nav-mobile-menu{display:none;background:none;border:none;color:var(--text);cursor:pointer;padding:4px}
@media(max-width:700px){
  .nav-links{display:none;position:fixed;top:68px;left:0;right:0;background:rgba(255,255,255,0.98);backdrop-filter:blur(28px);border-bottom:1px solid var(--border);flex-direction:column;padding:12px;gap:2px;z-index:99;box-shadow:0 8px 32px rgba(0,0,0,0.08)}
  .nav-links.open{display:flex}
  .nav-links a{padding:12px 16px;border-radius:10px;width:100%}
  .btn-admin{margin-left:0;width:100%;padding:12px 16px;text-align:left;border-radius:10px}
  .nav-mobile-menu{display:block}
}

/* ── HERO */
.hero{padding:118px 0 96px;position:relative}
.hero-tag{display:inline-flex;align-items:center;gap:8px;padding:6px 14px;border-radius:999px;border:1px solid rgba(14,165,233,0.3);background:rgba(14,165,233,0.08);font-size:0.7rem;color:var(--accent);font-weight:600;margin-bottom:24px;letter-spacing:0.08em;text-transform:uppercase}
.hero-tag::before{content:'';width:6px;height:6px;border-radius:50%;background:var(--accent);box-shadow:0 0 9px var(--accent);animation:dot-pulse 2s infinite}
@keyframes dot-pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.25;transform:scale(1.8)}}
.hero h1{font-size:clamp(2.7rem,6.5vw,5rem);font-weight:800;line-height:1.01;letter-spacing:-0.04em;margin-bottom:10px}
.hero h1 .grad{background:linear-gradient(108deg,var(--accent) 0%,var(--accent2) 50%,var(--accent3) 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.hero-typing{font-size:0.95rem;margin-bottom:18px;height:1.6em;display:flex;align-items:center;gap:0;font-weight:400;color:var(--muted2)}
.typing-text{color:var(--accent2);font-family:'Syne',sans-serif;font-weight:600;font-size:0.95rem}
.typing-cursor{color:var(--accent);animation:cur-blink 1s step-end infinite;margin-left:2px;font-weight:200;font-size:1.1rem;line-height:1}
@keyframes cur-blink{0%,100%{opacity:1}50%{opacity:0}}
.hero-sub{font-size:1rem;color:var(--muted2);max-width:500px;line-height:1.84;margin-bottom:40px;font-weight:400;letter-spacing:0.003em}
.hero-actions{display:flex;gap:10px;flex-wrap:wrap}
.hero-inner{display:flex;align-items:center;justify-content:space-between;gap:72px}
.hero-text{flex:1;min-width:0}
.hero-photo-wrap{flex-shrink:0;position:relative}
.hero-photo-glow{position:absolute;inset:-28px;border-radius:56px;z-index:-1;
  background:conic-gradient(from 0deg at 50% 50%,var(--accent),var(--accent2),var(--accent3),var(--accent));
  filter:blur(48px);opacity:0.14;animation:conic-rot 12s linear infinite}
@keyframes conic-rot{to{transform:rotate(360deg)}}
.hero-photo{width:262px;height:320px;border-radius:26px;object-fit:cover;object-position:center top;border:1px solid var(--border2);display:block;box-shadow:0 28px 72px rgba(0,0,0,0.14)}
.hero-photo-placeholder{width:262px;height:320px;border-radius:26px;background:var(--bg3);border:1px dashed var(--border2);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;color:var(--muted2);font-size:0.8rem;cursor:pointer;transition:border-color .2s}
.hero-photo-placeholder:hover{border-color:var(--accent)}
.hero-photo-badge{position:absolute;bottom:-14px;left:50%;transform:translateX(-50%);white-space:nowrap;padding:7px 18px;border-radius:999px;background:var(--bg2);border:1px solid var(--border2);font-size:0.71rem;font-weight:700;font-family:'Syne',sans-serif;color:var(--text);letter-spacing:0.04em;box-shadow:var(--shadow)}
.hero-stats{display:flex;gap:40px;margin-top:52px;padding-top:40px;border-top:1px solid var(--border)}
.hero-stat-num{font-family:'Syne',sans-serif;font-size:1.7rem;font-weight:800;color:var(--text);line-height:1;letter-spacing:-0.03em}
.hero-stat-label{font-size:0.7rem;color:var(--muted2);margin-top:5px;letter-spacing:0.025em;font-weight:400}
@media(max-width:860px){.hero-inner{gap:40px}.hero-photo,.hero-photo-placeholder{width:220px;height:272px}}
@media(max-width:680px){
  .hero{padding:88px 0 68px}
  .hero-inner{flex-direction:column-reverse;gap:36px;text-align:center}
  .hero-photo,.hero-photo-placeholder{width:182px;height:222px}
  .hero-actions{justify-content:center}
  .hero-sub{margin-left:auto;margin-right:auto}
  .hero-stats{justify-content:center;gap:28px}
  .hero-typing{justify-content:center}
}

/* ── Buttons */
.btn-primary{padding:12px 26px;border-radius:10px;font-size:0.87rem;font-weight:700;background:linear-gradient(135deg,var(--accent),var(--accent2));color:#fff;border:none;cursor:pointer;font-family:'Syne',sans-serif;transition:all .24s cubic-bezier(0.16,1,0.3,1);text-decoration:none;display:inline-flex;align-items:center;gap:8px;letter-spacing:0.01em}
.btn-primary:hover{transform:translateY(-2px);box-shadow:0 10px 30px rgba(14,165,233,0.28)}
.btn-outline{padding:12px 26px;border-radius:10px;font-size:0.87rem;font-weight:500;background:var(--bg2);color:var(--muted2);border:1px solid var(--border2);cursor:pointer;font-family:'Inter',sans-serif;transition:all .24s cubic-bezier(0.16,1,0.3,1);text-decoration:none;display:inline-flex;align-items:center;gap:8px}
.btn-outline:hover{border-color:rgba(0,0,0,0.22);color:var(--text);background:var(--bg3);transform:translateY(-1px)}
@media(max-width:480px){.btn-primary,.btn-outline{padding:10px 18px;font-size:0.83rem}}

/* ── Section */
.section{padding:96px 0}
@media(max-width:680px){.section{padding:72px 0}}
.section-header{display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:52px;gap:16px;flex-wrap:wrap}
.section-label{font-size:0.67rem;letter-spacing:0.16em;font-weight:700;color:var(--accent);text-transform:uppercase;margin-bottom:6px;opacity:0.9}
.section-title{font-size:clamp(1.8rem,3.5vw,2.5rem);font-weight:800;letter-spacing:-0.03em;line-height:1.04}
.section-count{font-family:'Syne',sans-serif;font-size:0.77rem;color:var(--muted2);background:var(--bg3);border:1px solid var(--border);padding:4px 14px;border-radius:999px;white-space:nowrap;align-self:flex-start;margin-top:6px}
.sub-label{font-size:0.67rem;letter-spacing:0.16em;font-weight:700;color:var(--accent);text-transform:uppercase;margin-bottom:14px;opacity:0.9}

/* ── ABOUT */
.about-layout{display:grid;grid-template-columns:1fr 320px;gap:56px;align-items:start}
@media(max-width:900px){.about-layout{grid-template-columns:1fr;gap:36px}}
.about-body p{font-size:0.94rem;color:var(--muted2);line-height:1.92;margin-bottom:20px;font-weight:400}
.about-body p strong{color:var(--text);font-weight:600}
.about-body p:last-of-type{margin-bottom:0}
.strength-pills{display:flex;flex-wrap:wrap;gap:8px;margin-top:28px}
.s-pill{padding:7px 16px;border-radius:999px;font-size:0.76rem;font-weight:600;font-family:'Syne',sans-serif;border:1px solid var(--border2);color:var(--muted2);background:var(--bg3);letter-spacing:0.02em;transition:all .2s;cursor:default}
.s-pill:hover{color:var(--text);border-color:rgba(0,0,0,0.2)}
.s-pill.hi{border-color:rgba(14,165,233,0.3);color:var(--accent);background:rgba(14,165,233,0.07)}
.about-cards{display:flex;flex-direction:column;gap:10px}
.a-card{background:var(--bg2);border:1px solid var(--border);border-radius:14px;padding:20px;transition:border-color .25s,transform .28s cubic-bezier(0.16,1,0.3,1),box-shadow .28s;position:relative;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.05)}
.a-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,var(--accent),var(--accent2));opacity:0.6}
.a-card:hover{border-color:var(--border2);transform:translateY(-2px);box-shadow:0 8px 28px rgba(0,0,0,0.09)}
.a-card-icon{font-size:1.3rem;margin-bottom:8px;line-height:1}
.a-card-title{font-family:'Syne',sans-serif;font-size:0.82rem;font-weight:700;color:var(--text);margin-bottom:4px;letter-spacing:-0.01em}
.a-card-sub{font-size:0.76rem;color:var(--muted2);line-height:1.55}

/* ── Project filter */
.proj-filter{display:flex;gap:7px;flex-wrap:wrap;margin-bottom:28px}
.proj-filter-btn{padding:6px 16px;border-radius:999px;font-size:0.72rem;font-weight:600;font-family:'Syne',sans-serif;border:1px solid var(--border2);background:var(--bg2);color:var(--muted2);cursor:pointer;transition:all .2s;letter-spacing:0.03em}
.proj-filter-btn:hover{color:var(--text);border-color:rgba(0,0,0,0.2)}
.proj-filter-btn.active{background:rgba(14,165,233,0.09);color:var(--accent);border-color:rgba(14,165,233,0.3)}

/* ── Projects grid */
.projects-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px}
@media(max-width:820px){.projects-grid{grid-template-columns:1fr}}

/* ── Regular card */
.proj-card{background:var(--bg2);border:1px solid var(--border);padding:26px;cursor:pointer;transition:transform .32s cubic-bezier(0.16,1,0.3,1),border-color .32s,box-shadow .32s;position:relative;border-radius:var(--card-r);overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.05)}
.proj-card::after{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(14,165,233,0.03),rgba(99,102,241,0.02));opacity:0;transition:opacity .32s;pointer-events:none}
.proj-card:hover{border-color:var(--border2);transform:translateY(-4px);box-shadow:0 20px 56px rgba(0,0,0,0.12)}
.proj-card:hover::after{opacity:1}

/* ── Featured card */
.proj-card.is-featured{grid-column:1/-1;display:grid;grid-template-columns:1fr 220px;padding:0;min-height:230px}
.feat-main{padding:34px 38px;display:flex;flex-direction:column;justify-content:center}
.feat-side{position:relative;border-left:1px solid var(--border);overflow:hidden;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,var(--bg3) 0%,var(--bg4) 100%)}
.feat-side::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(14,165,233,0.05),rgba(99,102,241,0.06))}
.feat-side-inner{position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;gap:8px;padding:20px;opacity:0.3}
.feat-side-inner span{display:block;height:2px;border-radius:2px;background:linear-gradient(90deg,var(--accent),var(--accent2))}
.proj-card.is-featured:hover{transform:translateY(-4px);box-shadow:0 22px 62px rgba(0,0,0,0.13)}
@media(max-width:820px){
  .proj-card.is-featured{grid-column:1;grid-template-columns:1fr}
  .feat-main{padding:26px}
  .feat-side{display:none}
}

/* Card content */
.proj-card-inner{display:flex;align-items:flex-start;justify-content:space-between;gap:14px}
.proj-card-left{flex:1;min-width:0}
.proj-card-top{display:flex;align-items:center;gap:8px;margin-bottom:12px;flex-wrap:wrap}
.proj-cat{font-size:0.65rem;padding:3px 10px;border-radius:999px;font-weight:700;font-family:'Syne',sans-serif;letter-spacing:0.06em;text-transform:uppercase}
.featured-pip{display:inline-flex;align-items:center;gap:5px;font-size:0.63rem;font-weight:700;color:var(--accent);font-family:'Syne',sans-serif;letter-spacing:0.07em;text-transform:uppercase;opacity:0.9}
.featured-pip::before{content:'';width:5px;height:5px;border-radius:50%;background:var(--accent);box-shadow:0 0 7px rgba(14,165,233,0.5)}
.proj-title{font-family:'Syne',sans-serif;font-size:1rem;font-weight:700;color:var(--text);margin-bottom:9px;line-height:1.3;letter-spacing:-0.015em}
.proj-card.is-featured .proj-title{font-size:1.18rem;margin-bottom:11px}
.proj-short{font-size:0.82rem;color:var(--muted2);line-height:1.72;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.proj-card.is-featured .proj-short{-webkit-line-clamp:3}
.proj-tags-mini{display:flex;flex-wrap:wrap;gap:5px;margin-top:14px}
.proj-tag{padding:3px 9px;border-radius:6px;font-size:0.66rem;font-weight:500;background:var(--bg3);border:1px solid var(--border);color:var(--muted2)}
.proj-arrow{color:var(--border2);transition:all .32s;flex-shrink:0;margin-top:2px}
.proj-card:hover .proj-arrow{color:var(--accent);transform:translate(4px,-2px)}
.feat-view-link{display:inline-flex;align-items:center;gap:6px;margin-top:20px;color:var(--accent);font-size:0.8rem;font-weight:600;font-family:'Syne',sans-serif;letter-spacing:0.03em}

/* ── Cat colors */
.cat-saas{background:rgba(14,165,233,0.1);color:#0369a1}
.cat-aiml{background:rgba(99,102,241,0.1);color:#4338ca}
.cat-agents{background:rgba(217,119,6,0.1);color:#b45309}
.cat-rag{background:rgba(14,165,233,0.1);color:#0284c7}
.cat-cv{background:rgba(236,72,153,0.1);color:#be185d}
.cat-mlops{background:rgba(234,88,12,0.1);color:#c2410c}
.cat-gamedev{background:rgba(139,92,246,0.1);color:#7c3aed}
.cat-other{background:var(--bg3);color:var(--muted2)}

/* ── Modal */
.modal-overlay{position:fixed;inset:0;z-index:500;background:rgba(13,15,30,0.62);backdrop-filter:blur(22px);-webkit-backdrop-filter:blur(22px);display:flex;align-items:center;justify-content:center;padding:16px;animation:fadeIn .18s ease}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
.modal-box{background:var(--bg2);border:1px solid var(--border2);border-radius:20px;width:100%;max-width:760px;max-height:90vh;overflow-y:auto;animation:slideUp .22s cubic-bezier(0.16,1,0.3,1);box-shadow:0 32px 80px rgba(0,0,0,0.15)}
@keyframes slideUp{from{transform:translateY(28px);opacity:0}to{transform:translateY(0);opacity:1}}
.modal-media{width:100%;aspect-ratio:16/9;background:var(--bg3);position:relative;overflow:hidden;border-radius:20px 20px 0 0}
.modal-media img{width:100%;height:100%;object-fit:cover}
.modal-media video{width:100%;height:100%;object-fit:cover}
.modal-media-empty{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;color:var(--muted);font-size:0.85rem}
.modal-media-empty svg{opacity:0.18}
.modal-badge-row{position:absolute;top:14px;left:14px;display:flex;gap:8px}
.modal-badge{padding:5px 12px;border-radius:7px;font-size:0.66rem;font-weight:700;font-family:'Syne',sans-serif;letter-spacing:0.06em;text-transform:uppercase;backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,0.15);background:rgba(0,0,0,0.6)}
.modal-close{position:absolute;top:12px;right:12px;width:34px;height:34px;border-radius:9px;background:rgba(0,0,0,0.6);backdrop-filter:blur(14px);border:1px solid rgba(255,255,255,0.15);color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s;font-size:1.1rem;line-height:1}
.modal-close:hover{background:var(--danger);border-color:var(--danger)}
.modal-body{padding:30px 32px 34px}
@media(max-width:480px){.modal-body{padding:20px 18px 26px}}
.modal-title{font-family:'Syne',sans-serif;font-size:1.45rem;font-weight:800;color:var(--text);margin-bottom:12px;line-height:1.2;letter-spacing:-0.025em}
.modal-desc{font-size:0.875rem;color:var(--muted2);line-height:1.9;margin-bottom:24px;font-weight:400}
.modal-links{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:24px}
.modal-link-btn{display:inline-flex;align-items:center;gap:8px;padding:10px 20px;border-radius:9px;font-size:0.82rem;font-weight:600;font-family:'Syne',sans-serif;text-decoration:none;transition:all .2s;border:1px solid var(--border2);background:var(--bg3);color:var(--text)}
.modal-link-btn:hover{border-color:var(--border3);transform:translateY(-1px)}
.modal-link-btn.primary{background:linear-gradient(135deg,var(--accent),var(--accent2));color:#fff;border-color:transparent}
.modal-link-btn.primary:hover{opacity:0.88;transform:translateY(-1px)}
.modal-tags-label{font-size:0.66rem;letter-spacing:0.13em;font-weight:700;color:var(--muted);text-transform:uppercase;margin-bottom:10px}
.modal-tags{display:flex;flex-wrap:wrap;gap:7px}
.modal-tag{padding:5px 13px;border-radius:7px;font-size:0.73rem;font-weight:500;background:var(--bg3);border:1px solid var(--border);color:var(--muted2)}

/* ── Skills */
.skills-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:12px}
@media(max-width:480px){.skills-grid{grid-template-columns:1fr 1fr;gap:10px}}
.skill-cat{background:var(--bg2);border:1px solid var(--border);border-radius:14px;padding:22px;transition:border-color .28s,transform .3s cubic-bezier(0.16,1,0.3,1),box-shadow .3s;box-shadow:0 2px 12px rgba(0,0,0,0.04)}
.skill-cat:hover{border-color:var(--border2);transform:translateY(-2px);box-shadow:0 8px 28px rgba(0,0,0,0.09)}
.skill-cat-title{font-family:'Syne',sans-serif;font-size:0.67rem;font-weight:700;color:var(--accent);letter-spacing:0.14em;text-transform:uppercase;margin-bottom:14px}
.skill-chips{display:flex;flex-wrap:wrap;gap:7px}
.skill-chip{padding:5px 12px;border-radius:7px;font-size:0.72rem;font-weight:500;background:var(--bg3);border:1px solid var(--border);color:var(--muted2);transition:all .2s;cursor:default}
.skill-chip:hover{color:var(--text);border-color:var(--border2);background:var(--bg4)}

/* ── Experience Timeline */
.tl-wrap{position:relative;padding-left:56px}
.tl-wrap::before{content:'';position:absolute;left:18px;top:10px;bottom:10px;width:1px;background:linear-gradient(to bottom,var(--accent),rgba(14,165,233,0.05))}
.tl-item{position:relative;margin-bottom:28px}
.tl-item:last-child{margin-bottom:0}
.tl-dot{position:absolute;left:-46px;top:6px;width:36px;height:36px;border-radius:50%;background:var(--bg2);border:1.5px solid var(--border2);display:flex;align-items:center;justify-content:center;color:var(--muted2);transition:border-color .25s,color .25s,box-shadow .25s;box-shadow:0 2px 8px rgba(0,0,0,0.08)}
.tl-item:hover .tl-dot{border-color:var(--accent);color:var(--accent);box-shadow:0 0 14px rgba(14,165,233,0.25)}
.tl-card{background:var(--bg2);border:1px solid var(--border);border-radius:var(--card-r);padding:24px 28px;transition:border-color .28s,transform .3s cubic-bezier(0.16,1,0.3,1),box-shadow .3s;box-shadow:0 2px 12px rgba(0,0,0,0.04)}
.tl-item:hover .tl-card{border-color:var(--border2);transform:translateX(4px);box-shadow:0 8px 28px rgba(0,0,0,0.09)}
.tl-company-badge{display:inline-flex;align-items:center;gap:7px;padding:3px 12px;border-radius:999px;font-size:0.65rem;font-weight:700;font-family:'Syne',sans-serif;letter-spacing:0.05em;text-transform:uppercase;border:1px solid var(--border2);color:var(--muted2);background:var(--bg3);margin-bottom:12px}
.tl-role{font-family:'Syne',sans-serif;font-size:1rem;font-weight:700;color:var(--text);line-height:1.3;letter-spacing:-0.015em;margin-bottom:5px}
.tl-period{font-size:0.73rem;color:var(--accent);font-weight:600;font-family:'Syne',sans-serif;letter-spacing:0.03em;opacity:0.9}
.tl-bullets{list-style:none;margin-top:16px;display:flex;flex-direction:column;gap:9px}
.tl-bullets li{font-size:0.82rem;color:var(--muted2);line-height:1.74;padding-left:16px;position:relative}
.tl-bullets li::before{content:'';position:absolute;left:0;top:9px;width:5px;height:5px;border-radius:50%;background:var(--accent);opacity:0.6}
@media(max-width:600px){.tl-wrap{padding-left:0}.tl-wrap::before,.tl-dot{display:none}}

/* ── Education */
.edu-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:12px;margin-bottom:28px}
.edu-card{background:var(--bg2);border:1px solid var(--border);border-radius:14px;padding:22px;transition:border-color .25s,transform .28s cubic-bezier(0.16,1,0.3,1),box-shadow .28s;box-shadow:0 2px 12px rgba(0,0,0,0.04)}
.edu-card:hover{border-color:var(--border2);transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,0.09)}
.edu-degree{font-family:'Syne',sans-serif;font-size:0.92rem;font-weight:700;color:var(--text);margin-bottom:5px;letter-spacing:-0.01em}
.edu-inst{font-size:0.8rem;color:var(--muted2);margin-bottom:6px}
.edu-period{font-size:0.72rem;color:var(--accent);font-weight:600;font-family:'Syne',sans-serif;opacity:0.9}
.lang-row{display:flex;flex-wrap:wrap;gap:8px;margin-top:24px}
.lang-chip{padding:7px 16px;border-radius:999px;background:var(--bg2);border:1px solid var(--border2);font-size:0.78rem;color:var(--muted2);font-weight:400;display:inline-flex;align-items:center;gap:6px;box-shadow:0 1px 4px rgba(0,0,0,0.05)}
.lang-chip strong{color:var(--text);font-family:'Syne',sans-serif;font-size:0.77rem;font-weight:700}

/* ── Contact */
.contact-row{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px}
@media(max-width:480px){.contact-row{grid-template-columns:1fr}}
.contact-card{background:var(--bg2);border:1px solid var(--border);border-radius:14px;padding:22px;display:flex;align-items:center;gap:16px;text-decoration:none;color:var(--text);transition:all .3s cubic-bezier(0.16,1,0.3,1);box-shadow:0 2px 12px rgba(0,0,0,0.05)}
.contact-card:hover{border-color:var(--border2);background:var(--bg3);transform:translateY(-3px);box-shadow:0 14px 42px rgba(0,0,0,0.1)}
.contact-icon{width:44px;height:44px;border-radius:11px;background:var(--bg3);border:1px solid var(--border2);display:flex;align-items:center;justify-content:center;color:var(--accent);flex-shrink:0;transition:all .25s}
.contact-card:hover .contact-icon{background:rgba(14,165,233,0.1);border-color:rgba(14,165,233,0.28)}
.contact-label{font-size:0.67rem;color:var(--muted2);margin-bottom:3px;letter-spacing:0.05em;text-transform:uppercase;font-weight:600}
.contact-value{font-weight:600;font-size:0.85rem;font-family:'Syne',sans-serif;letter-spacing:-0.01em}
.contact-cta{margin-top:36px;padding:28px 32px;background:var(--bg2);border:1px solid var(--border);border-radius:18px;display:flex;align-items:center;justify-content:space-between;gap:24px;flex-wrap:wrap;box-shadow:0 2px 12px rgba(0,0,0,0.05)}
.contact-cta-text h3{font-family:'Syne',sans-serif;font-size:1.1rem;font-weight:700;color:var(--text);margin-bottom:5px;letter-spacing:-0.02em}
.contact-cta-text p{font-size:0.85rem;color:var(--muted2);line-height:1.6}
@media(max-width:600px){.contact-cta{flex-direction:column;text-align:center;align-items:center}}

/* ── Footer */
footer{border-top:1px solid var(--border);padding:32px 0;margin-top:48px}
.footer-inner{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px}
.footer-copy{color:var(--muted);font-size:0.78rem}
.footer-links{display:flex;gap:20px}
.footer-links a{color:var(--muted);font-size:0.78rem;text-decoration:none;transition:color .2s}
.footer-links a:hover{color:var(--accent)}

/* ── Admin */
.admin-overlay{position:fixed;inset:0;z-index:1000;background:rgba(13,15,30,0.55);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);display:flex;align-items:center;justify-content:center;padding:16px}
.admin-panel{background:var(--bg2);border:1px solid var(--border2);border-radius:20px;width:100%;max-width:840px;max-height:92vh;overflow-y:auto;padding:32px;position:relative;box-shadow:0 32px 96px rgba(0,0,0,0.14)}
@media(max-width:600px){.admin-panel{padding:20px 16px;border-radius:18px}}
.admin-panel h2{font-size:1.4rem;font-weight:800;margin-bottom:24px;display:flex;align-items:center;gap:10px;letter-spacing:-0.02em}
.admin-dot{width:9px;height:9px;border-radius:50%;background:var(--accent);display:inline-block;animation:dot-pulse 2s infinite;box-shadow:0 0 8px var(--accent)}
.admin-tabs{display:flex;gap:6px;margin-bottom:24px;flex-wrap:wrap}
.admin-tab{padding:7px 18px;border-radius:9px;font-size:0.8rem;font-weight:600;background:var(--bg3);border:1px solid var(--border);color:var(--muted2);cursor:pointer;transition:all .2s;font-family:'Syne',sans-serif}
.admin-tab.active{background:var(--accent);color:#fff;border-color:var(--accent)}
.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
@media(max-width:600px){.form-grid{grid-template-columns:1fr}}
.form-full{grid-column:1/-1}
.field{display:flex;flex-direction:column;gap:6px}
.field label{font-size:0.68rem;font-weight:700;color:var(--muted2);letter-spacing:0.08em;text-transform:uppercase}
.field input,.field textarea,.field select{background:var(--bg3);border:1px solid var(--border2);border-radius:9px;padding:10px 14px;color:var(--text);font-size:0.875rem;font-family:'Inter',sans-serif;outline:none;transition:border-color .2s;width:100%}
.field input:focus,.field textarea:focus,.field select:focus{border-color:var(--accent)}
.field textarea{resize:vertical;min-height:80px}
.media-drop{border:2px dashed var(--border2);border-radius:12px;padding:28px;text-align:center;color:var(--muted2);font-size:0.85rem;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:10px;transition:all .2s;background:var(--bg3)}
.media-drop:hover{border-color:var(--accent);background:rgba(14,165,233,0.05)}
.media-preview{width:100%;border-radius:10px;overflow:hidden;border:1px solid var(--border);margin-top:10px}
.media-preview img,.media-preview video{width:100%;display:block;max-height:200px;object-fit:cover}
.btn-save{width:100%;padding:13px;border-radius:11px;font-size:0.9rem;font-weight:700;background:linear-gradient(135deg,var(--accent),var(--accent2));color:#fff;border:none;cursor:pointer;font-family:'Syne',sans-serif;transition:all .2s;margin-top:20px;letter-spacing:0.01em}
.btn-save:hover{opacity:0.88;transform:translateY(-1px)}
.btn-x{position:absolute;top:18px;right:18px;width:36px;height:36px;border-radius:9px;background:var(--bg3);border:1px solid var(--border);color:var(--muted2);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s;font-size:1.2rem;line-height:1}
.btn-x:hover{background:var(--danger);color:#fff;border-color:var(--danger)}
.proj-list-item{display:flex;align-items:center;gap:12px;padding:12px 14px;background:var(--bg3);border:1px solid var(--border);border-radius:11px;margin-bottom:8px;transition:border-color .2s}
.proj-list-item:hover{border-color:var(--border2)}
.proj-list-thumb{width:50px;height:38px;border-radius:7px;overflow:hidden;flex-shrink:0;background:var(--bg4)}
.proj-list-thumb img,.proj-list-thumb video{width:100%;height:100%;object-fit:cover}
.proj-list-name{flex:1;font-size:0.88rem;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.proj-list-sub{color:var(--muted2);font-size:0.73rem;margin-top:2px}
.btn-edit,.btn-del{padding:6px 13px;border-radius:7px;font-size:0.75rem;font-weight:600;cursor:pointer;transition:all .2s;font-family:'Syne',sans-serif;border:1px solid;flex-shrink:0}
.btn-edit{background:var(--bg3);border-color:var(--border2);color:var(--muted2)}
.btn-edit:hover{border-color:var(--accent);color:var(--accent)}
.btn-del{background:var(--bg3);border-color:var(--border2);color:var(--muted2)}
.btn-del:hover{background:rgba(239,68,68,0.07);border-color:var(--danger);color:var(--danger)}
.tag-input-chip{padding:3px 8px 3px 10px;border-radius:7px;font-size:0.73rem;background:var(--bg4);border:1px solid var(--border2);color:var(--text);display:inline-flex;align-items:center;gap:5px}
.tag-input-chip button{background:none;border:none;color:var(--muted2);cursor:pointer;font-size:0.9rem;padding:0;line-height:1}
.tag-input-chip button:hover{color:var(--danger)}
.tags-bare-input{background:none;border:none;outline:none;color:var(--text);font-size:0.82rem;font-family:'Inter',sans-serif;min-width:80px;padding:4px 0}
.toggle-row{display:flex;align-items:center;gap:12px}
.toggle{position:relative;width:42px;height:24px}
.toggle input{opacity:0;width:0;height:0;position:absolute}
.tog-sl{position:absolute;inset:0;background:var(--bg4);border:1px solid var(--border2);border-radius:999px;cursor:pointer;transition:all .2s}
.tog-sl::before{content:'';position:absolute;width:16px;height:16px;border-radius:50%;background:var(--muted);top:3px;left:3px;transition:all .2s}
.toggle input:checked+.tog-sl{background:rgba(14,165,233,0.14);border-color:var(--accent)}
.toggle input:checked+.tog-sl::before{background:var(--accent);transform:translateX(18px)}
.login-box{background:var(--bg2);border:1px solid var(--border2);border-radius:20px;padding:44px 40px;width:100%;max-width:420px;box-shadow:0 28px 80px rgba(0,0,0,0.14)}
@media(max-width:480px){.login-box{padding:32px 24px}}
.login-box h2{font-size:1.5rem;font-weight:800;margin-bottom:8px;letter-spacing:-0.025em}
.login-box p{color:var(--muted2);font-size:0.875rem;margin-bottom:28px;line-height:1.6}
.login-err{color:var(--danger);font-size:0.82rem;margin-bottom:12px;text-align:center;padding:10px;background:rgba(239,68,68,0.07);border-radius:8px;border:1px solid rgba(239,68,68,0.18)}
.toast{position:fixed;bottom:28px;right:28px;z-index:2000;padding:12px 22px;border-radius:12px;font-size:0.85rem;font-weight:600;background:linear-gradient(135deg,var(--accent),var(--accent2));color:#fff;transform:translateY(100px);opacity:0;transition:all .38s cubic-bezier(.34,1.56,.64,1);font-family:'Syne',sans-serif;box-shadow:0 8px 28px rgba(14,165,233,0.25)}
.toast.show{transform:translateY(0);opacity:1}
@media(max-width:480px){.toast{bottom:16px;right:16px;left:16px;text-align:center}}
`;

// ── SVG Icons
const GithubIcon = ({size=16}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
  </svg>
);
const LinkIcon = ({size=16}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
);
const ArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);
const ArrowUp = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>
  </svg>
);
const UploadIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);
const EmptyMediaIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="10" r="2"/>
    <path d="m21 15-5-5L5 21"/>
  </svg>
);
const PlusIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const MailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);
const LinkedinIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);
const BriefcaseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
  </svg>
);
const GraduationCapIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
  </svg>
);

// ── CAT CONFIG
const CAT_MAP = {
  SaaS:      { label:"SaaS",      cls:"cat-saas" },
  "AI/ML":   { label:"AI/ML",     cls:"cat-aiml" },
  Agents:    { label:"Agents",    cls:"cat-agents" },
  RAG:       { label:"RAG",       cls:"cat-rag" },
  CV:        { label:"CV",        cls:"cat-cv" },
  MLOps:     { label:"MLOps",     cls:"cat-mlops" },
  "Game Dev":{ label:"Game Dev",  cls:"cat-gamedev" },
};

const INITIAL_SKILLS = [
  { category:"Agents & LLMs",  items:["LangGraph","LangChain","RAG","Tool Calling","NeMo Guardrails","LangSmith"] },
  { category:"ML / DL",        items:["PyTorch","TensorFlow","scikit-learn","Transformers","ONNX Runtime","MLflow"] },
  { category:"Backend",        items:["FastAPI","Async Python","SQLAlchemy","Alembic","Pydantic","Casbin RBAC"] },
  { category:"Infra & DB",     items:["PostgreSQL","pgvector","Redis","Docker","MinIO","HashiCorp Vault"] },
  { category:"Frontend",       items:["React","Vite","Tailwind","Streamlit"] },
  { category:"MLOps & CI",     items:["GitHub Actions","Drift Detection","Eval Gates","PSI / chi²"] },
];

const EXPERIENCE = [
  {
    role: "AI Engineering Intern / Bootcamp Graduate",
    company: "SE Factory",
    period: "2026",
    bullets: [
      "Completed intensive AI Engineering bootcamp; shipped 8+ evaluated production systems end-to-end.",
      "Built LangGraph multi-agent pipelines, RAG systems, and ML classifiers with CI eval gates.",
      "Mentored peers on LangChain, FastAPI architecture, and MLOps tooling (MLflow, Drift detection).",
    ],
  },
  {
    role: "Freelance AI & Full-Stack Developer",
    company: "Self-employed",
    period: "2025 – Present",
    bullets: [
      "Delivered Albert — a multi-tenant AI SaaS with Postgres RLS, NeMo Guardrails, and ONNX serving.",
      "Consulted on LLM integration and agentic workflow design for early-stage Lebanese startups.",
      "Implemented RAG pipelines, document classifiers, and REST APIs for client projects.",
    ],
  },
];

const EDUCATION = [
  { degree: "BSc Computer Science", institution: "Lebanese International University", period: "Expected June 2026" },
  { degree: "AI Engineering Bootcamp", institution: "SE Factory", period: "2025" },
];

const LANGUAGES = [
  { lang: "English", level: "IELTS 5.5" },
  { lang: "Arabic",  level: "Native" },
  { lang: "French",  level: "French-educated" },
];

const TYPING_PHRASES = [
  "Multi-Agent Systems Builder",
  "RAG & LLM Specialist",
  "MLOps Engineer",
  "LangGraph Architect",
  "Full-Stack AI Developer",
];

const ABOUT_CARDS = [
  { icon:"⚡", title:"Eval-Driven Development", sub:"CI eval gates, LangSmith traces, and measurable benchmarks — every system is tested before it ships." },
  { icon:"🚀", title:"Production-Ready Systems", sub:"Containerized, monitored, and deployed. I build for production, not just notebooks." },
  { icon:"🔗", title:"End-to-End Ownership", sub:"From data collection and model training to API design and frontend integration." },
];

// ── HOOKS
function useTypingEffect(phrases) {
  const [text, setText] = useState("");
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const current = phrases[idx % phrases.length];
    if (paused) {
      const t = setTimeout(() => { setPaused(false); setDir(-1); }, 1800);
      return () => clearTimeout(t);
    }
    if (dir === 1) {
      if (text.length < current.length) {
        const t = setTimeout(() => setText(current.slice(0, text.length + 1)), 68);
        return () => clearTimeout(t);
      } else { setPaused(true); }
    } else {
      if (text.length > 0) {
        const t = setTimeout(() => setText(text.slice(0, -1)), 36);
        return () => clearTimeout(t);
      } else { setDir(1); setIdx(i => i + 1); }
    }
  }, [text, dir, paused, idx, phrases]);
  return text;
}

function useCounter(target, duration, active) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active || !target) return;
    const start = performance.now();
    const step = now => {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(ease * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [active, target, duration]);
  return val;
}

// ── TAG INPUT
function TagInput({ value, onChange }) {
  const [inp, setInp] = useState("");
  const add = (e) => {
    if ((e.key === "Enter" || e.key === ",") && inp.trim()) {
      e.preventDefault();
      if (!value.includes(inp.trim())) onChange([...value, inp.trim()]);
      setInp("");
    }
  };
  return (
    <div className="field form-full">
      <label>Tech Stack (Enter to add)</label>
      <div style={{background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:8,padding:"8px 12px",display:"flex",flexWrap:"wrap",gap:6,cursor:"text"}}
           onClick={e=>e.currentTarget.querySelector("input").focus()}>
        {value.map(t=>(
          <span key={t} className="tag-input-chip">
            {t}<button type="button" onClick={()=>onChange(value.filter(x=>x!==t))}>×</button>
          </span>
        ))}
        <input className="tags-bare-input" value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={add} placeholder={!value.length?"e.g. FastAPI…":""}/>
      </div>
    </div>
  );
}

// ── MEDIA UPLOAD
function MediaUpload({ mediaType, mediaSrc, onChange }) {
  const fileRef = useRef();
  const [urlVal, setUrlVal] = useState("");
  const handleFile = e => {
    const f = e.target.files[0]; if(!f) return;
    const t = f.type.startsWith("video/") ? "video" : "image";
    const r = new FileReader();
    r.onload = ev => onChange(t, ev.target.result);
    r.readAsDataURL(f);
  };
  const handleUrl = () => {
    if(!urlVal.trim()) return;
    const t = /\.(mp4|webm|ogg)/i.test(urlVal) ? "video" : "image";
    onChange(t, urlVal); setUrlVal("");
  };
  if (mediaSrc) return (
    <div className="field form-full">
      <label>Media</label>
      <div className="media-preview">
        {mediaType==="video" ? <video src={mediaSrc} controls muted/> : <img src={mediaSrc} alt="preview"/>}
      </div>
      <button type="button" onClick={()=>onChange("none","")}
        style={{marginTop:8,padding:"5px 14px",borderRadius:6,background:"rgba(248,113,113,0.08)",border:"1px solid var(--danger)",color:"var(--danger)",cursor:"pointer",fontSize:"0.78rem",fontFamily:"Syne,sans-serif",fontWeight:600}}>
        Remove media
      </button>
    </div>
  );
  return (
    <div className="field form-full">
      <label>Screenshot / Demo Video</label>
      <div className="media-drop" onClick={()=>fileRef.current.click()}>
        <UploadIcon/><div>Click to upload image or video</div>
        <div style={{fontSize:"0.74rem",opacity:.6}}>PNG, JPG, GIF, MP4 — or paste a URL below</div>
      </div>
      <input ref={fileRef} type="file" accept="image/*,video/*" style={{display:"none"}} onChange={handleFile}/>
      <div style={{display:"flex",gap:8,marginTop:8}}>
        <input style={{flex:1,background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:8,padding:"8px 12px",color:"var(--text)",fontSize:"0.82rem",fontFamily:"Inter,sans-serif",outline:"none"}}
          placeholder="Or paste image/video URL…" value={urlVal} onChange={e=>setUrlVal(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleUrl()}/>
        <button type="button" onClick={handleUrl}
          style={{padding:"8px 16px",borderRadius:8,background:"var(--bg3)",border:"1px solid var(--border2)",color:"var(--text)",cursor:"pointer",fontSize:"0.82rem",fontFamily:"Syne,sans-serif",fontWeight:600}}>
          Add
        </button>
      </div>
    </div>
  );
}

// ── PROJECT FORM
function ProjectForm({ project, onSave, onCancel }) {
  const blank = {id:Date.now(),title:"",short:"",full:"",tags:[],cat:"SaaS",github:"",live:"",mediaType:"none",mediaSrc:"",featured:false};
  const [f, setF] = useState(project || blank);
  const set = (k,v) => setF(p=>({...p,[k]:v}));
  const isOther = !Object.keys(CAT_MAP).includes(f.cat);
  return (
    <form onSubmit={e=>{e.preventDefault();if(f.title.trim())onSave(f);}}>
      <div className="form-grid">
        <div className="field form-full">
          <label>Title *</label>
          <input value={f.title} onChange={e=>set("title",e.target.value)} placeholder="Project name" required/>
        </div>
        <div className="field">
          <label>Category</label>
          <select value={isOther ? "Other" : f.cat} onChange={e=>{if(e.target.value==="Other")set("cat","");else set("cat",e.target.value);}} style={{background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:8,padding:"10px 14px",color:"var(--text)",fontSize:"0.875rem",fontFamily:"Inter,sans-serif",outline:"none"}}>
            {Object.keys(CAT_MAP).map(c=><option key={c} value={c}>{c}</option>)}
            <option value="Other">Other…</option>
          </select>
          {isOther && (
            <input value={f.cat} onChange={e=>set("cat",e.target.value)} placeholder="Type custom category…"
              style={{marginTop:8,background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:8,padding:"10px 14px",color:"var(--text)",fontSize:"0.875rem",fontFamily:"Inter,sans-serif",outline:"none",width:"100%"}}/>
          )}
        </div>
        <div className="field">
          <label>GitHub URL</label>
          <input value={f.github} onChange={e=>set("github",e.target.value)} placeholder="https://github.com/…"/>
        </div>
        <div className="field form-full">
          <label>Live Demo URL</label>
          <input value={f.live} onChange={e=>set("live",e.target.value)} placeholder="https://…"/>
        </div>
        <div className="field form-full">
          <label>Short description (card preview)</label>
          <textarea value={f.short} onChange={e=>set("short",e.target.value)} placeholder="2–3 sentence teaser shown on the card…" rows={2}/>
        </div>
        <div className="field form-full">
          <label>Full description (modal detail)</label>
          <textarea value={f.full} onChange={e=>set("full",e.target.value)} placeholder="Full explanation shown when someone clicks the project…" rows={4}/>
        </div>
        <TagInput value={f.tags} onChange={v=>set("tags",v)}/>
        <MediaUpload mediaType={f.mediaType} mediaSrc={f.mediaSrc} onChange={(t,s)=>{set("mediaType",t);set("mediaSrc",s);}}/>
        <div className="toggle-row form-full" style={{marginTop:4}}>
          <label className="toggle">
            <input type="checkbox" checked={f.featured} onChange={e=>set("featured",e.target.checked)}/>
            <span className="tog-sl"/>
          </label>
          <span style={{fontSize:"0.875rem",color:"var(--muted2)"}}>Mark as Featured</span>
        </div>
      </div>
      <div style={{display:"flex",gap:10,marginTop:20}}>
        <button type="submit" className="btn-save" style={{margin:0,flex:1}}>Save Project</button>
        <button type="button" onClick={onCancel}
          style={{padding:"13px 24px",borderRadius:10,background:"var(--bg3)",border:"1px solid var(--border)",color:"var(--muted2)",cursor:"pointer",fontSize:"0.9rem",fontFamily:"Syne,sans-serif",fontWeight:600}}>
          Cancel
        </button>
      </div>
    </form>
  );
}

// ── PROJECT MODAL
function ProjectModal({ project, onClose }) {
  useEffect(() => {
    const esc = e => e.key==="Escape" && onClose();
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [onClose]);
  const cat = CAT_MAP[project.cat] || {label:project.cat, cls:"cat-other"};
  return (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal-box">
        <div className="modal-media">
          {project.mediaType==="image" && project.mediaSrc
            ? <img src={project.mediaSrc} alt={project.title}/>
            : project.mediaType==="video" && project.mediaSrc
            ? <video src={project.mediaSrc} controls muted playsInline autoPlay/>
            : <div className="modal-media-empty"><EmptyMediaIcon/><span>No preview added yet</span></div>}
          <div className="modal-badge-row">
            <span className={`proj-cat modal-badge ${cat.cls}`}>{cat.label}</span>
            {project.featured && <span className="modal-badge" style={{color:"var(--accent)"}}>Featured</span>}
          </div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="modal-title">{project.title}</div>
          <p className="modal-desc">{project.full || project.short}</p>
          {(project.github || project.live) && (
            <div className="modal-links">
              {project.github && (
                <a href={project.github} target="_blank" rel="noreferrer" className="modal-link-btn">
                  <GithubIcon/> GitHub Repo
                </a>
              )}
              {project.live && (
                <a href={project.live} target="_blank" rel="noreferrer" className="modal-link-btn primary">
                  <LinkIcon/> Live Demo
                </a>
              )}
            </div>
          )}
          <div className="modal-tags-label">Stack</div>
          <div className="modal-tags">
            {project.tags.map(t=><span key={t} className="modal-tag">{t}</span>)}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── MAIN APP
export default function App() {
  const [projects, setProjects]   = useState([]);
  const [skills,   setSkills]     = useState(INITIAL_SKILLS);
  const [bio, setBio] = useState({
    name:"Ali Hamad", title:"AI & Software Engineer",
    email:"alimufidhamad0000@gmail.com",
    github:"https://github.com/ali-hamad0",
    linkedin:"https://linkedin.com/in/ali-hamad0",
    cvUrl:"#", portrait:"",
  });
  const [selected,    setSelected]    = useState(null);
  const [adminOpen,   setAdminOpen]   = useState(false);
  const [loggedIn,    setLoggedIn]    = useState(false);
  useEffect(() => { api.clearToken(); }, []);
  const [pwd,         setPwd]         = useState("");
  const [loginErr,    setLoginErr]    = useState("");
  const [adminTab,    setAdminTab]    = useState("projects");
  const [editingProj, setEditingProj] = useState(null);
  const [addingProj,  setAddingProj]  = useState(false);
  const [toast,       setToast]       = useState({show:false,msg:""});
  const [mobileMenu,  setMobileMenu]  = useState(false);
  const [filterCat,   setFilterCat]   = useState("All");
  const [navScrolled, setNavScrolled] = useState(false);
  const [scrollPct,   setScrollPct]   = useState(0);
  const [showBackTop, setShowBackTop] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [statsVisible,  setStatsVisible]  = useState(false);
  const statsRef = useRef(null);
  const typedText = useTypingEffect(TYPING_PHRASES);

  const showToast = msg => { setToast({show:true,msg}); setTimeout(()=>setToast({show:false,msg:""}),2600); };

  useEffect(() => {
    api.getProjects().then(d => { if(Array.isArray(d)) setProjects(d); }).catch(()=>{});
    api.getSkills().then(d => { if(Array.isArray(d)) setSkills(d); }).catch(()=>{});
    api.getBio().then(d => { if(d?.name) setBio({...d, cvUrl: d.cv_url||"#"}); }).catch(()=>{});
  }, []);

  // Combined scroll listener
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const pct = (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100;
      setScrollPct(pct || 0);
      setNavScrolled(window.scrollY > 24);
      setShowBackTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Stats counter trigger
  useEffect(() => {
    if (!statsRef.current) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setStatsVisible(true); io.disconnect(); } },
      { threshold: 0.4 }
    );
    io.observe(statsRef.current);
    return () => io.disconnect();
  }, [projects.length]);

  // Active section tracking
  useEffect(() => {
    const ids = ["about","projects","experience","skills","contact"];
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if(e.isIntersecting) setActiveSection(e.target.id); }),
      { rootMargin: "-40% 0px -55% 0px" }
    );
    ids.forEach(id => { const el = document.getElementById(id); if(el) io.observe(el); });
    return () => io.disconnect();
  }, []);

  // Scroll reveal
  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }
      }),
      { threshold: 0.07, rootMargin: "0px 0px -48px 0px" }
    );
    document.querySelectorAll(".reveal").forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [projects.length, skills.length]);

  const login = async () => {
    try { await api.login(pwd); setLoggedIn(true); setLoginErr(""); setPwd(""); }
    catch { setLoginErr("Incorrect password."); }
  };

  const saveProject = async p => {
    try {
      const isBackendId = p.id && Number.isInteger(p.id) && p.id < 1_000_000_000_000;
      if(isBackendId) await api.updateProject(p.id, p);
      else await api.createProject(p);
      const updated = await api.getProjects();
      if(Array.isArray(updated)) setProjects(updated);
      setEditingProj(null); setAddingProj(false); showToast("Project saved ✓");
    } catch { showToast("Error saving project"); }
  };

  const delProject = async id => {
    try { await api.deleteProject(id); setProjects(ps=>ps.filter(p=>p.id!==id)); showToast("Deleted"); }
    catch { showToast("Error deleting project"); }
  };

  const saveBio = async () => {
    try {
      const payload = { name:bio.name, title:bio.title, email:bio.email, github:bio.github, linkedin:bio.linkedin, cv_url:bio.cvUrl||"" };
      const data = await api.saveBio(payload);
      setBio({...data, cvUrl: data.cv_url||"#"}); showToast("Bio saved ✓");
    } catch { showToast("Error saving bio"); }
  };

  const saveSkills = async () => {
    try { await api.saveSkills(skills); showToast("Skills saved ✓"); }
    catch { showToast("Error saving skills"); }
  };

  const handlePortraitUpload = async (file) => {
    try { const data = await api.uploadPortrait(file); setBio(b=>({...b, portrait: data.portrait||""})); showToast("Portrait uploaded ✓"); }
    catch { showToast("Error uploading portrait"); }
  };

  const handlePortraitRemove = async () => {
    try { const data = await api.removePortrait(); setBio(b=>({...b, portrait: data.portrait||""})); showToast("Portrait removed"); }
    catch { showToast("Error removing portrait"); }
  };

  const cats = ["All", ...Array.from(new Set(projects.map(p=>p.cat)))];
  const filteredProjects = filterCat==="All" ? projects : projects.filter(p=>p.cat===filterCat);
  const techCount = skills.reduce((acc,s)=>acc+s.items.length, 0);

  const projCount  = useCounter(projects.length, 1200, statsVisible);
  const techCnt    = useCounter(techCount, 1200, statsVisible);

  const FEAT_BARS = [72,48,90,55,38,82,60,44,96,52,70,36];

  return (
    <>
      <style>{FONT_STYLE}</style>

      {/* Scroll progress */}
      <div className="scroll-prog" style={{width:`${scrollPct}%`}}/>

      <div className="orb orb1"/><div className="orb orb2"/><div className="orb orb3"/>

      {/* ── NAV */}
      <nav className={navScrolled?"scrolled":""}>
        <div className="nav-inner">
          <a href="#" className="nav-logo">
            <div className="logo-mark">AH</div>Ali Hamad
          </a>
          <div className={`nav-links${mobileMenu?" open":""}`} onClick={()=>setMobileMenu(false)}>
            <a href="#about"      className={activeSection==="about"?"active":""}>About</a>
            <a href="#projects"   className={activeSection==="projects"?"active":""}>Projects</a>
            <a href="#experience" className={activeSection==="experience"?"active":""}>Experience</a>
            <a href="#skills"     className={activeSection==="skills"?"active":""}>Skills</a>
            <a href="#contact"    className={activeSection==="contact"?"active":""}>Contact</a>
            <button className="btn-admin" onClick={e=>{e.stopPropagation();setAdminOpen(true);setMobileMenu(false);}}>
              ⚙ Admin
            </button>
          </div>
          <button className="nav-mobile-menu" onClick={()=>setMobileMenu(m=>!m)} aria-label="Menu">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {mobileMenu
                ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>}
            </svg>
          </button>
        </div>
      </nav>

      <div className="site-wrap">

        {/* ── HERO */}
        <section className="hero">
          <div className="hero-inner">
            <div className="hero-text">
              <div className="hero-tag reveal">Available for opportunities</div>
              <h1 className="reveal rd1">AI & Software<br/><span className="grad">Engineer</span></h1>
              <div className="hero-typing reveal rd2">
                <span className="typing-text">{typedText}</span>
                <span className="typing-cursor">|</span>
              </div>
              <p className="hero-sub reveal rd2">
                Building production-grade intelligent systems — agentic pipelines,
                fine-tuned models, RAG, and MLOps. <strong style={{color:"var(--text)",fontWeight:600}}>Every decision backed by a number.</strong>
              </p>
              <div className="hero-actions reveal rd3">
                <a href="#projects" className="btn-primary"><ArrowRight/> View Projects</a>
                <a href={bio.github}   target="_blank" rel="noreferrer" className="btn-outline"><GithubIcon/> GitHub</a>
                <a href={bio.linkedin} target="_blank" rel="noreferrer" className="btn-outline"><LinkedinIcon/> LinkedIn</a>
                <a href={bio.cvUrl} className="btn-outline">Download CV</a>
              </div>
              <div className="hero-stats reveal rd4" ref={statsRef}>
                <div>
                  <div className="hero-stat-num">{statsVisible ? projCount : "—"}</div>
                  <div className="hero-stat-label">Projects Built</div>
                </div>
                <div>
                  <div className="hero-stat-num">3+</div>
                  <div className="hero-stat-label">Years Experience</div>
                </div>
                <div>
                  <div className="hero-stat-num">{statsVisible ? techCnt : "—"}</div>
                  <div className="hero-stat-label">Technologies</div>
                </div>
              </div>
            </div>
            <div className="hero-photo-wrap reveal rd2">
              <div className="hero-photo-glow"/>
              {bio.portrait
                ? <img src={bio.portrait} alt="Ali Hamad" className="hero-photo"/>
                : <div className="hero-photo-placeholder" onClick={()=>setAdminOpen(true)}>
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.35">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                    </svg>
                    <span>Add photo via Admin</span>
                  </div>
              }
              <div className="hero-photo-badge">{bio.name} · Lebanon 🇱🇧</div>
            </div>
          </div>
        </section>

        {/* ── ABOUT */}
        <section className="section" id="about">
          <div className="section-header reveal">
            <div>
              <div className="section-label">About Me</div>
              <h2 className="section-title">Building AI That Ships</h2>
            </div>
          </div>
          <div className="about-layout">
            <div className="about-body reveal rd1">
              <p>
                I'm <strong>Ali Hamad</strong>, an AI & Software Engineer from Lebanon with a focus on
                production-grade intelligent systems. I design and ship fully-evaluated, containerized
                AI applications — from <strong>multi-agent LangGraph pipelines</strong> and RAG architectures
                to fine-tuned classifiers and MLOps stacks.
              </p>
              <p>
                Every system I build is backed by measurable metrics: CI eval gates that block
                regression, MLflow experiment tracking, LangSmith traces for latency profiling, and
                drift detection with alerting. I don't just prototype — <strong>I engineer.</strong>
              </p>
              <p>
                Currently completing my BSc in Computer Science at Lebanese International University
                and a graduate of SE Factory's AI Engineering Bootcamp, where I shipped 8+ evaluated
                production systems end-to-end. <strong>Open to AI engineering, agentic systems,
                or MLOps roles globally.</strong>
              </p>
              <div className="strength-pills">
                <span className="s-pill hi">LangGraph / Multi-Agent</span>
                <span className="s-pill hi">RAG & Retrieval</span>
                <span className="s-pill hi">Eval-Driven MLOps</span>
                <span className="s-pill">FastAPI + Async Python</span>
                <span className="s-pill">Full-Stack AI</span>
                <span className="s-pill">Open to Relocation</span>
              </div>
            </div>
            <div className="about-cards">
              {ABOUT_CARDS.map((c,i)=>(
                <div key={i} className={`a-card reveal rd${i+1}`}>
                  <div className="a-card-icon">{c.icon}</div>
                  <div className="a-card-title">{c.title}</div>
                  <div className="a-card-sub">{c.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PROJECTS */}
        <section className="section" id="projects">
          <div className="section-header reveal">
            <div>
              <div className="section-label">Work</div>
              <h2 className="section-title">Projects</h2>
            </div>
            <span className="section-count">{filteredProjects.length} / {projects.length}</span>
          </div>
          <div className="proj-filter reveal rd1">
            {cats.map(c=>(
              <button key={c} className={`proj-filter-btn${filterCat===c?" active":""}`} onClick={()=>setFilterCat(c)}>{c}</button>
            ))}
          </div>
          <div className="projects-grid">
            {filteredProjects.map((p,i) => {
              const cat = CAT_MAP[p.cat] || {label:p.cat, cls:"cat-other"};
              const isFeatured = p.featured && filterCat === "All";
              const delay = `rd${Math.min((i%3)+1,6)}`;
              if (isFeatured) return (
                <div key={p.id} className={`proj-card is-featured reveal ${delay}`} onClick={()=>setSelected(p)}>
                  <div className="feat-main">
                    <div className="proj-card-top">
                      <span className={`proj-cat ${cat.cls}`}>{cat.label}</span>
                      <span className="featured-pip">Featured</span>
                    </div>
                    <div className="proj-title">{p.title}</div>
                    <p className="proj-short" style={{WebkitLineClamp:3}}>{p.short}</p>
                    <div className="proj-tags-mini" style={{marginTop:16}}>
                      {p.tags.slice(0,5).map(t=><span key={t} className="proj-tag">{t}</span>)}
                      {p.tags.length>5 && <span className="proj-tag">+{p.tags.length-5}</span>}
                    </div>
                    <div className="feat-view-link"><ArrowRight/> View details</div>
                  </div>
                  <div className="feat-side">
                    <div className="feat-side-inner">
                      {FEAT_BARS.map((w,j)=><span key={j} style={{width:w,opacity:0.3+(j%4)*0.18}}/>)}
                    </div>
                  </div>
                </div>
              );
              return (
                <div key={p.id} className={`proj-card reveal ${delay}`} onClick={()=>setSelected(p)}>
                  <div className="proj-card-inner">
                    <div className="proj-card-left">
                      <div className="proj-card-top">
                        <span className={`proj-cat ${cat.cls}`}>{cat.label}</span>
                        {p.featured && <span className="featured-pip">Featured</span>}
                      </div>
                      <div className="proj-title">{p.title}</div>
                      <p className="proj-short">{p.short}</p>
                      <div className="proj-tags-mini">
                        {p.tags.slice(0,4).map(t=><span key={t} className="proj-tag">{t}</span>)}
                        {p.tags.length>4 && <span className="proj-tag">+{p.tags.length-4}</span>}
                      </div>
                    </div>
                    <div className="proj-arrow"><ArrowRight/></div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── EXPERIENCE */}
        <section className="section" id="experience">
          <div className="section-header reveal">
            <div>
              <div className="section-label">Background</div>
              <h2 className="section-title">Experience</h2>
            </div>
          </div>
          <div className="tl-wrap" style={{marginBottom:52}}>
            {EXPERIENCE.map((e,i)=>(
              <div key={i} className={`tl-item reveal rd${i+1}`}>
                <div className="tl-dot"><BriefcaseIcon/></div>
                <div className="tl-card">
                  <div className="tl-company-badge"><BriefcaseIcon/>{e.company}</div>
                  <div className="tl-role">{e.role}</div>
                  <div className="tl-period">{e.period}</div>
                  <ul className="tl-bullets">
                    {e.bullets.map((b,j)=><li key={j}>{b}</li>)}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className="reveal">
            <div className="sub-label">Education</div>
            <div className="edu-grid">
              {EDUCATION.map((e,i)=>(
                <div key={i} className={`edu-card reveal rd${i+1}`}>
                  <div style={{marginBottom:8,color:"var(--muted2)"}}><GraduationCapIcon/></div>
                  <div className="edu-degree">{e.degree}</div>
                  <div className="edu-inst">{e.institution}</div>
                  <div className="edu-period">{e.period}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="reveal rd1">
            <div className="sub-label">Languages</div>
            <div className="lang-row">
              {LANGUAGES.map(l=>(
                <span key={l.lang} className="lang-chip">
                  <strong>{l.lang}</strong>{l.level}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── SKILLS */}
        <section className="section" id="skills">
          <div className="section-header reveal">
            <div>
              <div className="section-label">Expertise</div>
              <h2 className="section-title">Technical Skills</h2>
            </div>
          </div>
          <div className="skills-grid">
            {skills.map((s,i)=>(
              <div key={s.category} className={`skill-cat reveal rd${Math.min((i%3)+1,6)}`}>
                <div className="skill-cat-title">{s.category}</div>
                <div className="skill-chips">
                  {s.items.map(item=><span key={item} className="skill-chip">{item}</span>)}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CONTACT */}
        <section className="section" id="contact">
          <div className="section-header reveal">
            <div>
              <div className="section-label">Get in touch</div>
              <h2 className="section-title">Contact</h2>
            </div>
          </div>
          <div className="contact-row">
            <a href={`mailto:${bio.email}`} className="contact-card reveal rd1">
              <div className="contact-icon"><MailIcon/></div>
              <div><div className="contact-label">Email</div><div className="contact-value">{bio.email}</div></div>
            </a>
            <a href={bio.github} target="_blank" rel="noreferrer" className="contact-card reveal rd2">
              <div className="contact-icon"><GithubIcon size={20}/></div>
              <div><div className="contact-label">GitHub</div><div className="contact-value">ali-hamad0</div></div>
            </a>
            <a href={bio.linkedin} target="_blank" rel="noreferrer" className="contact-card reveal rd3">
              <div className="contact-icon"><LinkedinIcon/></div>
              <div><div className="contact-label">LinkedIn</div><div className="contact-value">Connect</div></div>
            </a>
          </div>
          <div className="contact-cta reveal rd1">
            <div className="contact-cta-text">
              <h3>Open to new opportunities</h3>
              <p>Looking for AI engineering, agentic systems, or MLOps roles globally. Fast response guaranteed.</p>
            </div>
            <a href={`mailto:${bio.email}?subject=Opportunity%20for%20Ali%20Hamad&body=Hi%20Ali%2C%20I%20came%20across%20your%20portfolio%20and%20would%20love%20to%20connect.`}
              className="btn-primary">
              <MailIcon/> Send a Message
            </a>
          </div>
        </section>
      </div>

      {/* ── FOOTER */}
      <footer>
        <div className="site-wrap">
          <div className="footer-inner">
            <span className="footer-copy">© {new Date().getFullYear()} Ali Hamad · AI & Software Engineer · Lebanon 🇱🇧</span>
            <div className="footer-links">
              <a href={bio.github}   target="_blank" rel="noreferrer">GitHub</a>
              <a href={bio.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
              <a href={`mailto:${bio.email}`}>Email</a>
            </div>
          </div>
        </div>
      </footer>

      {/* ── PROJECT MODAL */}
      {selected && <ProjectModal project={selected} onClose={()=>setSelected(null)}/>}

      {/* ── BACK TO TOP */}
      <button className={`back-top${showBackTop?" vis":""}`} onClick={()=>window.scrollTo({top:0,behavior:"smooth"})} aria-label="Back to top">
        <ArrowUp/>
      </button>

      {/* ── ADMIN */}
      {adminOpen && (
        <div className="admin-overlay" onClick={e=>e.target===e.currentTarget&&setAdminOpen(false)}>
          {!loggedIn ? (
            <div className="login-box">
              <h2>Admin Panel</h2>
              <p>Enter your password to manage your portfolio.</p>
              {loginErr && <div className="login-err">{loginErr}</div>}
              <div className="field" style={{marginBottom:14}}>
                <label>Password</label>
                <input type="password" value={pwd} onChange={e=>setPwd(e.target.value)}
                  onKeyDown={e=>e.key==="Enter"&&login()} placeholder="Enter password" autoFocus/>
              </div>
              <button className="btn-save" style={{marginTop:0}} onClick={login}>Login</button>
              <button onClick={()=>setAdminOpen(false)}
                style={{width:"100%",marginTop:10,padding:10,borderRadius:8,background:"none",border:"1px solid var(--border)",color:"var(--muted2)",cursor:"pointer",fontSize:"0.85rem"}}>
                Cancel
              </button>
            </div>
          ) : (
            <div className="admin-panel">
              <button className="btn-x" onClick={()=>{setAdminOpen(false);setEditingProj(null);setAddingProj(false);}}>×</button>
              <h2><span className="admin-dot"/> Portfolio Admin</h2>
              <div className="admin-tabs">
                {["projects","skills","bio"].map(t=>(
                  <button key={t} className={`admin-tab${adminTab===t?" active":""}`}
                    onClick={()=>{setAdminTab(t);setEditingProj(null);setAddingProj(false);}}>
                    {t.charAt(0).toUpperCase()+t.slice(1)}
                  </button>
                ))}
              </div>
              {adminTab==="projects" && (
                <>
                  {!editingProj && !addingProj ? (
                    <>
                      <button className="btn-primary" style={{marginBottom:16,padding:"9px 20px",fontSize:"0.85rem"}} onClick={()=>setAddingProj(true)}>
                        <PlusIcon/> Add New Project
                      </button>
                      {projects.map(p=>(
                        <div key={p.id} className="proj-list-item">
                          {p.mediaSrc && (
                            <div className="proj-list-thumb">
                              {p.mediaType==="video" ? <video src={p.mediaSrc} muted/> : <img src={p.mediaSrc} alt=""/>}
                            </div>
                          )}
                          <div style={{flex:1,minWidth:0}}>
                            <div className="proj-list-name">{p.title}</div>
                            <div className="proj-list-sub">{p.tags.slice(0,3).join(" · ")}</div>
                          </div>
                          {p.featured && <span style={{fontSize:"0.7rem",padding:"3px 8px",borderRadius:5,background:"rgba(14,165,233,0.1)",color:"var(--accent)",border:"1px solid rgba(14,165,233,0.28)",fontWeight:600}}>Featured</span>}
                          <button className="btn-edit" onClick={()=>setEditingProj(p)}>Edit</button>
                          <button className="btn-del" onClick={()=>delProject(p.id)}>Delete</button>
                        </div>
                      ))}
                    </>
                  ) : (
                    <>
                      <p style={{color:"var(--muted2)",fontSize:"0.85rem",marginBottom:18}}>
                        {addingProj ? "New project" : `Editing: ${editingProj.title}`}
                      </p>
                      <ProjectForm project={editingProj} onSave={saveProject}
                        onCancel={()=>{setEditingProj(null);setAddingProj(false);}}/>
                    </>
                  )}
                </>
              )}
              {adminTab==="skills" && (
                <div style={{display:"flex",flexDirection:"column",gap:14}}>
                  {skills.map((s,si)=>(
                    <div key={si} style={{background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:12,padding:18}}>
                      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                        <input value={s.category} onChange={e=>setSkills(sk=>{const n=[...sk];n[si]={...n[si],category:e.target.value};return n;})}
                          style={{background:"none",border:"none",color:"var(--accent)",fontFamily:"Syne,sans-serif",fontWeight:700,fontSize:"0.85rem",outline:"none",flex:1}}/>
                        <button onClick={()=>setSkills(sk=>sk.filter((_,i)=>i!==si))}
                          style={{padding:"4px 10px",borderRadius:6,background:"none",border:"1px solid var(--border)",color:"var(--muted2)",cursor:"pointer",fontSize:"0.75rem"}}>Remove</button>
                      </div>
                      <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                        {s.items.map((item,ii)=>(
                          <span key={ii} className="tag-input-chip">{item}
                            <button onClick={()=>setSkills(sk=>{const n=[...sk];n[si]={...n[si],items:n[si].items.filter((_,j)=>j!==ii)};return n;})}>×</button>
                          </span>
                        ))}
                        <input className="tags-bare-input" placeholder="Add skill…"
                          onKeyDown={e=>{if(e.key==="Enter"&&e.target.value.trim()){setSkills(sk=>{const n=[...sk];n[si]={...n[si],items:[...n[si].items,e.target.value.trim()]};return n;});e.target.value="";}}}/>
                      </div>
                    </div>
                  ))}
                  <button className="btn-primary" style={{padding:"9px 20px",fontSize:"0.85rem",alignSelf:"flex-start"}}
                    onClick={()=>setSkills(s=>[...s,{category:"New Category",items:[]}])}>
                    <PlusIcon/> Add Category
                  </button>
                  <button className="btn-save" style={{marginTop:4}} onClick={saveSkills}>Save Skills</button>
                </div>
              )}
              {adminTab==="bio" && (
                <div style={{display:"flex",flexDirection:"column",gap:14}}>
                  <div className="field">
                    <label>Portrait Photo</label>
                    {bio.portrait ? (
                      <div>
                        <img src={bio.portrait} alt="portrait" style={{width:120,height:148,objectFit:"cover",objectPosition:"center top",borderRadius:12,border:"1px solid var(--border2)",display:"block",marginBottom:10}}/>
                        <div style={{display:"flex",gap:8}}>
                          <label style={{padding:"6px 14px",borderRadius:7,background:"var(--bg3)",border:"1px solid var(--border2)",color:"var(--text)",cursor:"pointer",fontSize:"0.8rem",fontFamily:"Syne,sans-serif",fontWeight:600}}>
                            Change photo
                            <input type="file" accept="image/*" style={{display:"none"}} onChange={e=>{const f=e.target.files[0];if(!f)return;handlePortraitUpload(f);}}/>
                          </label>
                          <button onClick={handlePortraitRemove} style={{padding:"6px 14px",borderRadius:7,background:"rgba(248,113,113,0.08)",border:"1px solid var(--danger)",color:"var(--danger)",cursor:"pointer",fontSize:"0.8rem",fontFamily:"Syne,sans-serif",fontWeight:600}}>Remove</button>
                        </div>
                      </div>
                    ) : (
                      <label className="media-drop" style={{cursor:"pointer"}}>
                        <UploadIcon/>
                        <div>Click to upload your portrait photo</div>
                        <div style={{fontSize:"0.74rem",opacity:.6}}>JPG, PNG, WEBP recommended</div>
                        <input type="file" accept="image/*" style={{display:"none"}} onChange={e=>{const f=e.target.files[0];if(!f)return;handlePortraitUpload(f);}}/>
                      </label>
                    )}
                  </div>
                  <div className="field">
                    <label>Or paste photo URL</label>
                    <div style={{display:"flex",gap:8}}>
                      <input id="portrait-url-input" placeholder="https://…/your-photo.jpg"
                        style={{flex:1,background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:8,padding:"10px 14px",color:"var(--text)",fontSize:"0.875rem",fontFamily:"Inter,sans-serif",outline:"none"}}/>
                      <button onClick={()=>{const v=document.getElementById("portrait-url-input").value.trim();if(v)setBio(b=>({...b,portrait:v}));}}
                        style={{padding:"10px 18px",borderRadius:8,background:"var(--bg3)",border:"1px solid var(--border2)",color:"var(--text)",cursor:"pointer",fontSize:"0.85rem",fontFamily:"Syne,sans-serif",fontWeight:600}}>Use</button>
                    </div>
                  </div>
                  <div style={{height:1,background:"var(--border)",margin:"4px 0"}}/>
                  {[{k:"name",l:"Name"},{k:"title",l:"Title / Role"},{k:"email",l:"Email"},{k:"github",l:"GitHub URL"},{k:"linkedin",l:"LinkedIn URL"},{k:"cvUrl",l:"CV Download URL"}].map(({k,l})=>(
                    <div key={k} className="field">
                      <label>{l}</label>
                      <input value={bio[k]} onChange={e=>setBio(b=>({...b,[k]:e.target.value}))}/>
                    </div>
                  ))}
                  <button className="btn-save" style={{marginTop:4}} onClick={saveBio}>Save Bio</button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className={`toast${toast.show?" show":""}`}>{toast.msg}</div>
    </>
  );
}
