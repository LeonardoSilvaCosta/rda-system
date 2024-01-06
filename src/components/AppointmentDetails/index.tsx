import { AttachmentComponent } from '../AttachmentComponent';
import { PdfRecordData } from '../Pdfs/PdfRecordData';
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
  if (!appointment) return;

  const {
    date,
    protocol,
    hasLeaveOfAbsence,
    hospitalization,
    recordProgress,
    access,
    facility,
    modality,
    program,
    service,
    psychologicalAssessment,
    socialAssessment,
    generalDemand,
    procedure,
    employmentStatus,
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

  return (
    <div className={styles.wrapper}>
      <main className={styles.container}>
        <div>
          <div className={styles.column}>
            <span>{`Data e hora do atendimento: ${date}`}</span>
            <span>{`Protocolo: ${protocol ? protocol : 'Sem registro'}`}</span>
            <span>{`Acesso: ${access}`}</span>
            <span>{`Local: ${facility}`}</span>
            <span>{`Modalidade: ${modality}`}</span>
            <span>{`Programa: ${program ? program : 'Não se aplica'}`}</span>
            <span>{`Oficial(is): ${specialists
              .map((e) => `${e.rank} ${e.cadre} ${e.rg} ${e.nickname}`)
              .join(', ')}`}</span>
            <span>{`Atendido(s): ${attendeds
              .map((e) => e.fullname)
              .join(', ')}`}</span>
            <span>{`Condição laboral: ${
              employmentStatus ? employmentStatus : 'Não se aplica'
            }`}</span>
            <span>{`Serviço: ${service}`}</span>
            <span>{`Avaliação psicológica: ${
              psychologicalAssessment
                ? psychologicalAssessment
                : 'Não se aplica'
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
            <span>{`Houve Internação? ${
              hospitalization ? 'Sim' : 'Não'
            }`}</span>
          </div>
        </div>
        <div className={styles.progressWrapper}>
          <span>Evolução</span>
          <span>{`${recordProgress}`}</span>
        </div>
        <footer className={styles.footer}>
          <a
            href="https://assinador.iti.br/assinatura/"
            target="_blank"
            rel="noreferrer"
          >
            Assinar documento com o gov.br
          </a>
          <button>
            <PDFDownloadLink
              document={
                <PdfRecordData attended={attended} appointment={appointment} />
              }
              fileName="document.pdf"
            >
              {({ loading }) => (loading ? 'Carregando...' : 'Baixar em pdf!')}
            </PDFDownloadLink>
          </button>
        </footer>
      </main>
      <AttachmentComponent
        attendedId={attended.id}
        title={'Documentos assinados'}
        listFilesUrl={`/api/get_attended_record_progress_files?attendedId=${attended.id}&appointmentId=${appointment.id}`}
        uploadFileUrl={`/api/upload_record_progress?attendedId=${attended.id}&appointmentId=${appointment.id}`}
        deleteFileUrl={`/api/delete_file`}
        getDocumentSpeciesUrl={`/api/get_document_species_for_record_progress?isSigned=${appointment.isSigned}`}
      />
    </div>
  );
}
