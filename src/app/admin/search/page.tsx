"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Pagination } from "@/components/Pagination";

interface Job {
  id: string;
  notification: string;
  category: { name: string };
  model: string | null;
  serialNumber: string | null;
  symptom: string;
  sender: string;
}

const ITEMS_PER_PAGE = 10;

export default function SearchResultsPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [jobs, setJobs] = useState<Job[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResults();
  }, [currentPage, query]);

  async function fetchResults() {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/jobs?page=${currentPage}&limit=${ITEMS_PER_PAGE}&q=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      setJobs(data.jobs);
      setTotalPages(Math.ceil(data.total / ITEMS_PER_PAGE));
    } catch (error) {
      console.error("Failed to fetch results:", error);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/admin" className="text-blue-500 hover:underline">
            ← Back to Admin
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6">
          Search Results for "{query}"
        </h2>

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
                          href={`/detail/${job.id}`}
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
    </div>
  );
}
