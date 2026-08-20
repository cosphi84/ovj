import EditUser from "@/components/admin/edituser"
import { UserProfile } from "@/interface/user"
import { ApiUrlUserEdit } from "@/schema/user"
import { notFound } from "next/navigation"

export default async function EditUserPage({ params }: {params : Promise<{id: string}>}){
    const {id} = await params
    const theId = Number(id)
    
    const user = await fetch(ApiUrlUserEdit(theId))
    const usr: UserProfile = await user.json();
    if (!user)
    {
        notFound();
    }

    return <EditUser user={usr} />
}