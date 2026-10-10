import {recordTheme} from "../utils/theme";
import {assetUrl} from "../services/api";
import {detailHref,formatDate} from "../utils/records";
export default function TimelineCard({ item }) {
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

