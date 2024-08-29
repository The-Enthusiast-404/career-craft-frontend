// app/routes/jobs.tsx
import { json, type LoaderFunction } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { useState } from "react";

interface Job {
  id: number;
  title: string;
  company: string;
  url: string;
}

const companies = ["Flipkart", "PhonePe"]; // Add more companies as needed

export const loader: LoaderFunction = async () => {
  const jobPromises = companies.map(async (company) => {
    const response = await fetch(`http://localhost:8080/jobs/${company}`);
    if (!response.ok) {
      console.error(`Failed to fetch jobs for ${company}`);
      return [];
    }
    return response.json();
  });

  const jobsArrays = await Promise.all(jobPromises);
  const allJobs = jobsArrays.flat();
  return json(allJobs);
};

export default function Jobs() {
  const jobs = useLoaderData<Job[]>();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("All");

  const filteredJobs = jobs.filter(
    (job) =>
      (selectedCompany === "All" || job.company === selectedCompany) &&
      (job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Job Listings</h1>
      <div className="mb-4 flex space-x-4">
        <input
          type="text"
          placeholder="Search jobs..."
          className="flex-grow p-2 border rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="p-2 border rounded"
          value={selectedCompany}
          onChange={(e) => setSelectedCompany(e.target.value)}
        >
          <option value="All">All Companies</option>
          {companies.map((company) => (
            <option key={company} value={company}>
              {company}
            </option>
          ))}
        </select>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredJobs.map((job) => (
          <div key={job.id} className="border rounded p-4 shadow">
            <h2 className="text-xl font-semibold">{job.title}</h2>
            <p className="text-gray-600">{job.company}</p>
            <a
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Apply
            </a>
          </div>
        ))}
      </div>
      {filteredJobs.length === 0 && (
        <p className="text-center text-gray-500 mt-4">No jobs found.</p>
      )}
    </div>
  );
}
