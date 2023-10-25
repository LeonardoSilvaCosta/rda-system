import React from 'react';

import { PdfProfileData } from './PdfProfileData';
import { PdfRecordData } from './PdfRecordData';

import { AddressData, GeneralData, HeaderData } from '@/types/types';
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
  apppointments: Appointment;
};

type Attended = {
  headerData: HeaderData;
  generalData: GeneralData;
  addressData: AddressData;
  contactsData: KeyValue[];
  familiarBondsData: KeyValue[];
};

type Appointment = {
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

type KeyValue = {
  key: string;
  value: string;
};

Font.register({
  family: 'Roboto',
  src: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap'
});

export function MyPdf({ attended, apppointments }: PdfProps) {
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
      margin: 10,
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
            style={{ width: '2.29cm', height: '1.82cm' }}
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
            style={{ width: '2.54cm', height: '2.02cm' }}
            src="https://i.postimg.cc/wB3W6FS6/brasao-ciap-rm-bg.png"
          />
        </View>
        <View style={styles.section}>
          <PdfProfileData attended={attended} />
          <PdfRecordData appointments={apppointments} />
        </View>
      </Page>
    </Document>
  );
}
