import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { PDFDocument } from 'pdf-lib';

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { searchParams } = new URL(req.url);
  const attendedId = searchParams.get('attendedId');
  const formData = await req.formData();
  const pdfFile = formData.get('pdfFile');
  const profilePdfBlob = pdfFile
    ? new Blob([pdfFile], { type: 'application/pdf' })
    : new Blob([]);

  if (!attendedId)
    return Response.json(
      'É necessário informar o id do atendido para baixar o prontuário.',
      { status: 400 }
    );

  try {
    const recordProgressPath = `${attendedId}/progress-records`;
    const attachmentsPath = `${attendedId}/attachments`;

    const { data: recordsProgressList, error: recordProgressListError } =
      await supabase.storage.from('attendeds').list(recordProgressPath);

    const { data: attachmentsList, error: attachmentsListError } =
      await supabase.storage.from('attendeds').list(attachmentsPath);

    if (recordProgressListError) {
      throw new Error(
        `Houve um erro ao resgatar as evoluções: ${recordProgressListError}`
      );
    }

    const recordProgress = await Promise.all(
      recordsProgressList.map(async (file) => {
        const { data } = await supabase.storage
          .from('attendeds')
          .download(`${recordProgressPath}/${file.name}`);
        return data && data?.size > 0
          ? new Uint8Array(await data.arrayBuffer())
          : null;
      })
    );

    if (attachmentsListError) {
      throw new Error(
        `Houve um erro ao resgatar os anexos: ${attachmentsListError}`
      );
    }

    const attachments = await Promise.all(
      attachmentsList.map(async (file) => {
        const { data } = await supabase.storage
          .from('attendeds')
          .download(`${attachmentsPath}/${file.name}`);
        return data && data?.size > 0
          ? new Uint8Array(await data.arrayBuffer())
          : null;
      })
    );

    const pdfDoc = await PDFDocument.create();
    const profileUint8Array = new Uint8Array(
      await profilePdfBlob.arrayBuffer()
    );

    let fullFile = [profileUint8Array, ...recordProgress];

    if (attachments.length > 1) {
      const attachmentsCover = await PDFDocument.create();
      const text = 'ANEXOS';
      const fontSize = 50;

      const page = attachmentsCover.addPage();
      const { width, height } = page.getSize();
      page.drawText(text, {
        x: width / 2 - 100,
        y: height / 2,
        size: fontSize
      });

      const coverBytes = await attachmentsCover.save();
      const attachmentsWithCover = [coverBytes, ...attachments];

      fullFile = fullFile.concat(attachmentsWithCover);
    }

    for (const file of fullFile) {
      if (file) {
        const externalPdf = await PDFDocument.load(file);
        const copiedPages = await pdfDoc.copyPages(
          externalPdf,
          externalPdf.getPageIndices()
        );
        copiedPages.forEach((page) => pdfDoc.addPage(page));
      }
    }

    const headers = {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=record-full.pdf`
    };

    const pdfBytes = await pdfDoc.save();

    const blob = new Blob([pdfBytes]);

    return new Response(blob, {
      headers,
      status: 200
    });
  } catch (error) {
    Response.json(`Download error ${error}`, { status: 400 });
  }
}
