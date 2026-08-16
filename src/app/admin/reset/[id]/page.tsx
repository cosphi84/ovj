"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface JobDetail {
  id: string;
  notification: string;
  category: { name: string };
  model: string | null;
  serialNumber: string | null;
  symptom: string;
  actions: string;
  changedParts: string | null;
  sender: string;
  requestBy: string;
  requestOn: string;
}

export default function AdminResetJob({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [job, setJob] = useState<JobDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJob();
  }, [params.id]);

  async function fetchJob() {
    try {
      const response = await fetch(`/api/jobs/${params.id}`);
      const data = await response.json();
      setJob(data);
    } catch (error) {
      console.error("Failed to fetch job:", error);
    }
    setLoading(false);
  }

  async function handleReset(stage: string) {
    if (!confirm("This Action will reset selected Records, and CANNOT be UNDO! Are you Sure?")) {
      return;
    }

    try {
      const response = await fetch(`/api/jobs/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: `reset-${stage}` }),
      });

      if (response.ok) {
        fetchJob();
        alert("Reset successful!");
      }
    } catch (error) {
      console.error("Failed to reset:", error);
      alert("Failed to reset");
    }
  }

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (!job) return <div className="text-center py-8">Job not found</div>;

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
        <h2 className="text-3xl font-bold mb-6">Reset Request Data</h2>

        <div className="bg-white p-6 rounded shadow mb-6">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-gray-600 font-semibold">ID:</label>
              <p className="bg-gray-100 p-2 rounded">{job.id}</p>
            </div>
            <div>
              <label className="text-gray-600 font-semibold">Category:</label>
              <p className="bg-gray-100 p-2 rounded">{job.category.name}</p>
            </div>
            <div>
              <label className="text-gray-600 font-semibold">Notification:</label>
              <p className="bg-gray-100 p-2 rounded">{job.notification}</p>
            </div>
            <div>
              <label className="text-gray-600 font-semibold">Model:</label>
              <p className="bg-gray-100 p-2 rounded">{job.model || "-"}</p>
            </div>
            <div>
              <label className="text-gray-600 font-semibold">Serial Number:</label>
              <p className="bg-gray-100 p-2 rounded">{job.serialNumber || "-"}</p>
            </div>
            <div>
              <label className="text-gray-600 font-semibold">Symptom:</label>
              <p className="bg-gray-100 p-2 rounded">{job.symptom}</p>
            </div>
            <div>
              <label className="text-gray-600 font-semibold">Actions:</label>
              <p className="bg-gray-100 p-2 rounded">{job.actions}</p>
            </div>
            <div>
              <label className="text-gray-600 font-semibold">Changed Parts:</label>
              <p className="bg-gray-100 p-2 rounded">{job.changedParts || "-"}</p>
            </div>
            <div>
              <label className="text-gray-600 font-semibold">Sender:</label>
              <p className="bg-gray-100 p-2 rounded">{job.sender}</p>
            </div>
            <div>
              <label className="text-gray-600 font-semibold">Request By:</label>
              <p className="bg-gray-100 p-2 rounded">{job.requestBy}</p>
            </div>
            <div>
              <label className="text-gray-600 font-semibold">Request On:</label>
              <p className="bg-gray-100 p-2 rounded">{new Date(job.requestOn).toLocaleString()}</p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xl font-bold mb-4">Reset Actions</h3>
            <button
              onClick={() => handleReset("approve")}
              className="w-full px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              Reset Approve
            </button>
            <button
              onClick={() => handleReset("receive")}
              className="w-full px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              Reset Received
            </button>
            <button
              onClick={() => handleReset("handle")}
              className="w-full px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              Reset Handle
            </button>
            <button
              onClick={() => handleReset("sendback")}
              className="w-full px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              Reset Send Back
            </button>
            <button
              onClick={() => handleReset("complete")}
              className="w-full px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              Reset Completed
            </button>
            <Link
              href="/admin"
              className="block text-center px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Back
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
