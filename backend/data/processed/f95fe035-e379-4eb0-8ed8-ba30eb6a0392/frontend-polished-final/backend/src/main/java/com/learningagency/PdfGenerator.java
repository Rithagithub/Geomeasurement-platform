package com.learningagency.util;

import com.learningagency.dto.CertificateResponse;
import com.lowagie.text.Document;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfWriter;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

public class PdfGenerator {

    private PdfGenerator() {
    }

    public static byte[] generateCertificate(CertificateResponse certificate) {

        try {

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

            Document document = new Document(PageSize.A4);

            PdfWriter.getInstance(document, outputStream);

            document.open();

            Font titleFont =
                    FontFactory.getFont(FontFactory.HELVETICA_BOLD, 26);

            Font headingFont =
                    FontFactory.getFont(FontFactory.HELVETICA_BOLD, 20);

            Font bodyFont =
                    FontFactory.getFont(FontFactory.HELVETICA, 14);

            Font nameFont =
                    FontFactory.getFont(FontFactory.HELVETICA_BOLD, 24);

            Font courseFont =
                    FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);

            Paragraph title =
                    new Paragraph("LEARNING AGENCY PLATFORM", titleFont);

            title.setAlignment(Element.ALIGN_CENTER);

            document.add(title);

            document.add(new Paragraph(" "));

            Paragraph heading =
                    new Paragraph("CERTIFICATE OF COMPLETION", headingFont);

            heading.setAlignment(Element.ALIGN_CENTER);

            document.add(heading);

            document.add(new Paragraph(" "));
            document.add(new Paragraph(" "));

            Paragraph line1 =
                    new Paragraph("This certificate is proudly presented to", bodyFont);

            line1.setAlignment(Element.ALIGN_CENTER);

            document.add(line1);

            document.add(new Paragraph(" "));

            Paragraph student =
                    new Paragraph(certificate.getStudentName(), nameFont);

            student.setAlignment(Element.ALIGN_CENTER);

            document.add(student);

            document.add(new Paragraph(" "));

            Paragraph line2 =
                    new Paragraph("For successfully completing", bodyFont);

            line2.setAlignment(Element.ALIGN_CENTER);

            document.add(line2);

            document.add(new Paragraph(" "));

            Paragraph course =
                    new Paragraph(certificate.getCourseTitle(), courseFont);

            course.setAlignment(Element.ALIGN_CENTER);

            document.add(course);

            document.add(new Paragraph(" "));
            document.add(new Paragraph(" "));

            String issuedDate =
                    certificate.getIssuedAt()
                            .format(DateTimeFormatter.ofPattern("dd MMMM yyyy"));

            document.add(new Paragraph(
                    "Issued Date : " + issuedDate,
                    bodyFont));

            document.add(new Paragraph(
                    "Certificate Number : " + certificate.getCertificateNumber(),
                    bodyFont));

            document.close();

            return outputStream.toByteArray();

        } catch (Exception e) {

            throw new RuntimeException("Unable to generate PDF", e);

        }

    }

}