export const detailHref = (type, record) => `#/${type}/${type === "projects" ? record.slug : type === "interns" ? record.internId : record.eventId}`;
export const dateLabel = value => value ? new Intl.DateTimeFormat("th-TH", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value)) : "ปัจจุบัน";
export const formatDate = (value) => value ? new Intl.DateTimeFormat("th-TH", { month: "short", year: "numeric" }).format(new Date(value)) : "ปัจจุบัน";

