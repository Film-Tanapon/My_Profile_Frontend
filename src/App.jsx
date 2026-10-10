import { useEffect, useMemo, useState } from "react";
import "./App.css";
import "./Details.css";
import { recordTheme } from "./theme";
import RecordDetail, { detailHref, dateLabel } from "./RecordDetail";

const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
const fallbackProfile = {
  displayName: "Film", firstName: "Thanaphon", lastName: "Ubonthat",
  headline: "Backend & Systems Developer",
  biography: "ผมชอบลองทำสิ่งใหม่ ๆ และเรียนรู้เรื่องที่ยังไม่เคยรู้ ผ่านการลงมือทำจริง เพื่อพัฒนาตัวเองให้เก่งขึ้นทีละก้าว",
  profileImageURL: "/images/film_picture.JPG", location: "Bangkok, Thailand",
  availabilityStatus: "OPEN_TO_WORK", email: "film@example.com", socialLinks: [], educations: [],
};

const get = async (resource) => {
  const response = await fetch(`${API_BASE}/api/${resource}`);
  const body = await response.json();
  if (!response.ok || !body.success) throw new Error(body.message || `Cannot load ${resource}`);
  return body.data;
};
const assetUrl = (url) => url?.startsWith("/uploads/") ? `${API_BASE}${url}` : url;
const formatDate = (value) => value ? new Intl.DateTimeFormat("th-TH", { month: "short", year: "numeric" }).format(new Date(value)) : "ปัจจุบัน";

function ProjectCard({ project, index }) {
  const tags = project.techStacks?.map(item => item.techStack?.name).filter(Boolean) || [];
  return <article className={`project-summary ${(project.themeColor || project.fontColor) ? "custom-theme" : ""}`} style={recordTheme(project.themeColor, project.dotColor, project.fontColor)}><a className={`project-thumbnail art-${["violet", "coral", "cyan", "amber"][index % 4]}`} href={detailHref("projects", project)} aria-label={`ดูรายละเอียด ${project.title}`}>{project.imageURL ? <img src={assetUrl(project.imageURL)} alt={`ภาพโปรเจกต์ ${project.title}`} /> : <span className="thumbnail-placeholder" aria-hidden="true">{["⚔", "✦", "⌖", "◆"][index % 4]}</span>}</a><div className="project-summary-copy"><span className="project-meta">{project.status}</span><h3>{project.title}</h3><p>{project.shortDescription || "ดูรายละเอียดการทำงานของโปรเจกต์นี้"}</p><div className="tag-row">{tags.map(tag => <span className="tag" key={tag}>{tag}</span>)}</div><div className="summary-bottom"><span>{dateLabel(project.startDate)} – {dateLabel(project.endDate)}</span><a className="button" href={detailHref("projects", project)}>ดูรายละเอียด <span>→</span></a></div></div></article>;
}

function TimelineCard({ item }) {
  const isEducation = item.kind === "EDUCATION";
  const isInternship = item.kind === "INTERNSHIP";
  const imageURL = isEducation ? item.institutionLogoURL : isInternship ? item.companyLogoURL : item.imageURL;
  const facts = isEducation
    ? [item.educationLevel, item.degree, item.grade && `GPA ${item.grade}`, item.location, item.isCurrent && "CURRENT"]
    : isInternship
      ? [item.employmentType, item.workMode, item.location]
      : [item.role, item.result, item.workMode, item.location];
  const tags = item.techStacks?.map(entry => entry.techStack?.name).filter(Boolean) || [];
  const notes = [];
  return <article className="timeline-card"><span className="timeline-node" /><div className="timeline-date">{formatDate(item.startDate)} — {item.isCurrent ? "ปัจจุบัน" : formatDate(item.endDate)}</div><div className={`journey-content ${!isEducation && (item.themeColor || item.fontColor) ? "custom-theme" : ""}`} style={!isEducation ? recordTheme(item.themeColor, item.dotColor, item.fontColor) : undefined}>
    <div className={`journey-logo ${imageURL ? "has-image" : ""}`}>{imageURL ? <img src={assetUrl(imageURL)} alt="" /> : <span>{item.subtitle?.slice(0, 2).toUpperCase()}</span>}</div>
    <div className="journey-main"><span className="project-meta">{item.kind}</span><h3>{item.title}</h3><strong>{item.subtitle}</strong>
      <div className="fact-row">{facts.filter(Boolean).map(fact => <span key={fact}>{String(fact).replaceAll("_", " ")}</span>)}</div>
      {item.description && <p>{isEducation ? item.description : `${item.description.slice(0, 180)}${item.description.length > 180 ? "…" : ""}`}</p>}
      {notes.length > 0 && <ul>{notes.map(note => <li key={note}>{note}</li>)}</ul>}
      {tags.length > 0 && <div className="journey-tags">{tags.map(tag => <span className="tag" key={tag}>{tag}</span>)}</div>}
      <div className="journey-actions">
      {isEducation && item.certificateURL && <a className="record-link" href={item.certificateURL} target="_blank" rel="noreferrer">VIEW CERTIFICATE ↗</a>}
      {isInternship && item.companyURL && <a className="record-link" href={item.companyURL} target="_blank" rel="noreferrer">COMPANY WEBSITE ↗</a>}
      {!isEducation && !isInternship && item.eventURL && <a className="record-link" href={item.eventURL} target="_blank" rel="noreferrer">EVENT PAGE ↗</a>}
      {!isEducation && <a className="button journey-detail" href={detailHref(isInternship ? "interns" : "events", item)}>ดูรายละเอียด →</a>}
      </div>
    </div>
  </div></article>;
}

export default function FilmPortfolio() {
  const [data, setData] = useState({ profiles: [], projects: [], techStacks: [], interns: [], events: [], educations: [], socialLinks: [] });
  const [route, setRoute] = useState(() => window.location.hash);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    Promise.allSettled(["profiles", "projects", "tech-stacks", "interns", "events", "educations", "social-links"].map(resource => get(resource)))
      .then(results => {
        if (!active) return;
        const keys = ["profiles", "projects", "techStacks", "interns", "events", "educations", "socialLinks"];
        const next = { profiles: [], projects: [], techStacks: [], interns: [], events: [], educations: [], socialLinks: [] }; let failed = 0;
        results.forEach((result, index) => { if (result.status === "fulfilled") next[keys[index]] = result.value; else failed += 1; });
        setData(next);
        if (failed) setError(`โหลดข้อมูลจาก API ไม่สำเร็จ ${failed} ส่วน`);
      }).finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const update = () => setRoute(window.location.hash);
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, []);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (route.startsWith("#/")) { window.scrollTo(0, 0); document.querySelector(".detail-heading h1")?.focus({ preventScroll: true }); }
      else document.getElementById(route.slice(1))?.scrollIntoView();
    });
    return () => cancelAnimationFrame(frame);
  }, [route, loading]);

  const profile = data.profiles[0] || fallbackProfile;
  const educations = data.educations.length ? data.educations : profile.educations || [];
  const socials = data.socialLinks.length ? data.socialLinks : profile.socialLinks || [];

  const timeline = useMemo(() => [
    ...data.interns.map(item => ({ ...item, kind: "INTERNSHIP", title: item.position, subtitle: item.companyName })),
    ...educations.map(item => ({ ...item, kind: "EDUCATION", title: item.fieldOfStudy || item.degree, subtitle: item.institutionName })),
    ...data.events.map(item => ({ ...item, kind: item.eventType, subtitle: item.organizer || item.location })),
  ].sort((a, b) => new Date(b.startDate) - new Date(a.startDate)), [data.interns, data.events, educations]);
  const sortedTechStacks = useMemo(() => [...data.techStacks].sort((a, b) => {
    const proficiencyDifference = (b.proficiency ?? -1) - (a.proficiency ?? -1);
    return proficiencyDifference || a.name.localeCompare(b.name);
  }), [data.techStacks]);
  const skillGroups = [
    ["Frontend", sortedTechStacks.filter(t => t.category === "FRONTEND" || ["javascript", "typescript", "dart"].includes(t.slug))],
    ["Backend", sortedTechStacks.filter(t => t.category === "BACKEND" || ["go", "python", "javascript", "websocket"].includes(t.slug))],
    ["Database", sortedTechStacks.filter(t => t.category === "DATABASE")],
    ["Tools & Deployment", sortedTechStacks.filter(t => ["DEVOPS", "TOOL", "OTHER"].includes(t.category) && t.slug !== "websocket")],
    ["Languages", sortedTechStacks.filter(t => t.category === "LANGUAGE" && !["javascript", "typescript", "dart", "go", "python"].includes(t.slug))],
  ];
  const routeMatch = route.match(/^#\/(projects|interns|events)\/([^/]+)$/);
  const detailType = routeMatch?.[1];
  const detailRecord = routeMatch && data[detailType].find(r => String(detailType === "projects" ? r.slug : detailType === "interns" ? r.internId : r.eventId) === decodeURIComponent(routeMatch[2]));
  const email = profile.email || "film@example.com";
  const statusText = profile.availabilityStatus === "OPEN_TO_WORK" || profile.availabilityStatus === "AVAILABLE" ? "AVAILABLE FOR A NEW QUEST" : profile.availabilityStatus?.replaceAll("_", " ");

  if (routeMatch) return <main className={`page-shell ${(detailRecord?.themeColor || detailRecord?.fontColor) ? "custom-theme" : ""}`} style={recordTheme(detailRecord?.themeColor, detailRecord?.dotColor, detailRecord?.fontColor)}>{loading ? <div className="loading-panel">กำลังโหลดรายละเอียด...</div> : detailRecord ? <RecordDetail key={route} type={detailType} record={detailRecord} data={data} /> : <div className="empty-state"><h1>ไม่พบรายการนี้</h1><p>{error || "รายการอาจถูกลบหรือเปลี่ยนชื่อ"}</p><a href="#work">กลับหน้าหลัก</a></div>}</main>;

  return <main className="page-shell">
    <div className="noise" /><div className="ambient ambient-one" /><div className="ambient ambient-two" />
    <nav className="nav container" aria-label="Main navigation"><a className="brand" href="#top"><span className="brand-mark">F</span><span>{profile.displayName?.toUpperCase()}<i>.</i></span></a><div className="nav-links"><a href="#work">Work</a><a href="#journey">Journey</a><a href="#skills">Skills</a><a className="nav-cta" href={`mailto:${email}`}>Let’s talk <span>↗</span></a></div></nav>
    {error && <div className="api-alert"><span>!</span>{error} — กำลังแสดงข้อมูลส่วนที่มีอยู่</div>}

    <section className="hero container" id="top">
      <div className="hero-copy"><div className="eyebrow"><span className="status-dot" /> PLAYER 01 · {statusText}</div><h1>I explore new things.<br /><span>Learn. Build. Grow.</span></h1><p className="hero-lead">สวัสดีครับ ผมชื่อ {profile.displayName} — {profile.biography || profile.headline}</p>
        <div className="hero-actions"><a className="button button-primary" href="#work"><span>▶</span> Explore my work</a><a className="text-link" href="#journey">View my journey <span>↓</span></a></div>
        <div className="mini-stats"><div><strong>{String(data.projects.length).padStart(2, "0")}</strong><span>Projects shipped</span></div><div><strong>{String(data.techStacks.length).padStart(2, "0")}</strong><span>Tech abilities</span></div><div><strong>{String(data.events.length).padStart(2, "0")}</strong><span>Events joined</span></div></div>
      </div>
      <div className="player-card-wrap" id="about"><div className="level-badge">LV.<strong>{Math.max(1, data.techStacks.length + data.projects.length)}</strong></div><div className="player-card"><div className="portrait-wrap"><img src={assetUrl(profile.profileImageURL) || fallbackProfile.profileImageURL} alt={profile.displayName} /><span className="scan-line" /></div><div className="player-info"><div><span>CLASS</span><strong>{profile.headline || "Backend Developer"}</strong></div><div><span>BASED IN</span><strong>{profile.location || "Bangkok, TH"}</strong></div></div><div className="skill-block"><div className="skill-title"><span>System sync</span><b>{loading ? "LOADING" : "ONLINE"}</b></div><div className="energy-track"><span className={loading ? "is-loading" : ""} /></div><div className="skill-icons"><span>⌘ Backend</span><span>◈ Database</span><span>⚙ Systems</span></div></div></div><span className="floating-chip chip-code">&lt;/&gt;</span><span className="floating-chip chip-star">✦</span></div>
    </section>

    <section className="work-section" id="work"><div className="container"><div className="section-heading"><div><span className="section-kicker">SELECTED QUESTS / {data.projects.length}</span><h2>Choose your adventure.</h2></div><p>โปรเจกต์ทุกชิ้นดึงข้อมูลจาก Portfolio API พร้อม Tech Stack และสถานะล่าสุดจากฐานข้อมูล</p></div>
      {loading ? <div className="loading-panel"><span /><p>LOADING PROJECTS...</p></div> : data.projects.length ? <div className="project-summary-grid">{data.projects.map((project, index) => <ProjectCard key={project.projectId} project={project} index={index} />)}</div> : <div className="empty-state"><h3>ยังไม่มีโปรเจกต์</h3></div>}</div></section>

    <section className="skills-section container" id="skills"><div className="section-heading"><div><span className="section-kicker">TECH STACK</span><h2>My toolkit.</h2></div><p>เทคโนโลยีที่ใช้พัฒนาระบบ แบ่งตามการใช้งานและเรียงตามความถนัดในแต่ละหมวด</p></div>{skillGroups.filter(([, items]) => items.length).map(([title, items]) => <section className="skill-group" key={title}><div className="skill-group-heading"><h3>{title}</h3><span>{items.length} technologies</span></div><div className="skills-grid">{items.map(tech => <article className="skill-card" key={tech.techstackId} style={{ "--skill-color": tech.color || "#9b8cff" }}><div className="skill-icon">{tech.iconURL ? <img src={assetUrl(tech.iconURL)} alt="" /> : tech.name.slice(0, 2).toUpperCase()}</div><div><span>LV.{tech.proficiency ?? "?"}</span><h3>{tech.name}</h3></div><div className="skill-level" aria-label={`ความถนัด ${tech.proficiency || 0} จาก 5`}>{Array.from({ length: 5 }, (_, item) => <i className={item < (tech.proficiency || 0) ? "filled" : ""} key={item} />)}</div></article>)}</div></section>)}</section>

    {timeline.length > 0 && <section className="journey-section" id="journey"><div className="container"><div className="section-heading"><div><span className="section-kicker">QUEST LOG</span><h2>My journey so far.</h2></div><p>ข้อมูลมหาวิทยาลัย ประสบการณ์ฝึกงาน และกิจกรรม พร้อมรายละเอียดจาก Backend</p></div><div className="timeline">{timeline.map((item, index) => <TimelineCard key={`${item.kind}-${item.internId || item.educationId || item.eventId || index}`} item={item} />)}</div></div></section>}

    <section className="contact container"><span className="contact-icon">✦</span><p>READY FOR THE NEXT LEVEL?</p><h2>Let’s build something<br /><em>that works.</em></h2><a className="button button-primary" href={`mailto:${email}`}>Start a conversation <span>↗</span></a>{socials.length > 0 && <div className="socials">{socials.filter(link => link.isVisible !== false).map(link => <a href={link.url} key={link.socialLinkId} target="_blank" rel="noreferrer">{link.label || link.platform} ↗</a>)}</div>}</section>
    <footer className="footer container"><span>© 2026 {profile.displayName?.toUpperCase()} — ALL RIGHTS RESERVED</span><span>POWERED BY PORTFOLIO API <b>●</b></span></footer>
  </main>;
}
