import bcrypt from "bcryptjs";
import {prisma} from "@/lib/db";

async function main() {
    console.log("🌱 Starting database seed...");

    const password = await bcrypt.hash("PASSWORD", 10);

    const user = await prisma.user.upsert({
        where: {
            email: "risam@seid.sharp-world.com",
        },
        update: {},
        create: {
            name: "Risam",
            email: "risam@seid.sharp-world.com",
            password,
            active: true,
        },
    });

    const category = await prisma.category.upsert({
        where: {
            name: "Overjob TC",
        },
        update: {},
        create: {
            name: "Overjob TC",
            description: "Overjob ke TC",
        },
    });

    console.log("✅ Seed completed");
}

main()
    .catch((error) => {
        console.error("❌ Seed failed:", error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });