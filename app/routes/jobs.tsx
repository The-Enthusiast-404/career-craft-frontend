import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { useState } from "react";

type Job = {
  id: number;
  title: string;
  company: string;
  url: string;
};

export async function loader({ request }: LoaderFunctionArgs) {
  const apiUrl = process.env.API_URL || "http://localhost:8080";
  const companies = ["Flipkart", "PhonePe"]; // Add more companies as needed
  let allJobs: Job[] = [];

  for (const company of companies) {
    const response = await fetch(`${apiUrl}/jobs/${company}`);

    if (!response.ok) {
      console.error(
        `Failed to fetch jobs for ${company}: ${response.statusText}`
      );
      continue;
    }

    const jobs = await response.json();
    allJobs = allJobs.concat(jobs);
  }

  return json({ jobs: allJobs });
}

export default function Jobs() {
  const { jobs } = useLoaderData<typeof loader>();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredJobs = jobs.filter(
    (job: Job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Job Listings</h1>
      <input
        type="text"
        placeholder="Search jobs..."
        className="w-full p-2 mb-4 border rounded"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <ul className="space-y-4">
        {filteredJobs.map((job: Job) => (
          <li key={job.id} className="bg-white shadow-md rounded-lg p-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">{job.title}</h2>
                <Link
                  to={`/company/${job.company}`}
                  className="text-blue-500 hover:underline"
                >
                  {job.company}
                </Link>
              </div>
              <a
                href={job.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              >
                Apply
              </a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
