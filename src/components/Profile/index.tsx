import { CSSProperties, useState } from 'react';
import toast from 'react-hot-toast';
import PulseLoader from 'react-spinners/PulseLoader';

import { AttachmentComponent } from '../AttachmentComponent';
import { PdfProfile } from '../Pdfs/PdfProfile';
import { UpdateAttendedAddressDataForm } from '../UpdateAttendedAddressDataForm';
import { UpdateAttendedContactsDataForm } from '../UpdateAttendedContactsDataForm';
import { UpdateAttendedProfileGeneralDataForm } from '../UpdateAttendedProfileGeneralDataForm';
import styles from './styles.module.scss';

import { RecordProfileCard } from '@/components/RecordProfileCard';
import { Attended, CurrentScreen } from '@/types/types';
import { convertAttendedToKeyValues } from '@/utils/convertAttendedToKeyValue';
import { pdf } from '@react-pdf/renderer';

interface ProfileProps {
  attended: Attended;
}

const override: CSSProperties = {
  display: 'block',
  margin: '0 auto'
};

export function Profile({ attended }: ProfileProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<CurrentScreen>('profile');
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

  async function downloadFullRecord(attendedId: string) {
    setIsDownloading(true);
    const profileBlob = await pdf(<PdfProfile attended={attended} />).toBlob();

    try {
      const formData = new FormData();
      formData.append('pdfFile', profileBlob, 'profile.pdf');
      const res = await fetch(
        `/api/download_full_record?attendedId=${attendedId}`,
        {
          method: 'POST',
          body: formData
        }
      );

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
      throw new Error(
        `Erro ao tentar fazer upload completo do prontuário. ${error}`
      );
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <>
      <main className={styles.container}>
        <div className={styles.cards}>
          {currentScreen === 'update Dados gerais' ? (
            <UpdateAttendedProfileGeneralDataForm
              title={'Dados gerais'}
              attended={attended}
              setCurrentScreen={setCurrentScreen}
            />
          ) : (
            <RecordProfileCard
              title={'Dados gerais'}
              keyValues={generalData}
              numberToSlice={6}
              maxItems={12}
              setCurrentScreen={setCurrentScreen}
            />
          )}
          {currentScreen === 'update Endereço'! ? (
            <UpdateAttendedAddressDataForm
              title={'Endereço'}
              attended={attended}
              setCurrentScreen={setCurrentScreen}
            />
          ) : (
            <RecordProfileCard
              title={'Endereço'}
              keyValues={addressData}
              numberToSlice={3}
              maxItems={6}
              setCurrentScreen={setCurrentScreen}
            />
          )}
          {currentScreen === 'update Contatos' ? (
            <UpdateAttendedContactsDataForm
              title={'Contatos'}
              attended={attended}
              setCurrentScreen={setCurrentScreen}
            />
          ) : (
            <RecordProfileCard
              title={'Contatos'}
              keyValues={attendedKeyValues.contactsData}
              numberToSlice={3}
              maxItems={6}
              setCurrentScreen={setCurrentScreen}
            />
          )}
          {attended.rg && (
            <RecordProfileCard
              title={'Vínculos cadastrados'}
              keyValues={attendedKeyValues.dependentsData}
              dependents={
                attended.dependents.length > 0 ? attended.dependents : null
              }
              numberToSlice={3}
              maxItems={6}
              setCurrentScreen={setCurrentScreen}
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
              setCurrentScreen={setCurrentScreen}
            />
          )}
        </div>
        <AttachmentComponent
          attendedId={attended.id}
          title="Anexos"
          listFilesUrl={`/api/get_attended_attachments?attendedId=${attended.id}`}
          uploadFileUrl={`/api/upload_attachment?attendedId=${attended.id}`}
          deleteFileUrl={`/api/delete_file`}
          getDocumentSpeciesUrl={`api/get_document_species_for_attachments`}
        />
        <div className={styles.downloadButtonBox}>
          <button onClick={() => downloadFullRecord(attended.id)}>
            {isDownloading ? (
              <PulseLoader
                color={'#EBECF9'}
                loading={isDownloading}
                cssOverride={override}
                size={10}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            ) : (
              'Baixar prontuário completo!'
            )}
          </button>
        </div>
      </main>
    </>
  );
}
