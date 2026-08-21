"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Pagination } from "@/components/Pagination";
import { apiUrl } from "@/lib/api";
import {toast} from "@/components/ui/toast";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import UserNav from "@/components/user-nav";
import {Table, TableHead, TableBody, TableRow, TableCell, TableHeader, TableFooter} from "@/components/ui/table";
import { DropdownMenu , DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {EyeIcon, MoreHorizontalIcon} from "lucide-react";
import {useRouter} from "next/navigation";

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
  const [status, setStatus] = useState("Active");
  const [q, setQ]= useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const detail = (id : string)=> {
    router.push(`/detail/${id}`);
  }
  useEffect(() => {

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
      toast.add({
        title: "Error",
        type: "error",
        description: `Error on loading page: ${error}`,
      })
    }
    setLoading(false);
  }
  
    fetchJobs();
  }, [currentPage]);
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
              {loading ? (
                  <div className="text-center py-8">Loading...</div>
              ): jobs.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No active job requests
                  </div>
              ) : (
                  <Table border={1}>
                    <TableHeader>
                      <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Notication</TableHead>
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
                          <TableRow key={job.id} >
                            <TableCell>{index+1}</TableCell>
                            <TableCell>{job.category.name}</TableCell>
                            <TableCell>{job.notification}</TableCell>
                            <TableCell>
                              {job.model} /
                              {job.serialNumber}
                            </TableCell>
                            <TableCell>{job.symptom}</TableCell>
                            <TableCell>{job.sender}</TableCell>
                            <TableCell>Approved</TableCell>
                            <TableCell>Result</TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger render={
                                  <Button variant="ghost" size={"icon"} className="size-8">
                                    <MoreHorizontalIcon />
                                    <span className="sr-only">Menu</span>
                                  </Button>
                                }/>
                                <DropdownMenuContent align={"end"}>
                                  <DropdownMenuItem onClick={() => detail(job.id)}>
                                    <EyeIcon /> Detail</DropdownMenuItem>
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
