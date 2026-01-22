const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient({
  datasource: {
    url: process.env.DATABASE_URL
  }
});
// console.log(process.env.DATABASE_URL);
module.exports = prisma;