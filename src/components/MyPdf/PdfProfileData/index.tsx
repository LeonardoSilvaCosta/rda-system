import { Font, Image, StyleSheet, Text, View } from '@react-pdf/renderer';

interface PdfProfileDataProps {
  avatar: string;
  fullname: string;
  age: string;
  cpf: string;
  maritalStatus: string;
  gender: string;
  rg: string;
  nickname: string;
  rank: string;
  cadre: string;
  workStatus: string;
  opm: string;
}

Font.register({
  family: 'Roboto',
  src: 'https://fonts.googleapis.com/css2?family=Roboto&display=swap'
});

export function PdfProfileData({
  avatar,
  fullname,
  age,
  cpf,
  maritalStatus,
  gender,
  rg,
  nickname,
  rank,
  cadre,
  workStatus,
  opm
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
      fontSize: 16,
      fontWeight: 'bold',
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
        <Image
          style={{ width: 80, height: 80 }}
          src="https://i.postimg.cc/3w1yr3Zc/new-linkedin-perfil-photo-2.png"
        />
        <Text>{fullname}</Text>
      </View>
      <View>
        <Text style={styles.title}>Dados gerais</Text>
        <Text>{`Data de nascimento: 20/01/1992`}</Text>
        <Text>{`Idade: ${age}`}</Text>
        <Text>{`CPF: ${cpf}`}</Text>
        <Text>{`Estado civil: ${maritalStatus}`}</Text>
        <Text>{`Sexo: ${gender}`}</Text>
        <Text>{`Rg: ${rg}`}</Text>
        <Text>{`Nome de guerra: ${nickname}`}</Text>
        <Text>{`Posto/graduação: ${rank}`}</Text>
        <Text>{`Quadro: ${cadre}`}</Text>
        <Text>{`Condição funcional: ${workStatus}`}</Text>
        <Text>{`OPM: ${opm}`}</Text>
      </View>
    </View>
  );
}
