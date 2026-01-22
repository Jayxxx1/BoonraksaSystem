// server/prisma/seed.js

// ❌ ของเดิม (ลบออก): import { PrismaClient } from '@prisma/client';
// ✅ ของใหม่ (ใช้แบบนี้):
import pkg from '@prisma/client';
const { PrismaClient } = pkg;

import bcrypt from 'bcryptjs';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});

async function main() {
  console.log('🌱 Start seeding...');

  // 1. สร้าง Categories
  const categoriesData = [
    { name: 'เสื้อช็อป (Shop Shirts)' },
    { name: 'เสื้อโปโล (Polo)' },
    { name: 'เสื้อยืด/คนงาน (T-Shirts)' },
    { name: 'ยูนิฟอร์มราชการ (Official Uniforms)' },
    { name: 'แจ็คเก็ต/สูท (Jackets/Suits)' },
    { name: 'อุปกรณ์ความปลอดภัย (Safety Gear)' },
    { name: 'อื่นๆ (Others)' },
  ];

  for (const c of categoriesData) {
    await prisma.category.create({ data: c });
  }

  // 2. สร้าง Admin
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const adminUser = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword,
      name: 'Super Admin',
      role: 'ADMIN', 
      isActive: true,
    },
  });
  console.log(`👤 Created Admin User: ${adminUser.username}`);

  // 3. สร้างสินค้าตัวอย่าง
  const shopCategory = await prisma.category.findFirst({ where: { name: { contains: 'เสื้อช็อป' } } });

  if (shopCategory) {
    await prisma.product.create({
      data: {
        name: 'เสื้อช็อปแขนยาว A (Example)',
        codePrefix: 'A',
        description: 'เสื้อช็อปเนื้อผ้าดี ทนทาน สำหรับงานช่าง',
        categoryId: shopCategory.id,
        imageUrl: 'https://placehold.co/600x400',
        variants: {
          create: [
            {
              sku: 'A101-M',
              code: 'A101',
              color: 'กรมท่า',
              size: 'M',
              // ⚠️ แก้ตรงนี้ให้ตรงกับ Enum ใน Schema (male/female)
              // ถ้าพี่อยากได้ Unisex ต้องไปแก้ Schema เพิ่ม enum UNISEX
              // แต่ตอนนี้ใส่ 'male' ไปก่อนกัน Error
              gender: 'male', 
              price: 450,
              stock: 100,
              minStock: 10,
              location: 'A1-01'
            },
            {
              sku: 'A101-L',
              code: 'A101',
              color: 'กรมท่า',
              size: 'L',
              gender: 'male',
              price: 450,
              stock: 50,
              minStock: 10,
              location: 'A1-02'
            }
          ]
        }
      }
    });
    console.log(`👕 Created Example Product`);
  }

  console.log('✅ Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });