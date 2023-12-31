import React from 'react';

import { Text, View, StyleSheet, Image } from '@react-pdf/renderer';

interface PdfHeaderProps {
  isFixed: boolean;
}

export function PdfHeader({ isFixed }: PdfHeaderProps) {
  const styles = StyleSheet.create({
    header: {
      display: 'flex',
      flexDirection: 'row',
      marginTop: 16,
      marginBottom: 16,
      fontSize: 10
    },
    firstImage: {
      width: '1.6cm',
      height: '2.01cm',
      position: 'absolute',
      left: 0,
      top: 2
    },
    secondImage: {
      width: '1.6cm',
      height: '2.01cm',
      position: 'absolute',
      right: 100,
      top: 2
    },
    headerTextWrapper: {
      display: 'flex',
      justifyContent: 'center',
      textAlign: 'center',
      width: '17cm'
    },
    boldTitle: {
      fontWeight: 'bold'
    }
  });
  return (
    <View fixed={isFixed} style={styles.header}>
      <Image
        style={styles.firstImage}
        src="https://jfzcpicztjnxtltzxbkc.supabase.co/storage/v1/object/public/assets/brasao-estado.png"
      />
      <View style={styles.headerTextWrapper}>
        <Text>GOVERNO DO ESTADO DO PARÁ</Text>
        <Text>SECRETARIA DE ESTADO DE SEGURANÇA PÚBLICA E DEFESA SOCIAL</Text>
        <Text>POLÍCIA MILITAR DO PARÁ</Text>
        <Text>DEPARTAMENTO GERAL DE PESSOAL</Text>
        <Text style={styles.boldTitle}>
          {' '}
          CENTRO INTEGRADO DE ATENÇÃO PSICOSSOCIAL - CIAP
        </Text>
        <Text>
          ______________________________________________________________________________________________________________
        </Text>
      </View>
      <Image
        style={styles.secondImage}
        src="https://jfzcpicztjnxtltzxbkc.supabase.co/storage/v1/object/public/assets/brasao_pmpa.png"
      />
    </View>
  );
}
