import Link from "next/link";
import {Job} from "@/interface/job";
import {prisma} from "@/lib/db";

interface PageProps {
  params: Promise<{ id : string }>;
}

export default async function JobDetail({ params }: PageProps) {
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

  if (!job) return <div className="text-center py-8">Job not found</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Link href="/" className="text-blue-500 hover:underline">
            ← Back to Jobs
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6">Job Details - #{job.id}</h2>

        <div className="grid grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="col-span-2 bg-white p-6 rounded shadow">
            <h3 className="text-xl font-bold mb-4">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-gray-600 font-semibold">Category:</label>
                <p>{job.category.name}</p>
              </div>
              <div>
                <label className="text-gray-600 font-semibold">
                  Notification (No LR):
                </label>
                <p>{job.notification}</p>
              </div>
              <div>
                <label className="text-gray-600 font-semibold">Model:</label>
                <p>{job.model || "-"}</p>
              </div>
              <div>
                <label className="text-gray-600 font-semibold">
                  Serial Number:
                </label>
                <p>{job.serialNumber || "-"}</p>
              </div>
            </div>
          </div>

          {/* Request Information */}
          <div className="col-span-2 bg-white p-6 rounded shadow">
            <h3 className="text-xl font-bold mb-4">Request Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-gray-600 font-semibold">Symptom:</label>
                <p className="whitespace-pre-wrap">{job.symptom}</p>
              </div>
              <div>
                <label className="text-gray-600 font-semibold">Actions:</label>
                <p className="whitespace-pre-wrap">{job.actions}</p>
              </div>
              <div>
                <label className="text-gray-600 font-semibold">
                  Changed Parts:
                </label>
                <p className="whitespace-pre-wrap">
                  {job.changedParts || "-"}
                </p>
              </div>
            </div>
          </div>

          {/* Requester Information */}
          <div className="col-span-2 bg-white p-6 rounded shadow">
            <h3 className="text-xl font-bold mb-4">Requester Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-gray-600 font-semibold">Sender:</label>
                <p>{job.sender}</p>
              </div>
              <div>
                <label className="text-gray-600 font-semibold">
                  Request By:
                </label>
                <p>{job.requestBy}</p>
              </div>
              <div>
                <label className="text-gray-600 font-semibold">
                  Request On:
                </label>
                <p>{new Date(job.requestOn).toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Approval Status */}
          <div className="bg-white p-6 rounded shadow">
            <h3 className="text-lg font-bold mb-4">Approval</h3>
            <div className="space-y-2">
              <div>
                <span className="text-gray-600 font-semibold">Status:</span>
                <span className={`ml-2 px-2 py-1 rounded text-white ${
                  job.approvedOn ? "bg-green-500" : "bg-gray-400"
                }`}>
                  {job.approvedOn ? "✓ Approved" : "Pending"}
                </span>
              </div>
              {job.approvedOn && (
                <>
                  <div>
                    <span className="text-gray-600 font-semibold">By:</span>
                    <p>{job.approvedByUser?.name}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 font-semibold">On:</span>
                    <p>{new Date(job.approvedOn).toLocaleString()}</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Received Status */}
          <div className="bg-white p-6 rounded shadow">
            <h3 className="text-lg font-bold mb-4">Received</h3>
            <div className="space-y-2">
              <div>
                <span className="text-gray-600 font-semibold">Status:</span>
                <span className={`ml-2 px-2 py-1 rounded text-white ${
                  job.receivedOn ? "bg-green-500" : "bg-gray-400"
                }`}>
                  {job.receivedOn ? "✓ Received" : "Pending"}
                </span>
              </div>
              {job.receivedOn && (
                <>
                  <div>
                    <span className="text-gray-600 font-semibold">By:</span>
                    <p>{job.receivedByUser?.name}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 font-semibold">On:</span>
                    <p>{new Date(job.receivedOn).toLocaleString()}</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Handled Status */}
          <div className="col-span-2 bg-white p-6 rounded shadow">
            <h3 className="text-lg font-bold mb-4">Handled</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-gray-600 font-semibold">Status:</span>
                <span className={`ml-2 px-2 py-1 rounded text-white ${
                  job.handledOn ? "bg-green-500" : "bg-gray-400"
                }`}>
                  {job.handledOn ? "✓ Handled" : "Pending"}
                </span>
              </div>
              {job.handledOn && (
                <>
                  <div>
                    <span className="text-gray-600 font-semibold">By:</span>
                    <p>{job.handledByUser?.name}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 font-semibold">On:</span>
                    <p>{new Date(job.handledOn).toLocaleString()}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-600 font-semibold">Result:</span>
                    <span className={`ml-2 px-2 py-1 rounded text-white ${
                      job.result === "OK" ? "bg-green-500" : "bg-red-500"
                    }`}>
                      {job.result || "-"}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-600 font-semibold">
                      Action Taken:
                    </span>
                    <p className="whitespace-pre-wrap">
                      {job.actionTakenByTC || "-"}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Send Back Status */}
          <div className="bg-white p-6 rounded shadow">
            <h3 className="text-lg font-bold mb-4">Send Back</h3>
            <div className="space-y-2">
              <div>
                <span className="text-gray-600 font-semibold">Status:</span>
                <span className={`ml-2 px-2 py-1 rounded text-white ${
                  job.sendBackOn ? "bg-green-500" : "bg-gray-400"
                }`}>
                  {job.sendBackOn ? "✓ Sent" : "Pending"}
                </span>
              </div>
              {job.sendBackOn && (
                <>
                  <div>
                    <span className="text-gray-600 font-semibold">AWB:</span>
                    <p>{job.awbNumber || "-"}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 font-semibold">By:</span>
                    <p>{job.sentBackByUser?.name}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 font-semibold">On:</span>
                    <p>{new Date(job.sendBackOn).toLocaleString()}</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Completed Status */}
          <div className="bg-white p-6 rounded shadow">
            <h3 className="text-lg font-bold mb-4">Completed</h3>
            <div className="space-y-2">
              <div>
                <span className="text-gray-600 font-semibold">Status:</span>
                <span className={`ml-2 px-2 py-1 rounded text-white ${
                  job.completedOn ? "bg-green-500" : "bg-gray-400"
                }`}>
                  {job.completedOn ? "✓ Completed" : "Pending"}
                </span>
              </div>
              {job.completedOn && (
                <>
                  <div>
                    <span className="text-gray-600 font-semibold">By:</span>
                    <p>{job.completedByUser?.name}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 font-semibold">On:</span>
                    <p>{new Date(job.completedOn).toLocaleString()}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
