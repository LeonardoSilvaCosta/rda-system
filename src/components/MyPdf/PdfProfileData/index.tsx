import { AddressData, GeneralData, HeaderData, KeyValue } from '@/types/types';
import { Font, StyleSheet, Text, View } from '@react-pdf/renderer';

interface PdfProfileDataProps {
  attended: Attended;
}

type Attended = {
  headerData: HeaderData;
  generalData: GeneralData;
  addressData: AddressData;
  contactsData: KeyValue[];
  familiarBondsData: KeyValue[];
};

Font.register({
  family: 'Roboto',
  src: 'https://fonts.googleapis.com/css2?family=Roboto&display=swap'
});

export function PdfProfileData({
  attended: {
    headerData: { fullname },
    generalData: { cpf, rg, nickname, rank, cadre }
  }
}: PdfProfileDataProps) {
  const styles = StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'column',
      paddingBottom: 16
    },
    header: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      paddingBottom: 16,
      fontSize: 14,
      gap: 16
    },
    title: {
      fontWeight: 'bold',
      paddingBottom: 16
    }
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text>{`Identificação do atendido: ${
          rg
            ? `${rank.value} ${cadre.value} ${rg.value} ${nickname.value}`
            : `${fullname} - ${cpf.value}`
        }`}</Text>
      </View>
      {/* <View>
        <Text style={styles.title}>Dados gerais</Text>
        <Text>{`Data de nascimento: ${birthDate.value}`}</Text>
        <Text>{`Idade: ${age.value}`}</Text>
        <Text>{`CPF: ${cpf.value}`}</Text>
        <Text>{`Estado civil: ${maritalStatus.value}`}</Text>
        <Text>{`Sexo: ${gender.value}`}</Text>
        <Text>{`Rg: ${rg.value}`}</Text>
        <Text>{`Nome de guerra: ${nickname.value}`}</Text>
        <Text>{`Posto/graduação: ${rank.value}`}</Text>
        <Text>{`Quadro: ${cadre.value}`}</Text>
        <Text>{`Condição funcional: ${workStatus.value}`}</Text>
        <Text>{`OPM: ${opm.value}`}</Text>
      </View> */}
    </View>
  );
}
