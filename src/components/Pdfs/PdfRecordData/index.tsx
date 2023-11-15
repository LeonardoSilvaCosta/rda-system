import { PdfHeader } from '../PdfHeader';

import { Appointment, Attended } from '@/types/types';
import {
  Document,
  Font,
  Page,
  StyleSheet,
  Text,
  View
} from '@react-pdf/renderer';

interface PdfRecordDataProps {
  attended: Attended;
  appointment: Appointment;
}

Font.register({
  family: 'Roboto',
  src: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap'
});

export function PdfRecordData({
  attended: { rg, rank, cadre, nickname, fullname, cpf },
  appointment: {
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
  }
}: PdfRecordDataProps) {
  const styles = StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'column',
      fontSize: 12,
      padding: 20
    },
    appointmentWrapper: {
      display: 'flex',
      flexDirection: 'row',
      lineHeight: 2,
      paddingBottom: 4,
      gap: 10
    },
    column: {
      width: '50vw'
    },
    recordProgressBox: {
      width: '100%',
      position: 'relative',
      border: 1,
      borderColor: '#a6a6a6',
      margin: '0 auto 30 auto',
      padding: '16 8 2 8',
      textAlign: 'justify'
    },
    recordProgressLabel: {
      position: 'absolute',
      padding: 0,
      top: -7,
      left: 10,
      backgroundColor: '#fff',
      fontWeight: 'bold'
    },
    signature: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: 16,
      margin: '0 auto 10 auto'
    }
  });

  const referrals = referralDestinations?.map((destination, index) => {
    return {
      description: referralTypes && `${destination} - ${referralTypes[index]}`
    };
  });

  return (
    <Document>
      <Page wrap={true} size="A4">
        <View style={styles.container}>
          <PdfHeader />
          <Text style={{ paddingBottom: 16 }}>{`Identificação do atendido: ${
            rg ? `${rank} ${cadre} ${rg} ${nickname}` : `${fullname} - ${cpf}`
          }`}</Text>
          <View>
            <Text style={{ paddingBottom: 16 }}>Dados do atendimento</Text>
            <View style={styles.appointmentWrapper}>
              <View style={styles.column}>
                <Text>{`Data e hora: ${date}`}</Text>
                <Text>{`Protocolo: ${
                  protocol ? protocol : 'Sem registro'
                }`}</Text>
                <Text>{`Acesso: ${access}`}</Text>
                <Text>{`Local: ${facility}`}</Text>
                <Text>{`Modalidade: ${modality}`}</Text>
                <Text>{`Oficial(is): ${specialists
                  .map((e) => `${e.rank} ${e.cadre} ${e.rg} ${e.nickname}`)
                  .join(', ')}`}</Text>
                <Text>{`Atendido(s): ${attendeds
                  .map((e) => e.fullname)
                  .join(', ')}`}</Text>
                <Text>{`Serviço: ${service} `}</Text>
                <Text>{`Avaliação psicológica: ${
                  psychologicalAssessment
                    ? psychologicalAssessment
                    : 'Não se aplica'
                }`}</Text>
              </View>
              <View style={styles.column}>
                <Text>{`Avaliação social: ${
                  socialAssessment ? socialAssessment : 'Não se aplica'
                }`}</Text>
                <Text>{`Demanda geral: ${generalDemand}`}</Text>
                <Text>{`Demandas específicas: ${
                  specificDemands?.length !== 0
                    ? specificDemands
                    : 'Sem registro'
                }`}</Text>
                <Text>{`Procedimento: ${procedure} `}</Text>
                <Text>{`Documentos: ${
                  documents?.length !== 0 ? documents : 'Sem registro'
                }`}</Text>
                <Text>{`Deslocamentos: ${
                  travels?.length !== 0 ? travels : 'Sem registro'
                }`}</Text>
                <Text>{`Encaminhamentos: ${
                  referrals?.length !== 0
                    ? referrals?.map((e) => e.description).join(', ')
                    : 'Sem registro'
                }`}</Text>
                <Text>{`Houve afastamento? ${
                  hasLeaveOfAbsence ? 'Sim' : 'Não'
                }`}</Text>
              </View>
            </View>
            <View style={styles.recordProgressBox}>
              <Text style={styles.recordProgressLabel}>Evolução</Text>
              <Text>{`${recordProgress}`}</Text>
            </View>
            {specialists.map((e) => (
              <View key={e.cpf} style={styles.signature}>
                <Text>{e.fullname}</Text>
                <Text>{`${e.rank} ${e.cadre} - RG ${e.rg}`}</Text>
                <Text>{`${
                  e.professionalRegistration?.split('/')[0] === '10'
                    ? 'PSICÓLOGO(A)- CRP'
                    : 'ASSISTENTE SOCIAL - CRESS'
                } ${e.professionalRegistration}`}</Text>
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
}