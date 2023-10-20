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
  apppointments: Appointment[];
};

type Attended = {
  headerData: HeaderData;
  generalData: GeneralData;
  addressData: AddressData;
  contactsData: KeyValue[];
  familiarBondsData: KeyValue[];
};

type Appointment = {
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

export function MyPdf({ attended, apppointments }: PdfProps) {
  const styles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      backgroundColor: '#E4E4E4'
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
            src="https://i.postimg.cc/XN917h50/brasao-estado.png"
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
            src="https://i.postimg.cc/cHwgwf7r/brasao-ciap-rm-bg.png"
          />
        </View>
        <View style={styles.section}>
          <PdfProfileData
            avatar={attended.headerData.avatar}
            fullname={attended.headerData.fullname}
            age={attended.generalData.age.value}
            cpf={attended.generalData.cpf.value}
            maritalStatus={attended.generalData.maritalStatus.value}
            gender={attended.generalData.gender.value}
            rg={attended.generalData.rg.value}
            nickname={attended.generalData.nickname.value}
            rank={attended.generalData.rank.value}
            cadre={attended.generalData.cadre.value}
            workStatus={attended.generalData.workStatus.value}
            opm={attended.generalData.opm.value}
          />
          <PdfRecordData appointments={apppointments} />
        </View>
      </Page>
    </Document>
  );
}
