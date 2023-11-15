import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { PdfRecordData } from '../Pdfs/PdfRecordData';
import { SingleRecord } from '../Pdfs/SingleRecord';
import styles from './styles.module.scss';

import { Appointment, Attended } from '@/types/types';
import { PDFDownloadLink } from '@react-pdf/renderer';

interface AppointmentDetailsProps {
  attended: Attended;
  appointment?: Appointment;
}

export function AppointmentDetails({
  attended,
  appointment
}: AppointmentDetailsProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [hasSignedPdf, setHasSignedPdf] = useState(false);

  useEffect(() => {
    async function downloadExists(attendedCpf: string, appointmentId: string) {
      try {
        const req = await fetch(
          `/api/get_download_exists?cpf=${attendedCpf}&appointmentId=${appointmentId}`
        );
        const response = await req.json();
        setHasSignedPdf(response);
      } catch (error) {
        console.log(error);
      }
    }

    appointment && downloadExists(attended.cpf, appointment.id);
  }, [appointment, appointment?.id, attended.cpf, isUploading]);

  if (!appointment) return;

  const {
    date,
    protocol,
    hasLeaveOfAbsence,
    recordProgress,
    access,
    facility,
    modality,
    service,
    psychologicalAssessment,
    socialAssessment,
    generalDemand,
    procedure,
    specialists,
    attendeds,
    specificDemands,
    documents,
    travels,
    referralDestinations,
    referralTypes
  } = appointment;
  const referrals = referralDestinations?.map((destination, index) => {
    return {
      description: referralTypes && `${destination} - ${referralTypes[index]}`
    };
  });

  const uploadPdf = async (
    e: React.ChangeEvent<HTMLInputElement>,
    appointmentId: string
  ) => {
    setIsUploading(true);
    const pdfFile = e.target.files && e.target.files[0];
    if (!pdfFile) return;
    const formData = new FormData();

    formData.append('pdfFile', pdfFile);

    try {
      const resPdf = await fetch(
        `/api/upload_pdf?cpf=${attended.cpf}&appointmentId=${appointmentId}`,
        {
          method: 'POST',
          body: formData
        }
      );

      const pdfData = await resPdf.json();
      resPdf.status === 200 ? toast.success(pdfData) : toast.error(pdfData);
    } catch (error) {
      console.log(error);
    } finally {
      setIsUploading(false);
    }
  };

  const downloadPdf = async (cpf: string, appointmentId: string) => {
    try {
      const req = await fetch(
        `/api/download_pdf?cpf=${cpf}&appointmentId=${appointmentId}`
      );

      if (req.status === 200) {
        const blob = await req.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `record-${appointmentId}.pdf`;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        const response = await req.json();
        toast.error(response);
      }
    } catch (error) {
      console.error('Erro ao baixar o PDF:', error);
    }
  };

  return (
    <main className={styles.container}>
      <div>
        <div className={styles.column}>
          <span>{`Data e hora do atendimento: ${date}`}</span>
          <span>{`Protocolo: ${protocol ? protocol : 'Sem registro'}`}</span>
          <span>{`Acesso: ${access}`}</span>
          <span>{`Local: ${facility}`}</span>
          <span>{`Modalidade: ${modality}`}</span>
          <span>{`Oficial(is): ${specialists
            .map((e) => `${e.rank} ${e.cadre} ${e.rg} ${e.nickname}`)
            .join(', ')}`}</span>
          <span>{`Atendido(s): ${attendeds
            .map((e) => e.fullname)
            .join(', ')}`}</span>
          <span>{`Serviço: ${service}`}</span>
          <span>{`Avaliação psicológica: ${
            psychologicalAssessment ? psychologicalAssessment : 'Não se aplica'
          }`}</span>
        </div>
        <div className={styles.column}>
          <span>{`Avaliação social: ${
            socialAssessment ? socialAssessment : 'Não se aplica'
          }`}</span>
          <span>{`Demanda geral: ${generalDemand}`}</span>
          <span>{`Demandas específicas: ${
            specificDemands?.length !== 0
              ? specificDemands?.join(', ')
              : 'Sem registro'
          }`}</span>
          <span>{`Procedimento: ${procedure}`}</span>
          <span>{`Documentos: ${
            documents?.length !== 0 ? documents?.join(', ') : 'Sem registro'
          }`}</span>
          <span>{`Deslocamentos: ${
            travels?.length !== 0 ? travels?.join(', ') : 'Sem registro'
          }`}</span>
          <span>{`Encaminhamentos: ${
            referrals?.length !== 0
              ? referrals?.map((e) => e.description).join(', ')
              : 'Sem registro'
          }`}</span>
          <span>{`Houve afastamento? ${
            hasLeaveOfAbsence ? 'Sim' : 'Não'
          }`}</span>
        </div>
      </div>
      <div className={styles.progressWrapper}>
        <span>Evolução</span>
        <span>{`${recordProgress}`}</span>
      </div>
      <footer className={styles.footer}>
        <form>
          <label
            className={`${hasSignedPdf ? styles.disabled : ''}`}
            htmlFor="file"
          >
            {isUploading ? 'Carregando documento...' : 'Enviar pdf assinado!'}
          </label>
          <input
            id="file"
            type="file"
            disabled={hasSignedPdf}
            onChange={(e) => uploadPdf(e, appointment.id)}
          />
        </form>
        {hasSignedPdf && (
          <button onClick={() => downloadPdf(attended.cpf, appointment.id)}>
            {`Baixar pdf`}
          </button>
        )}
        {!hasSignedPdf && (
          <button>
            <PDFDownloadLink
              document={
                <PdfRecordData attended={attended} appointment={appointment} />
              }
              fileName="document.pdf"
            >
              {({ loading }) => (loading ? 'Carregando...' : 'Baixar pdf!')}
            </PDFDownloadLink>
          </button>
        )}
      </footer>
    </main>
  );
}
