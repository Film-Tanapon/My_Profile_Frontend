import {recordTheme} from "../utils/theme";
import {assetUrl} from "../services/api";
import {detailHref,dateLabel} from "../utils/records";
export default function ProjectCard({ project, index }) {
  const tags = project.techStacks?.map(item => item.techStack?.name).filter(Boolean) || [];
  return <article className={`project-summary ${(project.themeColor || project.fontColor) ? "custom-theme" : ""}`} style={recordTheme(project.themeColor, project.dotColor, project.fontColor)}><a className={`project-thumbnail art-${["violet", "coral", "cyan", "amber"][index % 4]}`} href={detailHref("projects", project)} aria-label={`ดูรายละเอียด ${project.title}`}>{project.imageURL ? <img src={assetUrl(project.imageURL)} alt={`ภาพโปรเจกต์ ${project.title}`} /> : <span className="thumbnail-placeholder" aria-hidden="true">{["⚔", "✦", "⌖", "◆"][index % 4]}</span>}</a><div className="project-summary-copy"><span className="project-meta">{project.status}</span><h3>{project.title}</h3><p>{project.shortDescription || "ดูรายละเอียดการทำงานของโปรเจกต์นี้"}</p><div className="tag-row">{tags.map(tag => <span className="tag" key={tag}>{tag}</span>)}</div><div className="summary-bottom"><span>{dateLabel(project.startDate)} – {dateLabel(project.endDate)}</span><a className="button" href={detailHref("projects", project)}>ดูรายละเอียด <span>→</span></a></div></div></article>;
}

