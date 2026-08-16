import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {prisma} from "@/lib/db";

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

  /*
  const router = useRouter();
  const [job, setJob] = useState<JobDetail | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<Modal>({ type: null, open: false });
  const [handleFormData, setHandleFormData] = useState({
    handledBy: "",
    handledOn: "",
    result: "",
    actionTakenByTC: "",
  });
  const [sendbackFormData, setSendbackFormData] = useState({
    awbNumber: "",
    sendBackOn: "",
    sentBackBy: "",
  });

  useEffect(() => {
    fetchJob();
    fetchUsers();
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

  async function fetchUsers() {
    try {
      const response = await fetch("/api/users");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  }

  async function handleApprove() {
    if (!confirm("Approve this job?")) return;
    try {
      const response = await fetch(`/api/jobs/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve" }),
      });
      if (response.ok) {
        fetchJob();
      }
    } catch (error) {
      console.error("Failed to approve:", error);
    }
  }

  async function handleReceived() {
    if (!confirm("Mark as received?")) return;
    try {
      const response = await fetch(`/api/jobs/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "receive" }),
      });
      if (response.ok) {
        fetchJob();
      }
    } catch (error) {
      console.error("Failed to receive:", error);
    }
  }

  async function handleHandle() {
    if (!handleFormData.handledBy || !handleFormData.handledOn || !handleFormData.result) {
      alert("Please fill in all required fields");
      return;
    }
    try {
      const response = await fetch(`/api/jobs/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "handle",
          ...handleFormData,
        }),
      });
      if (response.ok) {
        fetchJob();
        setModal({ type: null, open: false });
      }
    } catch (error) {
      console.error("Failed to handle:", error);
    }
  }

  async function handleSendback() {
    if (!sendbackFormData.sentBackBy || !sendbackFormData.sendBackOn) {
      alert("Please fill in all required fields");
      return;
    }
    try {
      const response = await fetch(`/api/jobs/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "sendback",
          ...sendbackFormData,
        }),
      });
      if (response.ok) {
        fetchJob();
        setModal({ type: null, open: false });
      }
    } catch (error) {
      console.error("Failed to send back:", error);
    }
  }

  async function handleComplete() {
    if (!confirm("Mark as completed?")) return;
    try {
      const response = await fetch(`/api/jobs/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "complete" }),
      });
      if (response.ok) {
        fetchJob();
      }
    } catch (error) {
      console.error("Failed to complete:", error);
    }
  }

  if (loading) return <div className="text-center py-8">Loading...</div>;
  */
  if (!job) return <div className="text-center py-8">Job not found</div>;

  const canApprove = !job.approvedOn;
  const canReceive = !job.receivedOn && job.approvedOn;
  const canHandle = !job.handledOn && job.receivedOn && job.approvedOn;
  const canSendback = !job.sendBackOn && job.approvedOn && job.receivedOn && job.handledOn;
  const canComplete = !job.completedOn && job.sendBackOn && job.approvedOn && job.receivedOn && job.handledOn;

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

        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Basic Information */}
          <div className="col-span-2 bg-white p-6 rounded shadow">
            <div className="grid grid-cols-2 gap-4">
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
          </div>

          {/* Action Buttons */}
          <div className="col-span-2 bg-white p-6 rounded shadow">
            <h3 className="text-xl font-bold mb-4">Actions</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleApprove}
                disabled={!canApprove}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              >
                Approve
              </button>
              <button
                onClick={handleReceived}
                disabled={!canReceive}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              >
                Received
              </button>
              <button
                onClick={() => { setModal({ type: "handle", open: true }); }}
                disabled={!canHandle}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              >
                Handle
              </button>
              <button
                onClick={() => { setModal({ type: "sendback", open: true }); }}
                disabled={!canSendback}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              >
                Send Back
              </button>
              <button
                onClick={handleComplete}
                disabled={!canComplete}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
              >
                Set Completed
              </button>
            </div>
          </div>

          {/* Status Information */}
          <div className="bg-white p-6 rounded shadow">
            <h3 className="font-bold mb-2">Approval</h3>
            <p>{job.approvedOn ? "✓ Approved" : "Pending"}</p>
            {job.approvedOn && <p className="text-sm text-gray-600">{new Date(job.approvedOn).toLocaleString()}</p>}
          </div>

          <div className="bg-white p-6 rounded shadow">
            <h3 className="font-bold mb-2">Received</h3>
            <p>{job.receivedOn ? "✓ Received" : "Pending"}</p>
            {job.receivedOn && <p className="text-sm text-gray-600">{new Date(job.receivedOn).toLocaleString()}</p>}
          </div>

          <div className="bg-white p-6 rounded shadow">
            <h3 className="font-bold mb-2">Handled</h3>
            <p>{job.handledOn ? "✓ Handled" : "Pending"}</p>
            {job.handledOn && <p className="text-sm text-gray-600">{job.result}</p>}
          </div>

          <div className="bg-white p-6 rounded shadow">
            <h3 className="font-bold mb-2">Send Back</h3>
            <p>{job.sendBackOn ? "✓ Sent Back" : "Pending"}</p>
            {job.awbNumber && <p className="text-sm text-gray-600">AWB: {job.awbNumber}</p>}
          </div>

          <div className="bg-white p-6 rounded shadow">
            <h3 className="font-bold mb-2">Completed</h3>
            <p>{job.completedOn ? "✓ Completed" : "Pending"}</p>
            {job.completedOn && <p className="text-sm text-gray-600">{new Date(job.completedOn).toLocaleString()}</p>}
          </div>
        </div>

        {/* Handle Modal */}
        {modal.open && modal.type === "handle" && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow max-w-md w-full">
              <h3 className="text-xl font-bold mb-4">Handle Job</h3>
              <div className="space-y-4">
                <div>
                  <label className="block font-semibold mb-2">Handled By *</label>
                  <select
                    value={handleFormData.handledBy}
                    onChange={(e) => setHandleFormData({...handleFormData, handledBy: e.target.value})}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  >
                    <option value="">Select User</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>{user.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-2">Handled On *</label>
                  <input
                    type="datetime-local"
                    value={handleFormData.handledOn}
                    onChange={(e) => setHandleFormData({...handleFormData, handledOn: e.target.value})}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2">Result *</label>
                  <div className="space-x-4">
                    <label>
                      <input
                        type="radio"
                        name="result"
                        value="OK"
                        checked={handleFormData.result === "OK"}
                        onChange={(e) => setHandleFormData({...handleFormData, result: e.target.value})}
                      />
                      OK
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="result"
                        value="FAILED"
                        checked={handleFormData.result === "FAILED"}
                        onChange={(e) => setHandleFormData({...handleFormData, result: e.target.value})}
                      />
                      FAILED
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block font-semibold mb-2">Perbaikan yang dilakukan</label>
                  <textarea
                    value={handleFormData.actionTakenByTC}
                    onChange={(e) => setHandleFormData({...handleFormData, actionTakenByTC: e.target.value})}
                    rows={3}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleHandle}
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setModal({type: null, open: false})}
                    className="flex-1 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Send Back Modal */}
        {modal.open && modal.type === "sendback" && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow max-w-md w-full">
              <h3 className="text-xl font-bold mb-4">Send Back</h3>
              <div className="space-y-4">
                <div>
                  <label className="block font-semibold mb-2">AWB Number</label>
                  <input
                    type="text"
                    value={sendbackFormData.awbNumber}
                    onChange={(e) => setSendbackFormData({...sendbackFormData, awbNumber: e.target.value})}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2">Send Back On *</label>
                  <input
                    type="date"
                    value={sendbackFormData.sendBackOn}
                    onChange={(e) => setSendbackFormData({...sendbackFormData, sendBackOn: e.target.value})}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2">Send By *</label>
                  <select
                    value={sendbackFormData.sentBackBy}
                    onChange={(e) => setSendbackFormData({...sendbackFormData, sentBackBy: e.target.value})}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  >
                    <option value="">Select User</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>{user.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSendback}
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setModal({type: null, open: false})}
                    className="flex-1 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
