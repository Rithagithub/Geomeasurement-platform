"use client";

import { Award, Download } from "lucide-react";
import { Certificate } from "@/types/certificate";
import certificateService from "@/services/certificateService";

interface Props {
  certificate: Certificate;
}

export default function CertificateCard({ certificate }: Props) {
  return (
    <div className="card group relative overflow-hidden p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lifted">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-signal-500/10"
      />

      <div className="relative flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-signal-500/15 text-signal-700">
          <Award size={18} />
        </div>
        <span className="badge">{certificate.certificateNumber}</span>
      </div>

      <h2 className="relative mt-4 font-display text-xl font-semibold text-ink-900">
        {certificate.courseTitle}
      </h2>

      <p className="relative mt-2 text-sm text-ink-400">Awarded to {certificate.studentName}</p>
      <p className="relative mt-1 font-mono text-xs text-ink-300">
        Issued {new Date(certificate.issuedAt).toLocaleDateString()}
      </p>

      <button
        onClick={() => certificateService.downloadCertificate(certificate.id)}
        className="btn-primary relative mt-6 w-full"
      >
        <Download size={15} />
        Download PDF
      </button>
    </div>
  );
}
