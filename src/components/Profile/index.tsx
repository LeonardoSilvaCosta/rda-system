import toast from 'react-hot-toast';

import { PdfProfile } from '../Pdfs/PdfProfile';
import styles from './styles.module.scss';

import { RecordProfileCard } from '@/components/RecordProfileCard';
import { Attended } from '@/types/types';
import { convertAttendedToKeyValues } from '@/utils/convertAttendedToKeyValue';
import { pdf } from '@react-pdf/renderer';

interface ProfileProps {
  attended: Attended;
}

export function Profile({ attended }: ProfileProps) {
  const attendedKeyValues = convertAttendedToKeyValues(attended);
  const generalData = attendedKeyValues.generalData
    ? Object.entries(attendedKeyValues.generalData).map(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([key, value]) =>
          value && {
            key: value.key,
            value: value.value
          }
      )
    : [];

  const addressData = attendedKeyValues.addressData
    ? // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(attendedKeyValues.addressData).map(([key, value]) => ({
        key: value.key,
        value: value.value
      }))
    : [];

  async function downloadFullRecord(cpf: string) {
    const blobPdf = await pdf(<PdfProfile attended={attended} />).toBlob();

    try {
      const formData = new FormData();
      formData.append('pdfFile', blobPdf, 'profile.pdf');
      const res = await fetch(`/api/download_full_record?cpf=${cpf}`, {
        method: 'POST',
        body: formData
      });

      if (res.status === 200) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `record-full.pdf`;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        const response = await res.json();
        toast.error(response);
      }
    } catch (error) {
      console.error('Erro ao executar o teste:', error);
    }
  }

  return (
    <>
      <main className={styles.container}>
        <div className={styles.cards}>
          <RecordProfileCard
            title={'Dados gerais'}
            keyValues={generalData}
            numberToSlice={6}
            maxItems={12}
          />
          <RecordProfileCard
            title={'Endereço'}
            keyValues={addressData}
            numberToSlice={3}
            maxItems={6}
          />
          <RecordProfileCard
            title={'Contatos'}
            keyValues={attendedKeyValues.contactsData}
            numberToSlice={3}
            maxItems={6}
          />
          {attended.rg && (
            <RecordProfileCard
              title={'Vínculos cadastrados'}
              keyValues={attendedKeyValues.dependentsData}
              dependents={
                attended.dependents.length > 0 ? attended.dependents : null
              }
              numberToSlice={3}
              maxItems={6}
            />
          )}
          {attended.policyHolder.rg && (
            <RecordProfileCard
              title={'Titular'}
              keyValues={attendedKeyValues.policyHolder}
              policyHolder={
                attended.policyHolder.rg ? attended.policyHolder : null
              }
              numberToSlice={3}
              maxItems={6}
            />
          )}
        </div>
        <div className={styles.downloadButtonBox}>
          <button onClick={() => downloadFullRecord(attended.cpf)}>
            Baixar prontuário completo!
          </button>
        </div>
      </main>
    </>
  );
}
