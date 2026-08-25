"use client";

import { useEffect, useState } from "react";
import { Pagination } from "@/components/Pagination";
import { apiUrl } from "@/lib/api";
import { toast } from "@/components/ui/toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import UserNav from "@/components/user-nav";
import { Table, TableHead, TableBody, TableRow, TableCell, TableHeader, TableFooter } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EyeIcon, MoreHorizontalIcon, SearchIcon, ChevronDownIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { JobResponse } from "@/interface/job";
import StatusJob from "@/components/Status-Job";
import Loading from "@/components/Loading";

const ITEMS_PER_PAGE = 10;

type StatusFilter = "Active" | "Completed";

export default function Home() {
  const [jobs, setJobs] = useState<JobResponse[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState<StatusFilter>("Active");
  const [q, setQ] = useState("");           // nilai mentah di input (controlled)
  const [appliedQ, setAppliedQ] = useState(""); // nilai yang benar-benar dipakai di fetch
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const detail = (id: string) => {
    router.push(`/detail/${id}`);
  };

  const handleSearch = () => {
    setCurrentPage(1);      // reset page, biar nggak nyangkut di halaman kosong
    setAppliedQ(q.trim());
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleStatusChange = (newStatus: StatusFilter) => {
    if (newStatus === status) return;
    setCurrentPage(1);
    setStatus(newStatus);
  };

  useEffect(() => {
    async function fetchJobs() {
      setLoading(true);
      try {
        const activeParam = status === "Active" ? "true" : "false";
        const params = new URLSearchParams({
          page: String(currentPage),
          limit: String(ITEMS_PER_PAGE),
          active: activeParam,
        });
        if (appliedQ) {
          params.set("q", appliedQ);
        }

        const response = await fetch(apiUrl(`/api/jobs?${params.toString()}`));

        if (!response.ok) {
          if (response.status === 503) {
            const data = await response.json().catch(() => null);
            if (data?.code === "DB_UNAVAILABLE") {
              router.push("/error/critical");
              return;
            }
          }
          toast.add({
            title: "Error",
            type: "error",
            description: `Request Failed: ${response.status}`,
          });
          return;
        }

        const data = await response.json();
        setJobs(data.jobs);
        setTotalPages(Math.ceil(data.total / ITEMS_PER_PAGE));
      } catch (error) {
        toast.add({
          title: "Error",
          type: "error",
          description: `Error on loading page: ${error}`,
        });
      }
      setLoading(false);
    }

    fetchJobs();
  }, [currentPage, status, appliedQ, router]);

  return (
      <Card className="mb-5 min-h-screen bg-gray-50 rounded-none">
        <CardHeader>
          <UserNav />
        </CardHeader>
        <CardContent>
          <Card>
            <CardHeader>
              <CardTitle>Job Request</CardTitle>
              <CardDescription>List of Over job Requested</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filter bar: status dropdown + search */}
              <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
                <DropdownMenu>
                  <DropdownMenuTrigger
                      render={
                        <Button variant="outline" className="min-w-[140px] justify-between">
                          {status}
                          <ChevronDownIcon className="size-4 opacity-60" />
                        </Button>
                      }
                  />
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => handleStatusChange("Active")}>
                      Active
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange("Completed")}>
                      Completed
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <div className="flex items-center gap-2">
                  <Input
                      placeholder="Cari job..."
                      value={q}
                      onChange={(e) => setQ(e.target.value)}
                      onKeyDown={handleSearchKeyDown}
                      className="w-64"
                  />
                  <Button onClick={handleSearch} variant="default">
                    <SearchIcon className="size-4" />
                    Cari
                  </Button>
                </div>
              </div>

              {loading ? (
                  <Loading text={"Loading..."} />
              ) : jobs.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No {status === "Active" ? "active" : "completed"} job requests
                    {appliedQ ? ` matching "${appliedQ}"` : ""}
                  </div>
              ) : (
                  <Table border={1}>
                    <TableHeader>
                      <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Notification</TableHead>
                        <TableHead>Model / SN</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Sender</TableHead>
                        <TableHead>Progress</TableHead>
                        <TableHead>Result</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {jobs.map((job, index) => (
                          <TableRow key={job.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{job.category.name}</TableCell>
                            <TableCell>{job.notification}</TableCell>
                            <TableCell>
                              {job.model} /
                              {job.serialNumber}
                            </TableCell>
                            <TableCell>{job.symptom}</TableCell>
                            <TableCell>{job.sender}</TableCell>
                            <TableCell><StatusJob job={job} /></TableCell>
                            <TableCell>{job.result ?? "-"}</TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger
                                    render={
                                      <Button variant="ghost" size={"icon"} className="size-8">
                                        <MoreHorizontalIcon />
                                        <span className="sr-only">Menu</span>
                                      </Button>
                                    }
                                />
                                <DropdownMenuContent align={"end"}>
                                  <DropdownMenuItem onClick={() => detail(job.id)}>
                                    <EyeIcon /> Detail
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                      ))}
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TableCell colSpan={9}>
                          <Pagination
                              currentPage={currentPage}
                              totalPages={totalPages}
                              onPageChange={setCurrentPage}
                          />
                        </TableCell>
                      </TableRow>
                    </TableFooter>
                  </Table>
              )}
            </CardContent>
          </Card>
        </CardContent>
      </Card>
  );
}