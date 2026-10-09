import api from "./api";
import { Certificate } from "@/types/certificate";

const getCertificates = async (): Promise<Certificate[]> => {

    const response =
        await api.get("/certificates");

    return response.data;

};

const downloadCertificate = async (id: number) => {

    const response =
        await api.get(
            `/certificates/download/${id}`,
            {
                responseType: "blob"
            }
        );

    const file = new Blob(
        [response.data],
        {
            type: "application/pdf"
        }
    );

    const url =
        window.URL.createObjectURL(file);

    const link =
        document.createElement("a");

    link.href = url;

    link.download =
        `certificate-${id}.pdf`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);

};

export default {

    getCertificates,

    downloadCertificate

};