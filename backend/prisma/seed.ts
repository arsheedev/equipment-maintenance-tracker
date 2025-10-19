import { PrismaClient } from "@prisma-app/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash("asdfasdf", 10);

  await db.user.create({
    data: {
      name: "Admin",
      email: "email@admin.com",
      passwordHash: hash,
      role: "admin",
    },
  });
  await db.user.create({
    data: {
      name: "Technician",
      email: "email@technician.com",
      passwordHash: hash,
      role: "technician",
    },
  });
}

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
