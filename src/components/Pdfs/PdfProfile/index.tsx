import { PdfHeader } from '../PdfHeader';

import { Attended } from '@/types/types';
import { calculateAge } from '@/utils/calculateAge';
import { formatDate } from '@/utils/formatDateTime';
import {
  Document,
  Font,
  Image,
  Page,
  StyleSheet,
  Text,
  View
} from '@react-pdf/renderer';

interface PdfProfileDataProps {
  attended: Attended;
}

Font.register({
  family: 'Roboto',
  fonts: [
    {
      src: 'https://jfzcpicztjnxtltzxbkc.supabase.co/storage/v1/object/public/assets/fonts/Roboto-Regular.ttf',
      fontWeight: 'medium'
    },
    {
      src: 'https://jfzcpicztjnxtltzxbkc.supabase.co/storage/v1/object/public/assets/fonts/Roboto-Bold.ttf',
      fontWeight: 'bold'
    }
  ]
});

export function PdfProfile({
  attended: {
    avatar,
    fullname,
    birthDate,
    cpf,
    maritalStatus,
    gender,
    rg = '',
    nickname = '',
    rank = '',
    cadre = '',
    workStatus = '',
    opm = '',
    address,
    phones
  }
}: PdfProfileDataProps) {
  const styles = StyleSheet.create({
    wrapper: {
      fontFamily: 'Roboto',
      fontWeight: 'medium',
      marginLeft: '2cm',
      marginRight: '1.5cm',
      paddingBottom: '1.76cm'
    },
    container: {
      maxWidth: 500,
      display: 'flex',
      flexDirection: 'column',
      fontSize: 12
    },
    profileHeader: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      paddingBottom: 16,
      gap: 8
    },
    title: {
      fontWeight: 'bold',
      paddingBottom: 8
    },
    column: {
      width: '50vw',
      padding: 4
    }
  });

  const validatedComplement = address.complement ? address.complement : '';
  const isMiliry = rg ? true : false;

  const defaultProfileImage =
    'https://jfzcpicztjnxtltzxbkc.supabase.co/storage/v1/object/public/assets/default-user.png';

  return (
    <Document>
      <Page style={styles.wrapper} wrap={true} size="A4">
        <PdfHeader isFixed={true} />
        <View style={styles.container}>
          <View style={styles.profileHeader}>
            <Image
              style={{
                width: 60,
                height: 60,
                borderRadius: '50%'
              }}
              src={avatar ? avatar : defaultProfileImage}
            />
            <Text>{`${fullname}`}</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.title}>Dados gerais</Text>
            <Text>{`Data de nascimento: ${formatDate(birthDate)}`}</Text>
            <Text>{`Idade: ${calculateAge(new Date(birthDate))}`}</Text>
            <Text>{`CPF: ${cpf}`}</Text>
            <Text>{`Estado civil: ${maritalStatus}`}</Text>
            <Text>{`Sexo: ${gender}`}</Text>
            {isMiliry && (
              <>
                <Text>{`RG: ${rg}`}</Text>
                <Text>{`Nome de guerra: ${nickname}`}</Text>
                <Text>{`Posto/graduação: ${rank}`}</Text>
                <Text>{`Condição funcional: ${workStatus}`}</Text>
                <Text>{`OPM: ${opm}`}</Text>
                <Text>{`Quadro: ${cadre}`}</Text>
              </>
            )}
          </View>
          <View style={styles.column}>
            <Text style={styles.title}>Endereço</Text>
            <Text>{`CEP: ${address.zipCode}`}</Text>
            <Text>{`Logradouro: ${address.number}`}</Text>
            <Text>{`Complemento: ${validatedComplement}`}</Text>
            <Text>{`Número: ${address.number}`}</Text>
            <Text>{`Bairro: ${address.neighborhood}`}</Text>
            <Text>{`Cidade/Estado: Cidade/Estado`}</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.title}>Contatos</Text>
            {phones.map((e) => {
              const content = e.bond
                ? `${e.phone} - ${e.ownerIdentification} (${e.bond})`
                : `${e.phone} (${e.ownerIdentification})`;
              return <Text key={e.phone}>{`Telefone: ${content}`}</Text>;
            })}
          </View>
        </View>
      </Page>
    </Document>
  );
}
