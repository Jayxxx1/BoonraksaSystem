import { defineConfig } from '@prisma/config';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// 1. ตั้งค่าให้หาไฟล์ .env เจอแน่นอน ไม่ว่าจะรันจากโฟลเดอร์ไหน
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') }); 

export default defineConfig({
  migrations: {
    seed: {
      command: "node prisma/seed.js"
    }
  },
  
  earlyAccess: true, 
  schema: './prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL, 
  },
});