import {Job} from "@/interface/job";
import {Card, CardHeader, CardContent, CardTitle} from "@/components/ui/card";

export default function JobDetails({ job }: { job: Job }) {
    return (
        <Card className="grid grid-cols-2 mb-6">
            <CardHeader>
                <CardTitle className={"text-xl font-bold"}>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className={"col-span-2 bg-white p-6 rounded"}>
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
            </CardContent>
        </Card>
    )
}