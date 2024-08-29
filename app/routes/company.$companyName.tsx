import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

type Company = {
  id: number;
  name: string;
  description: string;
  website: string;
  industry: string;
  size: string;
  founded: number;
};

export async function loader({ params }: LoaderFunctionArgs) {
  const companyName = params.companyName;
  const apiUrl = process.env.API_URL || "http://localhost:8080";

  const response = await fetch(`${apiUrl}/company/${companyName}`);

  if (!response.ok) {
    throw new Response("Company not found", { status: 404 });
  }

  const company = await response.json();
  return json({ company });
}

export default function CompanyDetails() {
  const { company } = useLoaderData<typeof loader>();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{company.name}</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <p className="text-gray-700 mb-4">{company.description}</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">Industry</h2>
            <p>{company.industry}</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Company Size</h2>
            <p>{company.size}</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Founded</h2>
            <p>{company.founded}</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Website</h2>
            <a
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {company.website}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
