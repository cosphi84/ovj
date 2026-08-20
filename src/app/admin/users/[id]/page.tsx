import EditUser from "@/components/admin/edituser";
import { UserProfile } from "@/interface/user";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function EditUserPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const userId = Number(id);

    if (isNaN(userId)) {
        notFound();
    }

    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            id: true,
            name: true,
            email: true,
            active: true,
        },
    });

    if (!user) {
        notFound();
    }

    const usr: UserProfile = user;

    return <EditUser user={usr} />;
}