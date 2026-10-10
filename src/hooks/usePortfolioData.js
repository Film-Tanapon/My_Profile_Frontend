import {useEffect,useState} from "react";
import {get} from "../services/api";
export default function usePortfolioData(){
  const [data, setData] = useState({ profiles: [], projects: [], techStacks: [], interns: [], events: [], educations: [], socialLinks: [] });
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

  return {data,loading,error};
}
