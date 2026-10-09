"use client";

import { useEffect, useState } from "react";

import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/common/PageHeader";
import CertificateCard from "@/components/certificate/CertificateCard";

import certificateService from "@/services/certificateService";
import { Certificate } from "@/types/certificate";

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCertificates() {
      try {
        const data = await certificateService.getCertificates();
        setCertificates(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadCertificates();
  }, []);

  return (
    <MainLayout>
      <PageHeader
        eyebrow={`${certificates.length} earned`}
        title="Certificates"
        subtitle="Proof of the nodes you've fully mastered."
      />

      {loading && (
        <div className="mt-16 flex flex-col items-center gap-3 text-center">
          <span className="node-dot animate-pulse" />
          <p className="eyebrow text-ink-400">Loading certificates…</p>
        </div>
      )}

      {!loading && certificates.length === 0 && (
        <div className="card flex flex-col items-center gap-2 p-16 text-center">
          <span className="node-dot" />
          <p className="mt-2 font-display text-lg font-semibold text-ink-900">
            No certificates earned yet
          </p>
          <p className="text-sm text-ink-400">
            Complete a course and pass its quiz to earn your first certificate.
          </p>
        </div>
      )}

      {!loading && certificates.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {certificates.map((certificate) => (
            <CertificateCard key={certificate.id} certificate={certificate} />
          ))}
        </div>
      )}
    </MainLayout>
  );
}
