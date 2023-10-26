import { MyPdf } from '../MyPdf';
import styles from './styles.module.scss';

import { Appointment, AttendedKeyValue } from '@/types/types';
import { PDFDownloadLink } from '@react-pdf/renderer';

interface AppointmentDetailsProps {
  attended: AttendedKeyValue;
  appointments?: Appointment;
}

export function AppointmentDetails({
  attended,
  appointments
}: AppointmentDetailsProps) {
  if (!appointments) return;
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
    referrals
  } = appointments;
  return (
    <main className={styles.container}>
      <div>
        <div className={styles.column}>
          <span>{`Data e hora do atendimento: ${date}`}</span>
          <span>{`Protocolo: ${protocol ? protocol : 'Sem registro'}`}</span>
          <span>{`Acesso: ${access}`}</span>
          <span>{`Local: ${facility}`}</span>
          <span>{`Modalidade: ${modality}`}</span>
          <span>{`Oficial(is): ${specialists.map(
            (e) => e.identification
          )}`}</span>
          <span>{`Atendido(s): ${attendeds}`}</span>
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
            specificDemands.length !== 0 ? specificDemands : 'Sem registro'
          }`}</span>
          <span>{`Procedimento: ${procedure}`}</span>
          <span>{`Documentos: ${
            documents.length !== 0 ? documents : 'Sem registro'
          }`}</span>
          <span>{`Deslocamentos: ${
            travels.length !== 0 ? travels : 'Sem registro'
          }`}</span>
          <span>{`Encaminhamentos: ${
            referrals.length !== 0 ? referrals : 'Sem registro'
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
      <button>
        <PDFDownloadLink
          document={<MyPdf attended={attended} apppointments={appointments} />}
          fileName="document.pdf"
        >
          {({ loading }) =>
            loading ? 'Carregando documento...' : 'Baixar pdf!'
          }
        </PDFDownloadLink>
      </button>
    </main>
  );
}
