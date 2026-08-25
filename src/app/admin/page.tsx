  "use client";

import {toast} from "@/components/ui/toast";

  export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pagination } from "@/components/Pagination";
import { apiUrl } from "@/lib/api";
  import {ExportData} from "@/components/admin/modal/export";

interface Job {
  id: string;
  notification: string;
  category: { name: string };
  model: string | null;
  serialNumber: string | null;
  symptom: string;
  sender: string;
  completedOn: string | null;
}

const ITEMS_PER_PAGE = 10;

export default function AdminDashboard() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("Active");
  const [searchQuery, setSearchQuery] = useState("");
  const [exporting, setExporting] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);

  useEffect(() => {

     async function fetchJobs() {
    setLoading(true);
    try {
      const active = status === "Active" ? "true" : "false";
      const response = await fetch(apiUrl(
        `/api/jobs?page=${currentPage}&limit=${ITEMS_PER_PAGE}&active=${active}`)
      );
      const data = await response.json();
      setJobs(data.jobs);
      setTotalPages(Math.ceil(data.total / ITEMS_PER_PAGE));
    } catch (error) {
      toast.add({
        title: "Error",
        type: "error",
        description: `Error on loading page: ${error}`,
      })
    }
    setLoading(false);
  }
    fetchJobs();
  }, [currentPage, status]);


  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/admin/search?q=${encodeURIComponent(searchQuery)}`);
    }
  }

  async function handleExportExcel() {
    setExporting(true);
    try {
      const active = status === "Active" ? "true" : "false";
      const response = await fetch(apiUrl(`/api/export?active=${active}`));
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `jobs-${new Date().getTime()}.csv`;
      a.click();
    } catch (error) {
      console.error("Failed to export:", error);
      alert("Failed to export Excel file");
    } finally {
      setExporting(false);
    }
  }

  async function handleLogout() {
    await fetch(apiUrl("/api/auth/logout"), { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white p-6 rounded shadow mb-6">
          <div className="flex gap-4 mb-4">
            <div>
              <label className="block text-gray-600 font-semibold mb-2">
                Status:
              </label>
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="border border-gray-300 rounded px-3 py-2"
              >
                <option>Active</option>
                <option>Completed</option>
              </select>
            </div>
          </div>

          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by notification or model..."
              className="flex-1 border border-gray-300 rounded px-3 py-2"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Search
            </button>
            <button
                type="button"
                onClick={() => setExportModalOpen(true)}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Export
            </button>
          </form>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No jobs found</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="border p-2 text-left">Job #</th>
                    <th className="border p-2 text-left">Category</th>
                    <th className="border p-2 text-left">Notification</th>
                    <th className="border p-2 text-left">Model</th>
                    <th className="border p-2 text-left">Serial Number</th>
                    <th className="border p-2 text-left">Symptom</th>
                    <th className="border p-2 text-left">Sender</th>
                    <th className="border p-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-gray-100">
                      <td className="border p-2">
                        <Link
                          href={`/admin/detail/${job.id}`}
                          className="text-blue-500 hover:underline"
                        >
                          {job.id}
                        </Link>
                      </td>
                      <td className="border p-2">{job.category.name}</td>
                      <td className="border p-2">{job.notification}</td>
                      <td className="border p-2">{job.model || "-"}</td>
                      <td className="border p-2">{job.serialNumber || "-"}</td>
                      <td className="border p-2 truncate max-w-xs">
                        {job.symptom}
                      </td>
                      <td className="border p-2">{job.sender}</td>
                      <td className="border p-2 text-center space-x-2">
                        <Link
                          href={`/admin/edit/${job.id}`}
                          className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                        >
                          Edit
                        </Link>
                        <Link
                          href={`/admin/reset/${job.id}`}
                          className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
                        >
                          Reset
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </main>
      <ExportData open={exportModalOpen} onClose={() => setExportModalOpen(false)} />
    </div>
  );
}
