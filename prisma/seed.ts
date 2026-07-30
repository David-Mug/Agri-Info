import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("password123", 12);

  const categories = await Promise.all(
    [
      "Vegetables",
      "Fruits",
      "Grains",
      "Tubers",
      "Legumes",
      "Dairy",
    ].map((name) =>
      prisma.category.upsert({
        where: { name },
        update: {},
        create: { name, slug: name.toLowerCase() },
      })
    )
  );

  const admin = await prisma.user.upsert({
    where: { email: "admin@agrinfo.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@agrinfo.com",
      passwordHash,
      role: "ADMIN",
    },
  });

  const farmerUser = await prisma.user.upsert({
    where: { email: "farmer@agrinfo.com" },
    update: {},
    create: {
      name: "Jean Baptiste Uwimana",
      email: "farmer@agrinfo.com",
      passwordHash,
      role: "FARMER",
      phone: "+250788123456",
      farmerProfile: {
        create: {
          farmName: "Uwimana Farms",
          bio: "Growing fresh vegetables and fruits in Musanze since 2015.",
          location: "Musanze, Rwanda",
        },
      },
    },
    include: { farmerProfile: true },
  });

  const buyerUser = await prisma.user.upsert({
    where: { email: "buyer@agrinfo.com" },
    update: {},
    create: {
      name: "Alice Mukamana",
      email: "buyer@agrinfo.com",
      passwordHash,
      role: "BUYER",
      phone: "+250788654321",
      buyerProfile: {
        create: {
          companyName: "Kigali Fresh Market",
          location: "Kigali, Rwanda",
        },
      },
    },
    include: { buyerProfile: true },
  });

  const farmerProfile = await prisma.farmerProfile.findUniqueOrThrow({
    where: { userId: farmerUser.id },
  });

  const vegCategory = categories.find((c) => c.name === "Vegetables")!;
  const fruitCategory = categories.find((c) => c.name === "Fruits")!;
  const grainCategory = categories.find((c) => c.name === "Grains")!;

  await prisma.product.createMany({
    data: [
      {
        name: "Fresh Irish Potatoes",
        description:
          "High-quality Irish potatoes harvested this week, perfect for wholesale and retail.",
        price: 450,
        quantity: 500,
        unit: "kg",
        images: [],
        availability: "IN_STOCK",
        location: "Musanze, Rwanda",
        categoryId: vegCategory.id,
        farmerId: farmerProfile.id,
      },
      {
        name: "Ripe Bananas",
        description: "Sweet, farm-fresh bananas ready for immediate delivery.",
        price: 300,
        quantity: 200,
        unit: "kg",
        images: [],
        availability: "IN_STOCK",
        location: "Musanze, Rwanda",
        categoryId: fruitCategory.id,
        farmerId: farmerProfile.id,
      },
      {
        name: "Maize Grain",
        description: "Dried maize grain, cleaned and ready for milling.",
        price: 380,
        quantity: 1000,
        unit: "kg",
        images: [],
        availability: "IN_STOCK",
        location: "Musanze, Rwanda",
        categoryId: grainCategory.id,
        farmerId: farmerProfile.id,
      },
    ],
    skipDuplicates: true,
  });

  await prisma.marketPrice.createMany({
    data: [
      {
        crop: "Irish Potatoes",
        currentPrice: 450,
        weeklyChange: 2.5,
        monthlyChange: -1.2,
        supply: "High",
        demand: "Medium",
        unit: "kg",
      },
      {
        crop: "Bananas",
        currentPrice: 300,
        weeklyChange: -0.8,
        monthlyChange: 3.1,
        supply: "Medium",
        demand: "High",
        unit: "kg",
      },
      {
        crop: "Maize",
        currentPrice: 380,
        weeklyChange: 1.1,
        monthlyChange: 0.5,
        supply: "High",
        demand: "High",
        unit: "kg",
      },
      {
        crop: "Beans",
        currentPrice: 700,
        weeklyChange: 4.2,
        monthlyChange: 6.7,
        supply: "Low",
        demand: "High",
        unit: "kg",
      },
    ],
    skipDuplicates: true,
  });

  console.log({ admin: admin.email, farmer: farmerUser.email, buyer: buyerUser.email });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
