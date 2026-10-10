import { useState } from "react";

export const detailHref = (type, record) => `#/${type}/${type === "projects" ? record.slug : type === "interns" ? record.internId : record.eventId}`;
export const assetUrl = url => url?.startsWith("/uploads/") ? `${(import.meta.env.VITE_API_URL || "").replace(/\/$/, "")}${url}` : url;
export const dateLabel = value => value ? new Intl.DateTimeFormat("th-TH", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value)) : "ปัจจุบัน";
const safeLink = url => /^(https?:\/\/|mailto:|\/)/i.test(url || "") ? url : undefined;

export function Description({ text }) {
  return <div className="detail-prose">{(text || "").split(/\n\s*\n/).filter(Boolean).map((paragraph, index) => <p key={index}>{paragraph.split(/(https?:\/\/[^\s]+)/g).map((part, i) => /^https?:\/\//.test(part) ? <a key={i} href={part} target="_blank" rel="noreferrer">{part}</a> : part)}</p>)}</div>;
}

export default function RecordDetail({ type, record, data }) {
  const [photo, setPhoto] = useState(null);
  const isProject = type === "projects";
  const isIntern = type === "interns";
  const title = isIntern ? record.position : record.title;
  const cover = isIntern ? record.companyLogoURL : record.imageURL;
  const images = [...new Set([...(isProject && cover ? [cover] : []), ...(record.gallery || [])])];
  const tags = record.techStacks || [];
  const linked = isProject
    ? [...(record.internships || []).map(link => ({ type: "interns", record: data.interns.find(r => r.internId === link.internId) })), ...(record.events || []).map(link => ({ type: "events", record: data.events.find(r => r.eventId === link.eventId) }))]
    : (record.projects || []).map(link => ({ type: "projects", record: data.projects.find(r => r.projectId === link.projectId) }));
  const facts = [["ช่วงเวลา", `${dateLabel(record.startDate)} – ${dateLabel(record.endDate)}`], ["หน้าที่", isIntern ? record.position : record.role], ["สถานะ / ประเภท", record.status || record.employmentType || record.eventType], ["บริษัท / ผู้จัด", record.companyName || record.organizer], ["สถานที่", record.location], ["รูปแบบ", record.workMode], ["ผลลัพธ์", record.result]];
  const links = [["เว็บไซต์โปรเจกต์", record.webURL], ["Source code", record.repositoryURL], ["เว็บไซต์บริษัท", record.companyURL], ["เว็บไซต์กิจกรรม", record.eventURL], ["ใบรับรอง", record.certificateURL]];
  return <article className="record-detail container">
    <a className="text-link detail-back" href={isProject ? "#work" : "#journey"}>← กลับหน้าหลัก</a>
    <header className="detail-heading"><span className="section-kicker">{isProject ? "PROJECT NOTES" : isIntern ? "INTERNSHIP JOURNAL" : "EVENT JOURNAL"}</span><h1 tabIndex={-1}>{title}</h1>{(record.companyName || record.organizer) && <p className="detail-subtitle">{record.companyName || record.organizer}</p>}{record.shortDescription && <p className="detail-intro">{record.shortDescription}</p>}</header>
    {cover && <div className={`detail-cover ${isIntern ? "company-cover" : ""}`}><img src={assetUrl(cover)} alt={isIntern ? `โลโก้ ${record.companyName}` : `ภาพปก ${title}`} /></div>}
    <div className="detail-layout"><div className="detail-body"><section><h2>เรื่องราวและการทำงาน</h2>{record.description ? <Description text={record.description} /> : <p className="detail-muted">ยังไม่มีรายละเอียดเพิ่มเติม</p>}</section>
      {[["หน้าที่รับผิดชอบ", record.responsibilities], ["ผลงานและสิ่งที่ได้เรียนรู้", record.achievements]].map(([heading, items]) => items?.length > 0 && <section key={heading}><h2>{heading}</h2><ul className="detail-list">{items.map((item, index) => <li key={index}>{item}</li>)}</ul></section>)}
      {images.length > 0 && <section><h2>ภาพจากโปรเจกต์และการทำงาน</h2><div className="detail-gallery">{images.map((url, index) => <button key={url} onClick={() => setPhoto({ url, index })} aria-label={`เปิดภาพ ${index + 1} แบบเต็ม`}><img src={assetUrl(url)} alt={`${title} ภาพที่ ${index + 1}`} loading="lazy" /><span>ดูภาพเต็ม ↗</span></button>)}</div></section>}
      {linked.some(item => item.record) && <section><h2>{isProject ? "ประสบการณ์ที่เกี่ยวข้อง" : "โปรเจกต์ที่ทำ"}</h2><div className="related-records">{linked.filter(item => item.record).map(item => <a key={`${item.type}-${item.record.projectId || item.record.internId || item.record.eventId}`} href={detailHref(item.type, item.record)}><span>{item.record.title || item.record.companyName}</span><span>ดูรายละเอียด →</span></a>)}</div></section>}
    </div><aside className="detail-sidebar"><section><h2>ข้อมูลการทำงาน</h2><dl>{facts.filter(([, value]) => value).map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{String(value).replaceAll("_", " ")}</dd></div>)}</dl></section><section><h2>Tech Stack</h2><div className="tag-row">{tags.map(item => <span className="tag" key={item.techstackId}>{item.techStack?.name}</span>)}</div></section>{links.some(([, url]) => safeLink(url)) && <section className="detail-links"><h2>ลิงก์เพิ่มเติม</h2>{links.filter(([, url]) => safeLink(url)).map(([label, url]) => <a key={label} href={safeLink(url)} target="_blank" rel="noreferrer">{label} ↗</a>)}</section>}</aside></div>
    {photo && <div className="photo-dialog" role="dialog" aria-modal="true" aria-label="ภาพเต็ม" onClick={() => setPhoto(null)} onKeyDown={event => { if (event.key === "Escape") setPhoto(null); if (event.key === "Tab") event.preventDefault(); }}><button autoFocus className="photo-close" onClick={() => setPhoto(null)} aria-label="ปิดภาพ">×</button><img src={assetUrl(photo.url)} alt={`${title} ภาพที่ ${photo.index + 1}`} /></div>}
  </article>;
}
