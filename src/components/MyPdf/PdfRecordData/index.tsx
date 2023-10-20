import { Font, Image, StyleSheet, Text, View } from '@react-pdf/renderer';

interface PdfRecordDataProps {
  appointments: Apppointment[];
}

type Apppointment = {
  date: KeyValue;
  time: KeyValue;
  protocol: KeyValue;
  hasLeaveOfAbsence: KeyValue;
  recordProgress: KeyValue;
  access: KeyValue;
  facility: KeyValue;
  modality: KeyValue;
  service: KeyValue;
  psychologicalAssessment: KeyValue;
  socialAssessment: KeyValue;
  generalDemand: KeyValue;
  procedure: KeyValue;
  specialist: KeyValue;
  attendeds: KeyValue;
  specificDemands: KeyValue;
  documents: KeyValue;
  travels: KeyValue;
  referrals: KeyValue;
};

type KeyValue = {
  key: string;
  value: string;
};

Font.register({
  family: 'Roboto',
  src: 'https://fonts.googleapis.com/css2?family=Roboto&display=swap'
});

export function PdfRecordData({ appointments }: PdfRecordDataProps) {
  const styles = StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'column'
    },
    title: {
      fontWeight: 700,
      paddingBottom: 16
    },
    appointmentWrapper: {
      paddingBottom: 16
    }
  });

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>Dados de atendimento</Text>
        {appointments.map((e) => (
          <View style={styles.appointmentWrapper} key={e.date.key}>
            <Text>{`Realizado em: ${e.date.value}`}</Text>
            <Text>{`Realizado por: ${e.specialist.value}`}</Text>
            <Text>{`Local: ${e.facility.value}`}</Text>
            <Text>{`Serviço: ${e.service.value} `}</Text>
            <Text>{`Procedimento: ${e.procedure.value} `}</Text>
            <Text>{`Evolução: ${e.recordProgress.value}`}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
