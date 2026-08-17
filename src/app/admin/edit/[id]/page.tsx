import Link from "next/link";
import {prisma} from "@/lib/db";
import ActionField from "@/components/admin/action";
import JobDetails from "@/components/admin/Job-details";
import {JobState} from "@/interface/job";
import {notFound} from "next/navigation";

interface Props {
  params: Promise<{id: string}>
}

export default async function AdminEditJob({ params }: Props ) {
  const { id } = await params;
  const job = await prisma.job.findUnique({
    where: {
      id: BigInt(id)
    },
    include: {
      category: true,
      approvedByUser: { select: { name: true } },
      receivedByUser: { select: { name: true } },
      handledByUser: { select: { name: true } },
      sentBackByUser: { select: { name: true } },
      completedByUser: { select: { name: true } },
    }
  });

  if (!job) {
    notFound();
  }


  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Link href="/admin" className="text-blue-500 hover:underline">
            ← Back to Admin
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6">Edit Request Data</h2>

        <JobDetails job={job} />
        <ActionField job={job} />

      </main>
    </div>
  );
}
