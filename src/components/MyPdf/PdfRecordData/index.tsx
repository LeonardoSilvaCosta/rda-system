import { Font, Image, StyleSheet, Text, View } from '@react-pdf/renderer';

interface PdfRecordDataProps {
  appointments: Apppointment;
}

type Apppointment = {
  id: string;
  date: string;
  time: string;
  protocol: string;
  hasLeaveOfAbsence: string;
  recordProgress: string;
  access: string;
  facility: string;
  modality: string;
  service: string;
  psychologicalAssessment: string;
  socialAssessment: string;
  generalDemand: string;
  procedure: string;
  specialists: [];
  attendeds: [];
  specificDemands: [];
  documents: [];
  travels: [];
  referrals: [];
};

Font.register({
  family: 'Roboto',
  src: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap'
});

export function PdfRecordData({
  appointments: {
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
  }
}: PdfRecordDataProps) {
  const styles = StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'column'
    },
    title: {
      fontWeight: 700,
      paddingBottom: 12
    },
    appointmentWrapper: {
      display: 'flex',
      flexDirection: 'row',
      lineHeight: 2,
      paddingBottom: 16
    },
    progressBox: {
      position: 'relative',
      border: 1,
      borderColor: '#a6a6a6',
      margin: '4 auto',
      padding: '16 8 2 8',
      textAlign: 'justify'
    },
    progressLabel: {
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
      margin: '20 auto',
      border: '1 solid #a6a6a6',
      borderRadius: 8
    }
  });

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>DADOS DO ATENDIMENTO</Text>
        <View style={styles.appointmentWrapper}>
          <View>
            <Text>{`Data e hora: ${date}`}</Text>
            <Text>{`Protocolo: ${protocol ? protocol : 'Sem registro'}`}</Text>
            <Text>{`Acesso: ${access}`}</Text>
            <Text>{`Local: ${facility}`}</Text>
            <Text>{`Modalidade: ${modality}`}</Text>
            <Text>{`Oficial(is): ${specialists}`}</Text>
            <Text>{`Atendido(s): ${attendeds}`}</Text>
            <Text>{`Serviço: ${service} `}</Text>
            <Text>{`Avaliação psicológica: ${
              psychologicalAssessment
                ? psychologicalAssessment
                : 'Não se aplica'
            }`}</Text>
          </View>
          <View>
            <Text>{`Avaliação social: ${
              socialAssessment ? socialAssessment : 'Não se aplica'
            }`}</Text>
            <Text>{`Demanda geral: ${generalDemand}`}</Text>
            <Text>{`Demandas específicas: ${
              specificDemands.length !== 0 ? specificDemands : 'Sem registro'
            }`}</Text>
            <Text>{`Procedimento: ${procedure} `}</Text>
            <Text>{`Documentos: ${
              documents.length !== 0 ? documents : 'Sem registro'
            }`}</Text>
            <Text>{`Deslocamentos: ${
              travels.length !== 0 ? travels : 'Sem registro'
            }`}</Text>
            <Text>{`Encaminhamentos: ${
              referrals.length !== 0 ? referrals : 'Sem registro'
            }`}</Text>
            <Text>{`Houve afastamento? ${
              hasLeaveOfAbsence ? 'Sim' : 'Não'
            }`}</Text>
          </View>
        </View>
        <View style={styles.progressBox}>
          <Text style={styles.progressLabel}>Evolução</Text>
          <Text>{`${recordProgress}`}</Text>
        </View>
        <View style={styles.signature}>
          <Text>{specialists}</Text>
          <Text>1º TEN QCOPM - RG 40897</Text>
          <Text>Psicólogo - CRP 10/05495</Text>
        </View>
      </View>
    </View>
  );
}
