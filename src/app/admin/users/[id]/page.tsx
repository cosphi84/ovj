import EditUser from "@/components/admin/edituser";
import { UserProfile } from "@/interface/user";
import { ApiUrlUserEdit } from "@/schema/user";
import { notFound } from "next/navigation";

export default async function EditUserPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const theId = Number(id);

    if (isNaN(theId)) {
        notFound();
    }

    const response = await fetch(ApiUrlUserEdit(theId));

    if (!response.ok) {
        if (response.status === 404) {
            notFound();
        }

        throw new Error("Failed to fetch user");
    }

    const usr: UserProfile = await response.json();

    return <EditUser user={usr} />;
}