import React from 'react';

import { PdfProfileData } from './PdfProfileData';
import { PdfRecordData } from './PdfRecordData';

import { Appointment, Attended } from '@/types/types';
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Font
} from '@react-pdf/renderer';

type PdfProps = {
  attended: Attended;
  appointment: Appointment;
};

Font.register({
  family: 'Roboto',
  src: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap'
});

export function MyPdf({ attended, appointment }: PdfProps) {
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
    },
    section: {
      padding: 10,
      flexGrow: 1,
      fontSize: 12
    },
    attendedData: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      paddingBottom: '2cm',
      fontSize: 24,
      fontWeight: 'bold'
    }
  });
  return (
    <Document>
      <Page wrap={true} size="A4" style={styles.page}>
        <View fixed style={styles.header}>
          <Image
            style={{ width: '1.82cm', height: '2.29cm' }}
            src="https://i.postimg.cc/fTLSqFXT/brasao-estado.png"
          />
          <View style={styles.headerTextWrapper}>
            <Text>GOVERNO DO ESTADO DO PARÁ</Text>
            <Text>
              SECRETARIA DE ESTADO DE SEGURANÇA PÚBLICA E DEFESA SOCIAL
            </Text>
            <Text>POLÍCIA MILITAR DO PARÁ</Text>
            <Text>DEPARTAMENTO GERAL DE PESSOAL</Text>
            <Text> CENTRO INTEGRADO DE ATENÇÃO PSICOSSOCIAL</Text>
          </View>
          <Image
            style={{ width: '2.02cm', height: '2.54cm' }}
            src="https://i.postimg.cc/wB3W6FS6/brasao-ciap-rm-bg.png"
          />
        </View>
        <View style={styles.section}>
          <PdfProfileData attended={attended} />
          <PdfRecordData appointment={appointment} />
        </View>
      </Page>
    </Document>
  );
}
