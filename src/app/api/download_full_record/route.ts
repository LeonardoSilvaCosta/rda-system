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
        return data
          ? new Uint8Array(await data.arrayBuffer())
          : new Uint8Array();
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
        return data
          ? new Uint8Array(await data.arrayBuffer())
          : new Uint8Array();
      })
    );

    const progressAndAttachments = recordProgress.concat(attachments);

    const pdfDoc = await PDFDocument.create();
    const pdfUint8Array = new Uint8Array(await profilePdfBlob.arrayBuffer());
    const filesWithCover = [pdfUint8Array, ...progressAndAttachments];

    for (const file of filesWithCover) {
      if (file) {
        const externalPdf = await PDFDocument.load(file);
        const copiedPages = await pdfDoc.copyPages(
          externalPdf,
          externalPdf.getPageIndices()
        );
        copiedPages.forEach((page) => pdfDoc.addPage(page));
      }
    }

    const pdfBytes = await pdfDoc.save();

    const blob = new Blob([pdfBytes]);

    const headers = {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=record-full.pdf`
    };

    return new Response(blob, {
      headers,
      status: 200
    });
  } catch (error) {
    Response.json(`Download error ${error}`, { status: 400 });
  }
}
