import { useState, useEffect, useRef } from "react";
import * as api from "./api.js";

const FONT_STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#0a0a0f;--bg2:#111118;--bg3:#1a1a24;
  --border:rgba(255,255,255,0.07);--border2:rgba(255,255,255,0.13);
  --accent:#00e5c3;--accent2:#7c6fff;
  --text:#f0eee8;--muted:#888898;--danger:#ff5c5c;--card-r:16px;
}
html{scroll-behavior:smooth}
body{font-family:'DM Sans',sans-serif;background:var(--bg);color:var(--text);min-height:100vh;overflow-x:hidden}
h1,h2,h3,h4,h5{font-family:'Syne',sans-serif}
::-webkit-scrollbar{width:6px}
::-webkit-scrollbar-track{background:var(--bg2)}
::-webkit-scrollbar-thumb{background:var(--bg3);border-radius:3px}
body::before{content:'';position:fixed;inset:0;pointer-events:none;z-index:0;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");opacity:0.4}
.orb{position:fixed;border-radius:50%;pointer-events:none;z-index:0;filter:blur(80px);opacity:0.18}
.orb1{width:520px;height:520px;background:var(--accent);top:-100px;left:-120px}
.orb2{width:400px;height:400px;background:var(--accent2);bottom:-60px;right:-80px}
.site-wrap{position:relative;z-index:1;max-width:1140px;margin:0 auto;padding:0 28px}

/* NAV */
nav{position:sticky;top:0;z-index:100;background:rgba(10,10,15,0.82);backdrop-filter:blur(18px);border-bottom:1px solid var(--border)}
.nav-inner{max-width:1140px;margin:0 auto;padding:0 28px;display:flex;align-items:center;justify-content:space-between;height:64px}
.nav-logo{font-family:'Syne',sans-serif;font-weight:800;font-size:1.15rem;color:var(--text);text-decoration:none;display:flex;align-items:center;gap:10px}
.logo-mark{width:30px;height:30px;border-radius:8px;background:linear-gradient(135deg,var(--accent),var(--accent2));display:flex;align-items:center;justify-content:center;font-size:0.75rem;color:#000;font-weight:800}
.nav-links{display:flex;align-items:center;gap:24px}
.nav-links a{color:var(--muted);font-size:0.875rem;text-decoration:none;transition:color .2s;font-weight:500}
.nav-links a:hover{color:var(--text)}
.btn-admin{padding:8px 18px;border-radius:8px;font-size:0.8rem;font-weight:600;background:var(--bg3);border:1px solid var(--border2);color:var(--text);cursor:pointer;transition:all .2s;font-family:'Syne',sans-serif}
.btn-admin:hover{background:var(--accent);color:#000;border-color:var(--accent)}

/* HERO */
.hero{padding:100px 0 80px}
.hero-tag{display:inline-flex;align-items:center;gap:8px;padding:6px 14px;border-radius:999px;border:1px solid rgba(0,229,195,0.3);background:rgba(0,229,195,0.06);font-size:0.78rem;color:var(--accent);font-weight:500;margin-bottom:28px;letter-spacing:0.04em}
.hero-tag::before{content:'';width:6px;height:6px;border-radius:50%;background:var(--accent);animation:pulse 2s infinite}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.5;transform:scale(1.4)}}
.hero h1{font-size:clamp(2.8rem,7vw,5.2rem);font-weight:800;line-height:1.05;letter-spacing:-0.03em;margin-bottom:20px}
.hero h1 .grad{background:linear-gradient(90deg,var(--accent),var(--accent2));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.hero-sub{font-size:1.1rem;color:var(--muted);max-width:540px;line-height:1.7;margin-bottom:40px;font-weight:300}
.hero-actions{display:flex;gap:14px;flex-wrap:wrap}
.hero-inner{display:flex;align-items:center;justify-content:space-between;gap:60px}
.hero-text{flex:1;min-width:0}
.hero-photo-wrap{flex-shrink:0;position:relative}
.hero-photo{width:280px;height:340px;border-radius:24px;object-fit:cover;object-position:center top;border:1px solid var(--border2);display:block}
.hero-photo-placeholder{width:280px;height:340px;border-radius:24px;background:var(--bg2);border:2px dashed var(--border2);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;color:var(--muted);font-size:0.85rem;cursor:pointer}
.hero-photo-glow{position:absolute;inset:-2px;border-radius:26px;background:linear-gradient(135deg,var(--accent),var(--accent2));opacity:0.15;z-index:-1;filter:blur(16px)}
.hero-photo-badge{position:absolute;bottom:-14px;left:50%;transform:translateX(-50%);white-space:nowrap;padding:8px 20px;border-radius:999px;background:var(--bg2);border:1px solid var(--border2);font-size:0.78rem;font-weight:600;font-family:'Syne',sans-serif;color:var(--accent);letter-spacing:0.04em}
@media(max-width:768px){.hero-inner{flex-direction:column-reverse;gap:36px}.hero-photo,.hero-photo-placeholder{width:180px;height:220px}}
.btn-primary{padding:12px 28px;border-radius:10px;font-size:0.9rem;font-weight:600;background:linear-gradient(135deg,var(--accent),var(--accent2));color:#000;border:none;cursor:pointer;font-family:'Syne',sans-serif;transition:all .2s;text-decoration:none;display:inline-flex;align-items:center;gap:8px}
.btn-primary:hover{opacity:0.88;transform:translateY(-1px)}
.btn-outline{padding:12px 28px;border-radius:10px;font-size:0.9rem;font-weight:600;background:transparent;color:var(--text);border:1px solid var(--border2);cursor:pointer;font-family:'Syne',sans-serif;transition:all .2s;text-decoration:none;display:inline-flex;align-items:center;gap:8px}
.btn-outline:hover{border-color:var(--accent);color:var(--accent)}

/* SECTION */
.section{padding:80px 0}
.section-label{font-size:0.78rem;letter-spacing:0.12em;font-weight:600;color:var(--accent);text-transform:uppercase;margin-bottom:10px}
.section-title{font-size:clamp(1.8rem,4vw,2.6rem);font-weight:800;letter-spacing:-0.02em;margin-bottom:48px}

/* PROJECT CARDS - compact click-to-expand */
.projects-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:2px}
@media(max-width:680px){.projects-grid{grid-template-columns:1fr}}
.proj-card{background:var(--bg2);border:1px solid var(--border);padding:22px 24px;cursor:pointer;transition:all .2s;position:relative;border-radius:0}
.proj-card:first-child{border-radius:var(--card-r) var(--card-r) 0 0}
.proj-card:last-child{border-radius:0 0 var(--card-r) var(--card-r)}
.proj-card:first-child:last-child{border-radius:var(--card-r)}
.projects-grid .proj-card{border-radius:var(--card-r)}
.proj-card:hover{background:var(--bg3);border-color:var(--border2);z-index:1}
.proj-card-inner{display:flex;align-items:flex-start;justify-content:space-between;gap:16px}
.proj-card-left{flex:1;min-width:0}
.proj-card-top{display:flex;align-items:center;gap:10px;margin-bottom:6px}
.proj-cat{font-size:0.7rem;padding:3px 9px;border-radius:999px;font-weight:600;font-family:'Syne',sans-serif;letter-spacing:0.04em}
.featured-pip{width:6px;height:6px;border-radius:50%;background:var(--accent);flex-shrink:0}
.proj-title{font-family:'Syne',sans-serif;font-size:1rem;font-weight:700;color:var(--text);margin-bottom:6px;line-height:1.3}
.proj-short{font-size:0.85rem;color:var(--muted);line-height:1.6;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.proj-tags-mini{display:flex;flex-wrap:wrap;gap:5px;margin-top:10px}
.proj-tag{padding:3px 9px;border-radius:5px;font-size:0.7rem;font-weight:500;background:var(--bg3);border:1px solid var(--border);color:var(--muted)}
.proj-arrow{color:var(--muted);transition:all .2s;flex-shrink:0;margin-top:2px}
.proj-card:hover .proj-arrow{color:var(--accent);transform:translateX(3px)}

/* CAT COLORS */
.cat-saas{background:rgba(0,229,195,0.1);color:var(--accent)}
.cat-aiml{background:rgba(124,111,255,0.1);color:#a99fff}
.cat-agents{background:rgba(255,180,50,0.1);color:#f5b84b}
.cat-rag{background:rgba(50,150,255,0.1);color:#70b8ff}
.cat-cv{background:rgba(255,100,150,0.1);color:#ff8ab5}
.cat-mlops{background:rgba(255,120,80,0.1);color:#ff9070}

/* MODAL OVERLAY */
.modal-overlay{position:fixed;inset:0;z-index:500;background:rgba(0,0,0,0.75);backdrop-filter:blur(12px);display:flex;align-items:center;justify-content:center;padding:20px;animation:fadeIn .18s ease}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
.modal-box{background:var(--bg2);border:1px solid var(--border2);border-radius:20px;width:100%;max-width:720px;max-height:88vh;overflow-y:auto;animation:slideUp .22s ease}
@keyframes slideUp{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}

/* modal media */
.modal-media{width:100%;aspect-ratio:16/9;background:var(--bg3);position:relative;overflow:hidden;border-radius:20px 20px 0 0}
.modal-media img{width:100%;height:100%;object-fit:cover}
.modal-media video{width:100%;height:100%;object-fit:cover}
.modal-media-empty{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;color:var(--muted);font-size:0.85rem}
.modal-media-empty svg{opacity:0.25}
.modal-badge-row{position:absolute;top:14px;left:14px;display:flex;gap:8px}
.modal-badge{padding:5px 12px;border-radius:7px;font-size:0.7rem;font-weight:700;font-family:'Syne',sans-serif;letter-spacing:0.05em;backdrop-filter:blur(8px);border:1px solid var(--border2);background:rgba(0,0,0,0.55)}
.modal-close{position:absolute;top:14px;right:14px;width:34px;height:34px;border-radius:8px;background:rgba(0,0,0,0.55);backdrop-filter:blur(8px);border:1px solid var(--border2);color:var(--text);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s;font-size:1.1rem;line-height:1}
.modal-close:hover{background:var(--danger);border-color:var(--danger)}

/* modal body */
.modal-body{padding:26px 28px 28px}
.modal-title{font-family:'Syne',sans-serif;font-size:1.4rem;font-weight:800;color:var(--text);margin-bottom:14px;line-height:1.25}
.modal-desc{font-size:0.9rem;color:var(--muted);line-height:1.75;margin-bottom:20px;font-weight:300}
.modal-links{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:20px}
.modal-link-btn{display:inline-flex;align-items:center;gap:8px;padding:9px 18px;border-radius:9px;font-size:0.83rem;font-weight:600;font-family:'Syne',sans-serif;text-decoration:none;transition:all .2s;border:1px solid var(--border2);background:var(--bg3);color:var(--text)}
.modal-link-btn:hover{border-color:var(--accent);color:var(--accent)}
.modal-link-btn.primary{background:linear-gradient(135deg,var(--accent),var(--accent2));color:#000;border-color:transparent}
.modal-link-btn.primary:hover{opacity:0.88}
.modal-tags-label{font-size:0.72rem;letter-spacing:0.1em;font-weight:600;color:var(--muted);text-transform:uppercase;margin-bottom:10px}
.modal-tags{display:flex;flex-wrap:wrap;gap:7px}
.modal-tag{padding:5px 12px;border-radius:7px;font-size:0.75rem;font-weight:500;background:var(--bg3);border:1px solid var(--border);color:var(--muted)}

/* SKILLS */
.skills-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:14px}
.skill-cat{background:var(--bg2);border:1px solid var(--border);border-radius:12px;padding:18px}
.skill-cat-title{font-family:'Syne',sans-serif;font-size:0.72rem;font-weight:700;color:var(--accent);letter-spacing:0.1em;text-transform:uppercase;margin-bottom:12px}
.skill-chips{display:flex;flex-wrap:wrap;gap:6px}
.skill-chip{padding:4px 10px;border-radius:6px;font-size:0.75rem;font-weight:500;background:var(--bg3);border:1px solid var(--border);color:var(--muted)}

/* CONTACT */
.contact-row{display:flex;gap:14px;flex-wrap:wrap}
.contact-card{flex:1;min-width:180px;background:var(--bg2);border:1px solid var(--border);border-radius:12px;padding:22px;display:flex;align-items:center;gap:14px;text-decoration:none;color:var(--text);transition:all .2s}
.contact-card:hover{border-color:var(--accent);background:var(--bg3)}
.contact-icon{width:40px;height:40px;border-radius:10px;background:var(--bg3);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;color:var(--accent);flex-shrink:0}
.contact-label{font-size:0.75rem;color:var(--muted);margin-bottom:2px}
.contact-value{font-weight:600;font-size:0.88rem;font-family:'Syne',sans-serif}

/* FOOTER */
footer{border-top:1px solid var(--border);padding:28px 0;margin-top:40px;text-align:center;color:var(--muted);font-size:0.82rem}

/* ADMIN */
.admin-overlay{position:fixed;inset:0;z-index:1000;background:rgba(0,0,0,0.75);backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;padding:20px}
.admin-panel{background:var(--bg2);border:1px solid var(--border2);border-radius:20px;width:100%;max-width:820px;max-height:90vh;overflow-y:auto;padding:32px;position:relative}
.admin-panel h2{font-size:1.5rem;font-weight:800;margin-bottom:28px;display:flex;align-items:center;gap:10px}
.admin-dot{width:10px;height:10px;border-radius:50%;background:var(--accent);display:inline-block;animation:pulse 2s infinite}
.admin-tabs{display:flex;gap:8px;margin-bottom:24px;flex-wrap:wrap}
.admin-tab{padding:8px 18px;border-radius:8px;font-size:0.82rem;font-weight:600;background:var(--bg3);border:1px solid var(--border);color:var(--muted);cursor:pointer;transition:all .2s;font-family:'Syne',sans-serif}
.admin-tab.active{background:var(--accent);color:#000;border-color:var(--accent)}
.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
@media(max-width:600px){.form-grid{grid-template-columns:1fr}}
.form-full{grid-column:1/-1}
.field{display:flex;flex-direction:column;gap:6px}
.field label{font-size:0.72rem;font-weight:600;color:var(--muted);letter-spacing:0.06em;text-transform:uppercase}
.field input,.field textarea,.field select{background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:10px 14px;color:var(--text);font-size:0.875rem;font-family:'DM Sans',sans-serif;outline:none;transition:border-color .2s;width:100%}
.field input:focus,.field textarea:focus{border-color:var(--accent)}
.field textarea{resize:vertical;min-height:80px}
.media-drop{border:2px dashed var(--border2);border-radius:12px;padding:28px;text-align:center;color:var(--muted);font-size:0.85rem;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:10px;transition:border-color .2s}
.media-drop:hover{border-color:var(--accent)}
.media-preview{width:100%;border-radius:10px;overflow:hidden;border:1px solid var(--border);margin-top:10px}
.media-preview img,.media-preview video{width:100%;display:block;max-height:200px;object-fit:cover}
.btn-save{width:100%;padding:13px;border-radius:10px;font-size:0.9rem;font-weight:700;background:linear-gradient(135deg,var(--accent),var(--accent2));color:#000;border:none;cursor:pointer;font-family:'Syne',sans-serif;transition:opacity .2s;margin-top:20px}
.btn-save:hover{opacity:0.88}
.btn-x{position:absolute;top:20px;right:20px;width:36px;height:36px;border-radius:8px;background:var(--bg3);border:1px solid var(--border);color:var(--muted);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s;font-size:1.2rem;line-height:1}
.btn-x:hover{background:var(--danger);color:#fff;border-color:var(--danger)}
.proj-list-item{display:flex;align-items:center;gap:12px;padding:12px 16px;background:var(--bg3);border:1px solid var(--border);border-radius:10px;margin-bottom:8px}
.proj-list-thumb{width:48px;height:36px;border-radius:6px;overflow:hidden;flex-shrink:0;background:var(--bg2)}
.proj-list-thumb img,.proj-list-thumb video{width:100%;height:100%;object-fit:cover}
.proj-list-name{flex:1;font-size:0.9rem;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.proj-list-sub{color:var(--muted);font-size:0.75rem}
.btn-edit,.btn-del{padding:6px 14px;border-radius:6px;font-size:0.78rem;font-weight:600;cursor:pointer;transition:all .2s;font-family:'Syne',sans-serif;border:1px solid}
.btn-edit{background:var(--bg2);border-color:var(--border);color:var(--muted)}
.btn-edit:hover{border-color:var(--accent);color:var(--accent)}
.btn-del{background:var(--bg2);border-color:var(--border);color:var(--muted)}
.btn-del:hover{background:rgba(255,92,92,0.1);border-color:var(--danger);color:var(--danger)}
.tag-input-chip{padding:3px 8px 3px 10px;border-radius:6px;font-size:0.75rem;background:var(--bg3);border:1px solid var(--border2);color:var(--text);display:inline-flex;align-items:center;gap:5px}
.tag-input-chip button{background:none;border:none;color:var(--muted);cursor:pointer;font-size:0.9rem;padding:0;line-height:1}
.tag-input-chip button:hover{color:var(--danger)}
.tags-bare-input{background:none;border:none;outline:none;color:var(--text);font-size:0.82rem;font-family:'DM Sans',sans-serif;min-width:80px;padding:4px 0}
.toggle-row{display:flex;align-items:center;gap:12px}
.toggle{position:relative;width:42px;height:24px}
.toggle input{opacity:0;width:0;height:0;position:absolute}
.tog-sl{position:absolute;inset:0;background:var(--bg3);border:1px solid var(--border);border-radius:999px;cursor:pointer;transition:all .2s}
.tog-sl::before{content:'';position:absolute;width:16px;height:16px;border-radius:50%;background:var(--muted);top:3px;left:3px;transition:all .2s}
.toggle input:checked+.tog-sl{background:rgba(0,229,195,0.2);border-color:var(--accent)}
.toggle input:checked+.tog-sl::before{background:var(--accent);transform:translateX(18px)}
.login-box{background:var(--bg2);border:1px solid var(--border2);border-radius:20px;padding:40px;width:100%;max-width:400px}
.login-box h2{font-size:1.5rem;font-weight:800;margin-bottom:8px}
.login-box p{color:var(--muted);font-size:0.875rem;margin-bottom:28px}
.login-err{color:var(--danger);font-size:0.82rem;margin-bottom:12px;text-align:center}
.toast{position:fixed;bottom:24px;right:24px;z-index:2000;padding:12px 22px;border-radius:10px;font-size:0.875rem;font-weight:500;background:var(--accent);color:#000;transform:translateY(80px);opacity:0;transition:all .3s;font-family:'Syne',sans-serif}
.toast.show{transform:translateY(0);opacity:1}
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

// ── CAT CONFIG
const CAT_MAP = {
  SaaS:   { label:"SaaS",    cls:"cat-saas" },
  "AI/ML":{ label:"AI/ML",   cls:"cat-aiml" },
  Agents: { label:"Agents",  cls:"cat-agents" },
  RAG:    { label:"RAG",     cls:"cat-rag" },
  CV:     { label:"CV",      cls:"cat-cv" },
  MLOps:  { label:"MLOps",   cls:"cat-mlops" },
};

// ── INITIAL DATA
const INITIAL_PROJECTS = [
  { id:1, title:"Modir — AI Business Platform", featured:true, cat:"SaaS",
    short:"Multi-tenant SaaS with 5 LangGraph agents for Lebanese SMEs — finance, inventory, customer, operations, and strategy.",
    full:"Full multi-tenant SaaS platform built for Lebanese small businesses. Features 5 LangGraph agents (Finance, Inventory, Customer, Operations, Strategy) orchestrated by a supervisor topology. ML layer includes demand forecasting, churn prediction, anomaly detection, and customer segmentation — each with CI eval gates. OCR pipeline using Tesseract + LLM structuring for paper bills. Lebanese Arabic dialect support. Multi-provider LLM router with Gemini → Grok → Claude fallback. Postgres RLS for tenant isolation, Vault secrets, Redis, MinIO blob storage.",
    tags:["LangGraph","Multi-tenant","FastAPI","PostgreSQL","MLflow","Redis","Vault","OCR"],
    github:"https://github.com/ali-hamad0", live:"", mediaType:"none", mediaSrc:"" },
  { id:2, title:"PathoScan AI — Medical Diagnostics", featured:true, cat:"AI/ML",
    short:"Transfer learning for X-ray & MRI classification at 94%+ accuracy. RAG chatbot over 35,000+ medical documents.",
    full:"Full-stack AI medical diagnostic platform. Transfer learning with ResNet50V2 and DenseNet121 achieving 94%+ diagnostic accuracy on tested datasets. RAG-based medical chatbot built with LangChain and ChromaDB indexing over 35,000 medical documents for semantic retrieval. REST APIs for predictions, patient history management, and real-time analytics. Confidence score layer to support clinical decision-making. React frontend, FastAPI backend, MySQL database.",
    tags:["TensorFlow","ResNet50V2","DenseNet121","LangChain","ChromaDB","FastAPI","React"],
    github:"https://github.com/ali-hamad0", live:"", mediaType:"none", mediaSrc:"" },
  { id:3, title:"Concierge — Multi-Tenant AI SaaS", featured:false, cat:"Agents",
    short:"Postgres RLS isolation + classifier-driven hybrid router. NeMo Guardrails sidecar with CI red-team injection gates.",
    full:"Multi-tenant AI SaaS with Postgres Row-Level Security for tenant isolation and a classifier-driven hybrid router. A cheap deterministic workflow handles simple turns; a bounded tool-calling agent (rag_search, capture_lead, escalate) handles ambiguous ones. Trained ML / DL (ONNX) / LLM baselines — served lean via onnxruntime. NeMo Guardrails sidecar with platform rails for prompt injection, cross-tenant refusal, and PII redaction. CI gates: classifier F1, agent tool-selection golden set, RAG golden set, injection/cross-tenant red-team set.",
    tags:["Postgres RLS","ONNX","NeMo Guardrails","LangGraph","FastAPI","React Widget"],
    github:"https://github.com/ali-hamad0", live:"", mediaType:"none", mediaSrc:"" },
  { id:4, title:"Maintainer's Copilot — RAG Chatbot", featured:false, cat:"RAG",
    short:"Fine-tuned BERT for GitHub issue classification. Hybrid retrieval + cross-encoder reranking + query rewrite on pgvector.",
    full:"Fine-tuned DistilBERT/BERT for GitHub issue classification (bug/feature/docs/question), benchmarked against classical ML and LLM zero-shot. Advanced RAG pipeline: non-naive chunking, hybrid sparse+dense retrieval, cross-encoder reranking, query rewrite, metadata filtering — each improvement measured on a 25-example golden set. Dual memory: Redis short-term (TTL) + pgvector long-term episodic with audit log. Embeddable React widget with per-tenant origin allowlist. All secrets via Vault; PII redaction tested explicitly.",
    tags:["BERT","Hybrid RAG","pgvector","Redis","React Widget","FastAPI","Vault"],
    github:"https://github.com/ali-hamad0", live:"", mediaType:"none", mediaSrc:"" },
  { id:5, title:"Document Classifier as a Service", featured:false, cat:"CV",
    short:"ConvNeXt Tiny fine-tuned on RVL-CDIP (16 classes, 320k images). SFTP → MinIO → RQ → inference pipeline.",
    full:"Fine-tuned ConvNeXt Tiny on RVL-CDIP (16 document layout classes, 320k training images). Shipped weights + model card via git LFS. SFTP ingestion: polls SFTP → uploads to MinIO → enqueues RQ job → worker runs inference → writes prediction + annotated overlay PNG. Full RBAC with Casbin (admin/reviewer/auditor). Strict layered architecture: api/ HTTP only, services/ business logic, repositories/ SQL only. Service refuses to boot if classifier SHA-256 mismatches model card or Vault is unreachable.",
    tags:["ConvNeXt","RVL-CDIP","Casbin","MinIO","Redis Queue","FastAPI","Vault"],
    github:"https://github.com/ali-hamad0", live:"", mediaType:"none", mediaSrc:"" },
  { id:6, title:"Drift Triage Co-Pilot — MLOps", featured:false, cat:"MLOps",
    short:"MLflow registry + PSI/chi² drift detection. LangGraph supervisor with Postgres checkpoints. HIL approval gate.",
    full:"Binary classifier on UCI Bank Marketing with threshold tuned to recall ≥ 0.75. Registered pipeline in MLflow. Drift detection via PSI on numerics and chi² on categoricals — webhook triggers a LangGraph supervisor investigation on severity change. Supervisor has three sub-agents (triage, action, comms) with Postgres checkpoint persistence. Slow tools dispatched via Redis queue with idempotency keys, exponential backoff, and dead-letter queue. HIL approval gate in Streamlit dashboard before any Production promotion.",
    tags:["MLflow","LangGraph","PSI / chi²","Redis DLQ","Postgres","Streamlit","HIL"],
    github:"https://github.com/ali-hamad0", live:"", mediaType:"none", mediaSrc:"" },
  { id:7, title:"Smart Travel Planner — Agentic", featured:false, cat:"Agents",
    short:"LangGraph agent with RAG + ML classifier + live APIs. Cheap model for extraction, strong model for synthesis.",
    full:"LangGraph agent with three Pydantic-validated tools: RAG retrieval (pgvector), ML travel-style classifier (scikit-learn, 3 classifiers k-fold compared), and live conditions (weather/flights/FX). Cheap model handles argument extraction and RAG query rewriting; stronger model handles final synthesis. Token usage logged per step. Async FastAPI with SQLAlchemy 2.x async sessions, httpx.AsyncClient, all clients as lifespan singletons via Depends(). Webhook delivery with timeout, retry with backoff, structured failure logging.",
    tags:["LangGraph","pgvector","scikit-learn","Async FastAPI","Webhooks","React"],
    github:"https://github.com/ali-hamad0", live:"", mediaType:"none", mediaSrc:"" },
  { id:8, title:"Decision Intelligence Assistant", featured:false, cat:"RAG",
    short:"4-way comparison: RAG vs non-RAG vs ML vs LLM zero-shot — accuracy, latency (ms), cost ($) side by side.",
    full:"RAG system over Customer Support Twitter dataset: cleaned noisy real-world data, generated embeddings, stored in ChromaDB, retrieved top-k similar tickets per query. Weak-supervision labeling function (urgency keywords + punctuation signals + sentiment) with documented leakage analysis. Trained and compared multiple ML classifiers. Four-way comparison per query: RAG answer, non-RAG answer, ML priority prediction, LLM zero-shot — with accuracy, latency (ms), and cost ($) side by side. Full Docker Compose orchestration with named volumes and single-command startup.",
    tags:["RAG","ChromaDB","scikit-learn","Docker Compose","FastAPI","React"],
    github:"https://github.com/ali-hamad0", live:"", mediaType:"none", mediaSrc:"" },
];

const INITIAL_SKILLS = [
  { category:"Agents & LLMs",  items:["LangGraph","LangChain","RAG","Tool Calling","NeMo Guardrails","LangSmith"] },
  { category:"ML / DL",        items:["PyTorch","TensorFlow","scikit-learn","Transformers","ONNX Runtime","MLflow"] },
  { category:"Backend",        items:["FastAPI","Async Python","SQLAlchemy","Alembic","Pydantic","Casbin RBAC"] },
  { category:"Infra & DB",     items:["PostgreSQL","pgvector","Redis","Docker","MinIO","HashiCorp Vault"] },
  { category:"Frontend",       items:["React","Vite","Tailwind","Streamlit"] },
  { category:"MLOps & CI",     items:["GitHub Actions","Drift Detection","Eval Gates","PSI / chi²"] },
];

const ADMIN_PWD = "Ali@2025#Secure";

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
        style={{marginTop:8,padding:"5px 14px",borderRadius:6,background:"rgba(255,92,92,0.1)",border:"1px solid var(--danger)",color:"var(--danger)",cursor:"pointer",fontSize:"0.78rem",fontFamily:"Syne,sans-serif",fontWeight:600}}>
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
        <input style={{flex:1,background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:8,padding:"8px 12px",color:"var(--text)",fontSize:"0.82rem",fontFamily:"DM Sans,sans-serif",outline:"none"}}
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
  return (
    <form onSubmit={e=>{e.preventDefault();if(f.title.trim())onSave(f);}}>
      <div className="form-grid">
        <div className="field form-full">
          <label>Title *</label>
          <input value={f.title} onChange={e=>set("title",e.target.value)} placeholder="Project name" required/>
        </div>
        <div className="field">
          <label>Category</label>
          <select value={f.cat} onChange={e=>set("cat",e.target.value)} style={{background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:8,padding:"10px 14px",color:"var(--text)",fontSize:"0.875rem",fontFamily:"DM Sans,sans-serif",outline:"none"}}>
            {Object.keys(CAT_MAP).map(c=><option key={c} value={c}>{c}</option>)}
          </select>
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
          <span style={{fontSize:"0.875rem",color:"var(--muted)"}}>Mark as Featured</span>
        </div>
      </div>
      <div style={{display:"flex",gap:10,marginTop:20}}>
        <button type="submit" className="btn-save" style={{margin:0,flex:1}}>Save Project</button>
        <button type="button" onClick={onCancel}
          style={{padding:"13px 24px",borderRadius:10,background:"var(--bg3)",border:"1px solid var(--border)",color:"var(--muted)",cursor:"pointer",fontSize:"0.9rem",fontFamily:"Syne,sans-serif",fontWeight:600}}>
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

  const cat = CAT_MAP[project.cat] || {label:project.cat, cls:""};

  return (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal-box">
        {/* Media */}
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
        {/* Body */}
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
    cvUrl:"#",
    portrait:"",
  });
  const [selected,      setSelected]      = useState(null);
  const [adminOpen,     setAdminOpen]     = useState(false);
  const [loggedIn,      setLoggedIn]      = useState(api.hasToken());
  const [pwd,           setPwd]           = useState("");
  const [loginErr,      setLoginErr]      = useState("");
  const [adminTab,      setAdminTab]      = useState("projects");
  const [editingProj,   setEditingProj]   = useState(null);
  const [addingProj,    setAddingProj]    = useState(false);
  const [toast,         setToast]         = useState({show:false,msg:""});

  const showToast = msg => { setToast({show:true,msg}); setTimeout(()=>setToast({show:false,msg:""}),2600); };

  // Load data from backend on mount
  useEffect(() => {
    api.getProjects().then(data => { if(Array.isArray(data)) setProjects(data); }).catch(()=>{});
    api.getSkills().then(data => { if(Array.isArray(data)) setSkills(data); }).catch(()=>{});
    api.getBio().then(data => {
      if(data && data.name) setBio({...data, cvUrl: data.cv_url || "#"});
    }).catch(()=>{});
  }, []);

  const login = async () => {
    try {
      await api.login(pwd);
      setLoggedIn(true); setLoginErr(""); setPwd("");
    } catch {
      setLoginErr("Incorrect password.");
    }
  };

  const saveProject = async p => {
    try {
      // only use PUT if id is a real backend integer (not a Date.now() temp id)
      const isBackendId = p.id && Number.isInteger(p.id) && p.id < 1_000_000_000_000;
      if(isBackendId) { await api.updateProject(p.id, p); }
      else { await api.createProject(p); }
      const updated = await api.getProjects();
      if(Array.isArray(updated)) setProjects(updated);
      setEditingProj(null); setAddingProj(false); showToast("Project saved ✓");
    } catch { showToast("Error saving project"); }
  };

  const delProject = async id => {
    try {
      await api.deleteProject(id);
      setProjects(ps=>ps.filter(p=>p.id!==id)); showToast("Deleted");
    } catch { showToast("Error deleting project"); }
  };

  const saveBio = async () => {
    try {
      const payload = { name:bio.name, title:bio.title, email:bio.email, github:bio.github, linkedin:bio.linkedin, cv_url:bio.cvUrl||"" };
      const data = await api.saveBio(payload);
      setBio({...data, cvUrl: data.cv_url || "#"});
      showToast("Bio saved ✓");
    } catch { showToast("Error saving bio"); }
  };

  const saveSkills = async () => {
    try {
      await api.saveSkills(skills); showToast("Skills saved ✓");
    } catch { showToast("Error saving skills"); }
  };

  const handlePortraitUpload = async (file) => {
    try {
      const data = await api.uploadPortrait(file);
      setBio(b=>({...b, portrait: data.portrait || ""}));
      showToast("Portrait uploaded ✓");
    } catch { showToast("Error uploading portrait"); }
  };

  const handlePortraitRemove = async () => {
    try {
      const data = await api.removePortrait();
      setBio(b=>({...b, portrait: data.portrait || ""}));
      showToast("Portrait removed");
    } catch { showToast("Error removing portrait"); }
  };

  return (
    <>
      <style>{FONT_STYLE}</style>
      <div className="orb orb1"/><div className="orb orb2"/>

      {/* NAV */}
      <nav>
        <div className="nav-inner">
          <a href="#" className="nav-logo"><div className="logo-mark">AH</div>Ali Hamad</a>
          <div className="nav-links">
            <a href="#projects">Projects</a>
            <a href="#skills">Skills</a>
            <a href="#contact">Contact</a>
            <button className="btn-admin" onClick={()=>setAdminOpen(true)}>⚙ Admin</button>
          </div>
        </div>
      </nav>

      <div className="site-wrap">
        {/* HERO */}
        <section className="hero">
          <div className="hero-inner">
            <div className="hero-text">
              <div className="hero-tag">Available for opportunities</div>
              <h1>AI & Software<br/><span className="grad">Engineer</span></h1>
              <p className="hero-sub">Building production-grade intelligent systems — agentic pipelines, fine-tuned models, RAG, and MLOps. Every decision backed by a number.</p>
              <div className="hero-actions">
                <a href="#projects" className="btn-primary"><PlusIcon/> View Projects</a>
                <a href={bio.github} target="_blank" rel="noreferrer" className="btn-outline"><GithubIcon/> GitHub</a>
                <a href={bio.cvUrl} className="btn-outline">Download CV</a>
              </div>
            </div>
            <div className="hero-photo-wrap">
              <div className="hero-photo-glow"/>
              {bio.portrait
                ? <img src={bio.portrait} alt="Ali Hamad" className="hero-photo"/>
                : <div className="hero-photo-placeholder" onClick={()=>{setAdminOpen(true);}}>
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.4">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    <span>Add photo via Admin</span>
                  </div>
              }
              <div className="hero-photo-badge">Ali Hamad · Lebanon 🇱🇧</div>
            </div>
          </div>
        </section>

        {/* PROJECTS */}
        <section className="section" id="projects">
          <div className="section-label">Work</div>
          <h2 className="section-title">Projects</h2>
          <div className="projects-grid">
            {projects.map(p => {
              const cat = CAT_MAP[p.cat] || {label:p.cat, cls:""};
              return (
                <div key={p.id} className="proj-card" onClick={()=>setSelected(p)}>
                  <div className="proj-card-inner">
                    <div className="proj-card-left">
                      <div className="proj-card-top">
                        {p.featured && <div className="featured-pip" title="Featured"/>}
                        <span className={`proj-cat ${cat.cls}`}>{cat.label}</span>
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

        {/* SKILLS */}
        <section className="section" id="skills">
          <div className="section-label">Expertise</div>
          <h2 className="section-title">Technical Skills</h2>
          <div className="skills-grid">
            {skills.map(s=>(
              <div key={s.category} className="skill-cat">
                <div className="skill-cat-title">{s.category}</div>
                <div className="skill-chips">{s.items.map(i=><span key={i} className="skill-chip">{i}</span>)}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CONTACT */}
        <section className="section" id="contact">
          <div className="section-label">Get in touch</div>
          <h2 className="section-title">Contact</h2>
          <div className="contact-row">
            <a href={`mailto:${bio.email}`} className="contact-card">
              <div className="contact-icon"><MailIcon/></div>
              <div><div className="contact-label">Email</div><div className="contact-value">{bio.email}</div></div>
            </a>
            <a href={bio.github} target="_blank" rel="noreferrer" className="contact-card">
              <div className="contact-icon"><GithubIcon size={20}/></div>
              <div><div className="contact-label">GitHub</div><div className="contact-value">ali-hamad0</div></div>
            </a>
            <a href={bio.linkedin} target="_blank" rel="noreferrer" className="contact-card">
              <div className="contact-icon"><LinkedinIcon/></div>
              <div><div className="contact-label">LinkedIn</div><div className="contact-value">Connect</div></div>
            </a>
          </div>
        </section>
      </div>

      <footer><div className="site-wrap">© 2025 Ali Hamad · AI & Software Engineer · Lebanon</div></footer>

      {/* PROJECT MODAL */}
      {selected && <ProjectModal project={selected} onClose={()=>setSelected(null)}/>}

      {/* ADMIN */}
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
                style={{width:"100%",marginTop:10,padding:10,borderRadius:8,background:"none",border:"1px solid var(--border)",color:"var(--muted)",cursor:"pointer",fontSize:"0.85rem"}}>
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

              {/* PROJECTS TAB */}
              {adminTab==="projects" && (
                <>
                  {!editingProj && !addingProj ? (
                    <>
                      <button className="btn-primary" style={{marginBottom:16,padding:"9px 20px",fontSize:"0.85rem"}}
                        onClick={()=>setAddingProj(true)}>
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
                          {p.featured && <span style={{fontSize:"0.7rem",padding:"3px 8px",borderRadius:5,background:"rgba(0,229,195,0.1)",color:"var(--accent)",border:"1px solid rgba(0,229,195,0.2)",fontWeight:600}}>Featured</span>}
                          <button className="btn-edit" onClick={()=>setEditingProj(p)}>Edit</button>
                          <button className="btn-del" onClick={()=>delProject(p.id)}>Delete</button>
                        </div>
                      ))}
                    </>
                  ) : (
                    <>
                      <p style={{color:"var(--muted)",fontSize:"0.85rem",marginBottom:18}}>
                        {addingProj ? "New project" : `Editing: ${editingProj.title}`}
                      </p>
                      <ProjectForm project={editingProj} onSave={saveProject}
                        onCancel={()=>{setEditingProj(null);setAddingProj(false);}}/>
                    </>
                  )}
                </>
              )}

              {/* SKILLS TAB */}
              {adminTab==="skills" && (
                <div style={{display:"flex",flexDirection:"column",gap:14}}>
                  {skills.map((s,si)=>(
                    <div key={si} style={{background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:12,padding:18}}>
                      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                        <input value={s.category} onChange={e=>setSkills(sk=>{const n=[...sk];n[si]={...n[si],category:e.target.value};return n;})}
                          style={{background:"none",border:"none",color:"var(--accent)",fontFamily:"Syne,sans-serif",fontWeight:700,fontSize:"0.85rem",outline:"none",flex:1}}/>
                        <button onClick={()=>setSkills(sk=>sk.filter((_,i)=>i!==si))}
                          style={{padding:"4px 10px",borderRadius:6,background:"none",border:"1px solid var(--border)",color:"var(--muted)",cursor:"pointer",fontSize:"0.75rem"}}>Remove</button>
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
                  {/* Portrait upload */}
                  <div className="field">
                    <label>Portrait Photo</label>
                    {bio.portrait ? (
                      <div>
                        <img src={bio.portrait} alt="portrait"
                          style={{width:120,height:148,objectFit:"cover",objectPosition:"center top",borderRadius:12,border:"1px solid var(--border2)",display:"block",marginBottom:10}}/>
                        <div style={{display:"flex",gap:8}}>
                          <label style={{padding:"6px 14px",borderRadius:7,background:"var(--bg3)",border:"1px solid var(--border2)",color:"var(--text)",cursor:"pointer",fontSize:"0.8rem",fontFamily:"Syne,sans-serif",fontWeight:600}}>
                            Change photo
                            <input type="file" accept="image/*" style={{display:"none"}} onChange={e=>{
                              const f=e.target.files[0]; if(!f) return;
                              handlePortraitUpload(f);
                            }}/>
                          </label>
                          <button onClick={handlePortraitRemove}
                            style={{padding:"6px 14px",borderRadius:7,background:"rgba(255,92,92,0.1)",border:"1px solid var(--danger)",color:"var(--danger)",cursor:"pointer",fontSize:"0.8rem",fontFamily:"Syne,sans-serif",fontWeight:600}}>
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className="media-drop" style={{cursor:"pointer"}}>
                        <UploadIcon/>
                        <div>Click to upload your portrait photo</div>
                        <div style={{fontSize:"0.74rem",opacity:.6}}>JPG, PNG, WEBP recommended</div>
                        <input type="file" accept="image/*" style={{display:"none"}} onChange={e=>{
                          const f=e.target.files[0]; if(!f) return;
                          handlePortraitUpload(f);
                        }}/>
                      </label>
                    )}
                  </div>
                  {/* Portrait URL alternative */}
                  <div className="field">
                    <label>Or paste photo URL</label>
                    <div style={{display:"flex",gap:8}}>
                      <input id="portrait-url-input" placeholder="https://…/your-photo.jpg"
                        style={{flex:1,background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:8,padding:"10px 14px",color:"var(--text)",fontSize:"0.875rem",fontFamily:"DM Sans,sans-serif",outline:"none"}}/>
                      <button onClick={()=>{const v=document.getElementById("portrait-url-input").value.trim();if(v)setBio(b=>({...b,portrait:v}));}}
                        style={{padding:"10px 18px",borderRadius:8,background:"var(--bg3)",border:"1px solid var(--border2)",color:"var(--text)",cursor:"pointer",fontSize:"0.85rem",fontFamily:"Syne,sans-serif",fontWeight:600}}>
                        Use
                      </button>
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
