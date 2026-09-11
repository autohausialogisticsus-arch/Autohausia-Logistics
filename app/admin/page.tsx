import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { hasValidSession } from "@/lib/adminAuth";
import { objectUrl } from "@/lib/storage";

export const metadata = {
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const KIND_LABELS: Record<string, string> = {
  mc: "MC",
  w9: "W-9",
  coi: "COI",
  noa: "NOA",
  "voided-cheque": "Voided Cheque",
};

function formatDate(value: Date): string {
  return value.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function AdminPage() {
  if (!hasValidSession()) {
    redirect("/admin/login");
  }

  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { documents: true },
  });

  return (
    <main id="main" className="bg-fog py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-widest text-amber">
              Admin
            </p>
            <h1 className="mt-2 font-display text-3xl font-semibold text-ink">
              Submitted leads
            </h1>
            <p className="mt-1 text-sm text-slate">
              {leads.length} total (showing latest {leads.length > 200 ? 200 : leads.length})
            </p>
          </div>
          <form action="/api/admin/logout" method="post">
            <button
              type="submit"
              className="rounded-sm border border-ink px-4 py-2 text-sm font-semibold text-ink transition hover:border-amber hover:text-amber"
            >
              Sign out
            </button>
          </form>
        </div>

        {leads.length === 0 ? (
          <div className="mt-10 rounded-sm border border-dashed border-slate-300 bg-white p-10 text-center">
            <p className="text-slate">No submissions yet.</p>
            <p className="mt-1 text-sm text-slate">
              Contact form and carrier application submissions will appear here.
            </p>
          </div>
        ) : (
          <div className="mt-8 overflow-x-auto rounded-sm border border-slate-200 bg-white shadow-sm">
            <table className="w-full min-w-[900px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate">
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold">Name / Contact</th>
                  <th className="px-4 py-3 font-semibold">Carrier</th>
                  <th className="px-4 py-3 font-semibold">Source</th>
                  <th className="px-4 py-3 font-semibold">Details</th>
                  <th className="px-4 py-3 font-semibold">Documents</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leads.map((lead) => (
                  <tr key={lead.id} className="align-top">
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-slate">
                      {formatDate(lead.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-ink">
                        {lead.firstName || lead.name || "—"}{" "}
                        {lead.lastName || ""}
                        {lead.company ? ` · ${lead.company}` : ""}
                      </div>
                      <div className="mt-0.5 text-xs text-slate">{lead.email}</div>
                      <div className="text-xs text-slate">{lead.phone}</div>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate">
                      {lead.mcNumber ? (
                        <div>MC {lead.mcNumber}</div>
                      ) : null}
                      {lead.usdotNumber ? (
                        <div>USDOT {lead.usdotNumber}</div>
                      ) : null}
                      {lead.equipmentType && lead.truckCount
                        ? `${lead.equipmentType} · ${lead.truckCount}`
                        : null}
                      {lead.currentLocation ? (
                        <div className="mt-0.5">{lead.currentLocation}</div>
                      ) : null}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-sm px-2 py-0.5 text-xs font-semibold uppercase tracking-wide ${
                          lead.source === "application"
                            ? "bg-amber/15 text-amber"
                            : "bg-slate-100 text-slate"
                        }`}
                      >
                        {lead.source}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate">
                      {lead.preferredLanes ? (
                        <div>Lanes: {lead.preferredLanes}</div>
                      ) : null}
                      {lead.preferredRegions ? (
                        <div>Regions: {lead.preferredRegions}</div>
                      ) : null}
                      {lead.homeTime ? <div>Home: {lead.homeTime}</div> : null}
                      {lead.message ? (
                        <div className="mt-1 whitespace-pre-line">{lead.message}</div>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {lead.documents.length === 0 ? (
                        <span className="text-slate/60">—</span>
                      ) : (
                        <ul className="space-y-1">
                          {lead.documents.map((doc) => {
                            const url = objectUrl(doc.objectKey);
                            return (
                              <li key={doc.id}>
                                {url ? (
                                  <a
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-amber underline-offset-2 hover:underline"
                                  >
                                    {KIND_LABELS[doc.kind] ?? doc.kind} · {doc.filename}
                                  </a>
                                ) : (
                                  <span className="text-slate">
                                    {KIND_LABELS[doc.kind] ?? doc.kind} · {doc.filename}
                                  </span>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}