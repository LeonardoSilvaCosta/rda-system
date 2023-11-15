import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

import errorMessages from '@/config/errorMessages';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { PDFDocument } from 'pdf-lib';

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { searchParams } = new URL(req.url);
  const cpf = searchParams.get('cpf');
  const formData = await req.formData();
  const pdfFile = formData.get('pdfFile');
  const profilePdfBlob = pdfFile
    ? new Blob([pdfFile], { type: 'application/pdf' })
    : new Blob([]);

  if (!cpf)
    return Response.json(
      'É necessário informar o pdf do atendido para baixar o prontuário.',
      { status: 400 }
    );

  try {
    const { data: filesList, error } = await supabase.storage
      .from('records')
      .list(cpf);

    if (!error) {
      const files = await Promise.all(
        filesList.map(async (e) => {
          const { data } = await supabase.storage
            .from('records')
            .download(`${cpf}/${e.name}`);
          return data
            ? new Uint8Array(await data.arrayBuffer())
            : new Uint8Array();
        })
      );

      const pdfDoc = await PDFDocument.create();
      const pdfUint8Array = new Uint8Array(await profilePdfBlob.arrayBuffer());
      const filesWithCover = [pdfUint8Array, ...files];

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
    } else {
      const { message, status } = errorMessages.pdfDownloadFailed;
      return Response.json(message, { status });
    }
  } catch (error) {
    Response.json(`Download error ${error}`, { status: 400 });
  }
}
