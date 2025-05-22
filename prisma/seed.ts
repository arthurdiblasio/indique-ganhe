import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // cria o parceiro
  const partner = await prisma.partner.create({
    data: {
      name: "Studio Fernanda RAbelo",
      cnpj: "37939958000152",
    },
  });

  // cria o usuário com senha hash
  const hashedPassword = await bcrypt.hash("studio2025", 10);

  await prisma.user.create({
    data: {
      email: "studiofernandarabelo@gmail.com",
      password: hashedPassword,
      partnerId: partner.id,
    },
  });

  // // cria pessoas
  // const joao = await prisma.person.create({
  //   data: {
  //     name: "João Silva",
  //     phone: "11999990001",
  //     partnerId: partner.id,
  //   },
  // });

  // const maria = await prisma.person.create({
  //   data: {
  //     name: "Maria Souza",
  //     phone: "11999990002",
  //     partnerId: partner.id,
  //   },
  // });

  // const ana = await prisma.person.create({
  //   data: {
  //     name: "Ana Oliveira",
  //     phone: "11999990003",
  //     partnerId: partner.id,
  //   },
  // });

  // // cria indicações
  // await prisma.indication.createMany({
  //   data: [
  //     {
  //       procedure: "Criolipólise",
  //       planValue: 500.0,
  //       commissionValue: 100.0,
  //       indicatedId: maria.id,
  //       indicatedById: joao.id,
  //     },
  //     {
  //       procedure: "Ozonioterapia",
  //       planValue: 300.0,
  //       commissionValue: 60.0,
  //       indicatedId: ana.id,
  //       indicatedById: joao.id,
  //     },
  //   ],
  // });
}

main()
  .then(() => {
    console.log("✅ Seed finalizado.");
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
