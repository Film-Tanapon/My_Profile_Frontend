# Film Portfolio — Frontend

เว็บ Portfolio สำหรับแสดงประวัติ Tech Stack โปรเจกต์ การฝึกงาน และกิจกรรม ใช้ React 19 และ Vite โดยข้อมูลมาจาก backend Express/Prisma แยก repository

## สิ่งที่ต้องติดตั้ง

- Node.js 22 และ npm สำหรับพัฒนา
- Docker Engine/Desktop และ Docker Compose สำหรับ deploy
- Backend ที่พร้อมใช้งานบนพอร์ต 3001

## เริ่มพัฒนา

รันคำสั่งจากโฟลเดอร์ frontend:

```sh
npm ci
npm run dev
```

เปิด http://localhost:5173 โดย Vite ส่งต่อ `/api`, `/uploads`, `/health` ไป `http://localhost:3001` ตาม `vite.config.ts` หน้า Admin ระหว่างพัฒนาเปิดที่ http://localhost:3001/admin/ โดยตรง

ไม่ต้องสร้าง .env หากใช้ backend ในเครื่องเดียวกัน หากต้องการ API คนละ URL ให้คัดลอก `.env.example` เป็น `.env` แล้วตั้ง `VITE_API_URL` และรีสตาร์ต Vite ค่า VITE_* จะถูกฝังในไฟล์ frontend ตอน build จึงห้ามใส่รหัสผ่านหรือข้อมูลลับ

## คำสั่ง

| คำสั่ง | การใช้งาน |
|---|---|
| `npm ci` | ติดตั้ง dependencies ตาม package-lock.json |
| `npm run dev` | เริ่มเซิร์ฟเวอร์พัฒนา |
| `npm run lint` | ตรวจโค้ดด้วย ESLint |
| `npm run build` | ตรวจ TypeScript configuration และสร้างไฟล์ dist |
| `npm run preview` | ดูผล build ในเครื่อง ไม่ใช่รูปแบบ deploy หลัก |

## โครงสร้างที่แก้ไขบ่อย

| ไฟล์ | หน้าที่ |
|---|---|
| `src/pages/PortfolioPage.jsx` | หน้าแรกและ hash routes |
| `src/pages/RecordDetail.jsx` | รายละเอียด Project/Intern/Event รูปภาพ และลิงก์ |
| `src/styles/App.css`, `src/styles/Details.css` | Layout รูปแบบตัวอักษร และ responsive |
| `src/utils/theme.js` | สีพื้นหลัง สีจุด และสีตัวอักษรจากข้อมูล backend |
| `vite.config.ts` | Vite และ proxy ระหว่างพัฒนา |
| `Dockerfile` | Build ด้วย Node แล้วเสิร์ฟ dist ด้วย Caddy |
| `Caddyfile` | เสิร์ฟ frontend และส่งต่อ backend |
| `compose.yaml` | พอร์ตและการเริ่ม container |

หน้าเว็บใช้ hash routes เช่น `/#/projects/illusia`, `/#/interns/3`, `/#/events/1` ตัวเลขของ Intern/Event ต้องตรงกับฐานข้อมูลจริง

แก้เนื้อหา รูปภาพ ความสัมพันธ์ Tech Stack หรือสีรายรายการผ่าน Admin ส่วนโครงสร้างหน้าและองค์ประกอบให้แก้ใน src แล้วตรวจ lint/build ก่อน deploy

## Deploy ด้วย Docker

รัน backend บนเครื่องเดียวกันที่พอร์ต 3001 ก่อน แล้วรัน:

```sh
docker compose up -d --build
```

เปิด http://localhost:8080 หน้า Admin เปิดผ่าน http://localhost:8080/admin/ ได้ด้วย Caddy จะส่งต่อ `/api/*`, `/uploads/*`, `/health`, `/admin` และ `/admin/*` ไป backend

ปรับค่าผ่าน .env ของ frontend ได้:

```dotenv
FRONTEND_PORT=8080
BACKEND_UPSTREAM=host.docker.internal:3001
```

Docker ใช้ backend ผ่าน host gateway รองรับ Linux ด้วย extra_hosts ไม่ต้องตั้ง VITE_API_URL ในรูปแบบนี้ และ Docker build ไม่คัดลอกไฟล์ .env เข้า image

พอร์ต frontend ผูกกับ 127.0.0.1 เหมาะกับ Cloudflare Tunnel ที่รันบน host ไม่เปิดให้เข้าผ่าน IP เครื่องจากภายนอกโดยตรง

## Cloudflare Tunnel และหลายเว็บไซต์

เมื่อ cloudflared รันบนเครื่อง host ให้ตั้ง hostname ของ Portfolio ใน Tunnel ไปยัง `http://localhost:8080` ผู้ใช้จะเรียกเว็บ/API/Admin ผ่าน hostname เดียวกัน

ถ้า cloudflared รันใน Docker ให้เชื่อม network เดียวกับ frontend และตั้งบริการเป็น `http://frontend:80` โดยต้องจัด network ร่วมระหว่าง compose ให้เรียบร้อย เพราะ localhost ใน container หมายถึง container นั้นเอง

หลายเว็บไซต์บนเครื่องเดียวกันใช้พอร์ตและ hostname แยกกัน เช่น Portfolio 8080 และอีกเว็บ 8081 หากใช้ compose ไฟล์เดียวกันสำหรับหลายชุด ให้แยก project name เช่น `docker compose -p other-site up -d --build`

## อัปเดตและดูสถานะ

```sh
git pull
docker compose up -d --build
docker compose ps
docker compose logs --tail=100 frontend
```

หยุดด้วย `docker compose down` การหยุด frontend ไม่ลบข้อมูล backend

## แก้ปัญหาเบื้องต้น

- API 502: ตรวจ backend พอร์ต 3001 และค่า BACKEND_UPSTREAM; localhost ภายใน frontend container ใช้แทน backend ไม่ได้
- ไม่พบรูป: ตรวจ URL ใน Admin และ `/uploads` ของ backend; ไฟล์รูปอยู่ใน backend upload volume
- หน้าเว็บยังเป็นรุ่นเดิม: build container ใหม่แล้วรีเฟรช ตรวจ cache ของ browser/Cloudflare หากเปิดไว้
- เข้า Admin ไม่ได้: ใช้ ADMIN_PASSWORD ใน .env ของ backend หากแก้รหัสให้สร้าง backend container ใหม่
- พอร์ตชน: เปลี่ยน FRONTEND_PORT และปรับปลายทาง Tunnel

ไฟล์ .env, node_modules, dist และ artifacts ไม่ต้อง commit ขึ้น Git เก็บ package-lock.json, source และไฟล์ Docker ไว้ใน repository

## การจัดโค้ด frontend

- src/App.jsx: จุดประกอบหน้าเว็บ
- src/pages/: หน้าหลักและหน้ารายละเอียด
- src/components/: ProjectCard, TimelineCard และ Description
- src/hooks/: โหลดข้อมูลด้วย usePortfolioData
- src/services/: API และ URL รูปจาก backend
- src/utils/: คำนวณอายุ สี วันที่ และลิงก์รายละเอียด
- src/config/: ข้อมูล Profile สำรอง
- src/styles/: CSS ที่โหลดจาก main.tsx

แก้รูปแบบรายการใน components แก้เนื้อหาหน้าใน pages แก้การเรียก API ใน services/hooks และแก้ styles ในโฟลเดอร์ styles
