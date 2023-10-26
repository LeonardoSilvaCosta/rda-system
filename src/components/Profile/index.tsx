import styles from './styles.module.scss';

import { RecordProfileCard } from '@/components/RecordProfileCard';
import { AttendedKeyValue } from '@/types/types';

interface ProfileProps {
  attended: AttendedKeyValue;
}

export function Profile({ attended }: ProfileProps) {
  const generalData = attended.generalData
    ? Object.entries(attended.generalData).map(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([key, value]) =>
          value && {
            key: value.key,
            value: value.value
          }
      )
    : [];

  const addressData = attended.addressData
    ? // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(attended.addressData).map(([key, value]) => ({
        key: value.key,
        value: value.value
      }))
    : [];

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
            keyValues={attended.contactsData}
            numberToSlice={3}
            maxItems={6}
          />
          {attended.generalData.rg && (
            <RecordProfileCard
              title={'Vínculos cadastrados'}
              keyValues={attended.dependentsData}
              numberToSlice={3}
              maxItems={6}
            />
          )}
          {attended.policyHolder && (
            <RecordProfileCard
              title={'Titular'}
              keyValues={attended.policyHolder}
              numberToSlice={3}
              maxItems={6}
            />
          )}
        </div>
      </main>
    </>
  );
}
