import { useEffect, useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { BsFillTrash3Fill } from 'react-icons/bs';

import { MyCustomDropdown } from '../MyCustomDropdown';
import styles from './styles.module.scss';

import { FileData } from '@/types/types';
import { formatDateFromOriginal } from '@/utils/formatDateTime';

interface FormValues extends FieldValues {
  specie: string;
  file: File;
}

interface AttachmentProps {
  attendedId: string;
  cpf: string;
}

const options = [
  {
    id: '1',
    name: 'Documentação'
  },
  {
    id: '2',
    name: 'RG'
  },
  {
    id: '3',
    name: 'Atestado psicológico'
  },
  {
    id: '4',
    name: 'Declaração'
  },
  {
    id: '5',
    name: 'Relatório psicossocial'
  },
  {
    id: '6',
    name: 'Relatório social'
  }
];

export function Attachment({ attendedId, cpf }: AttachmentProps) {
  const {
    formState: { errors },
    getValues,
    control
  } = useForm<FormValues>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [fileList, setFileList] = useState<FileData[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    async function getFileList() {
      const resFileList = await fetch(
        `/api/get_attended_files?attendedId=${attendedId}`
      );
      const data = await resFileList.json();

      setFileList(data);
    }

    getFileList();
  }, []);

  const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsUploading(true);
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const formData = new FormData();

    formData.append('file', file);

    try {
      const uploadRes = await fetch(`/api/upload_attachment?cpf=${cpf}`, {
        method: 'POST',
        body: formData
      });

      const pdfData = await uploadRes.json();
      uploadRes.status === 200 ? toast.success(pdfData) : toast.error(pdfData);
    } catch (error) {
      console.log(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <main className={styles.container}>
      <p>Anexos</p>
      <form>
        <div>
          <MyCustomDropdown
            title="Espécie do documento"
            fieldName="specie"
            getValues={getValues}
            errors={errors}
            control={control}
            options={options}
            routeToSearch={'/api/get_document_species'}
          />
        </div>
        <div>
          <label htmlFor="file">Anexar novo arquivo</label>
          <input onChange={(e) => uploadFile(e)} type={'file'} id={'file'} />
        </div>
      </form>
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Espécie</th>
            <th>Usuário</th>
            <th>Data</th>
            <th>Visualizar</th>
            <th>Excluir</th>
          </tr>
        </thead>
        <tbody>
          {fileList.map((e) => (
            <tr key={e.id}>
              <td>{e.originalName}</td>
              <td>{e.type}</td>
              <td>{e.registeredBy}</td>
              <td>{formatDateFromOriginal(e.createdAt)}</td>
              <td>
                <a href={e.url} target="_blank" rel="noreferrer">
                  Link
                </a>
              </td>
              <td className={styles.deleteIcon}>
                <BsFillTrash3Fill />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
