import { useState } from 'react';

import { MyPdf } from '../MyPdf';
import styles from './styles.module.scss';

import { Appointment, Attended } from '@/types/types';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface AppointmentDetailsProps {
  attended: Attended;
  appointment?: Appointment;
}

export function AppointmentDetails({
  attended,
  appointment
}: AppointmentDetailsProps) {
  const supabase = createClientComponentClient();
  const [isUploading, setIsUploading] = useState(false);

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
    try {
      const { data: pdf, error } = await supabase.storage
        .from('records')
        .upload(`${attended.cpf}/record-${appointmentId}.pdf`, pdfFile);

      if (!error) alert('Upload realizado com sucesso!');
      setIsUploading(false);
    } catch (error) {
      console.log(error);
      setIsUploading(false);
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
        <button>
          <PDFDownloadLink
            document={<MyPdf attended={attended} apppointment={appointment} />}
            fileName="document.pdf"
          >
            {({ loading }) =>
              loading ? 'Carregando documento...' : 'Baixar pdf!'
            }
          </PDFDownloadLink>
        </button>
        <form>
          <label htmlFor="file">
            {isUploading ? 'Carregando documento...' : 'Enviar pdf assinado!'}
          </label>
          <input
            id="file"
            type="file"
            onChange={(e) => uploadPdf(e, appointment.id)}
          />
        </form>
      </footer>
    </main>
  );
}
