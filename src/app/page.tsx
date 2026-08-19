"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Pagination } from "@/components/Pagination";
import { apiUrl } from "@/lib/api";

interface Job {
  id: string;
  notification: string;
  category: { name: string };
  model: string | null;
  serialNumber: string | null;
  symptom: string;
  sender: string;
  handledByUser?: { name: string } | null;
}

const ITEMS_PER_PAGE = 10;

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, [currentPage]);

  async function fetchJobs() {
    setLoading(true);
    try {
      const response = await fetch(
        apiUrl(`/api/jobs?page=${currentPage}&limit=${ITEMS_PER_PAGE}&active=true`)
      );
      const data = await response.json();
      setJobs(data.jobs);
      setTotalPages(Math.ceil(data.total / ITEMS_PER_PAGE));
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">OVerjob Technical Center</h1>
          <div className="flex gap-4">
            <Link
              href="/request"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Submit Request
            </Link>
            <Link
              href="/admin/login"
              className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
            >
              Admin Login
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6">Active Job Requests</h2>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No active job requests
          </div>
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
                    <th className="border p-2 text-left">Handled By</th>
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
                      <td className="border p-2">
                        {job.handledByUser?.name || "-"}
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
