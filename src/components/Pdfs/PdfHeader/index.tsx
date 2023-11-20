import React from 'react';

import {
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Font
} from '@react-pdf/renderer';

Font.register({
  family: 'Roboto',
  src: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap'
});

export function PdfHeader() {
  const styles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      backgroundColor: '#fff'
    },
    header: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: '2cm',
      paddingBottom: '1.37cm',
      paddingLeft: '2cm',
      paddingRight: '1.5cm',
      fontSize: 11
    },
    headerTextWrapper: {
      textAlign: 'center',
      width: '17cm'
    }
  });
  return (
    <Document>
      <View fixed style={styles.header}>
        <Image
          style={{ width: '1.82cm', height: '2.29cm' }}
          src="https://jfzcpicztjnxtltzxbkc.supabase.co/storage/v1/object/public/assets/brasao-estado.png"
        />
        <View style={styles.headerTextWrapper}>
          <Text>GOVERNO DO ESTADO DO PARÁ</Text>
          <Text>SECRETARIA DE ESTADO DE SEGURANÇA PÚBLICA E DEFESA SOCIAL</Text>
          <Text>POLÍCIA MILITAR DO PARÁ</Text>
          <Text>DEPARTAMENTO GERAL DE PESSOAL</Text>
          <Text> CENTRO INTEGRADO DE ATENÇÃO PSICOSSOCIAL</Text>
        </View>
        <Image
          style={{ width: '2.02cm', height: '2.54cm' }}
          src="https://jfzcpicztjnxtltzxbkc.supabase.co/storage/v1/object/public/assets/brasao_ciap_rm_bg.png"
        />
      </View>
    </Document>
  );
}
