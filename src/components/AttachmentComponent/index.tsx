import { CSSProperties, useEffect, useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { BsFillTrash3Fill } from 'react-icons/bs';
import PulseLoader from 'react-spinners/PulseLoader';

import { MyCustomDropdown } from '../MyCustomDropdown';
import styles from './styles.module.scss';

import { FileData, Option } from '@/types/types';
import { formatDateFromOriginal } from '@/utils/formatDateTime';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

interface FormValues extends FieldValues {
  specie: string;
}

interface AttachmentComponentProps {
  attendedId: string;
  title: string;
  listFilesUrl: string;
  uploadFileUrl: string;
  deleteFileUrl?: string;
  getDocumentSpeciesUrl: string;
}

const override: CSSProperties = {
  display: 'block',
  margin: '0 auto',
  borderColor: 'red'
};

export function AttachmentComponent({
  title,
  listFilesUrl,
  uploadFileUrl,
  deleteFileUrl,
  getDocumentSpeciesUrl
}: AttachmentComponentProps) {
  const validation = yup.object({
    specie: yup.string().required('É necessário informar a espécie do anexo.')
  });
  const {
    formState: { errors },
    watch,
    getValues,
    control
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useForm<FormValues | any>({
    resolver: yupResolver(validation),
    defaultValues: { specie: '' }
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [documentSpecies, setDocumentSpecies] = useState<Option[]>([]);
  const [fileList, setFileList] = useState<FileData[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [deletingPath, setDeletingPath] = useState('');
  const specieIsEmpty = watch('specie') === '';

  useEffect(() => {
    async function getDocumentSpecies() {
      const resSpeciesList = await fetch(getDocumentSpeciesUrl);
      const data = await resSpeciesList.json();

      setDocumentSpecies(data);
    }
    getDocumentSpecies();
  }, []);

  useEffect(() => {
    async function getFileList() {
      const resFileList = await fetch(`${listFilesUrl}`);
      const data = await resFileList.json();

      console.log(data);

      setFileList(data);
    }

    getFileList();
  }, [fileList]);

  const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsUploading(true);
    const documentSpecie = getValues('specie');
    const file = e.target.files && e.target.files[0];
    const filename = file?.name;
    if (!file) return;
    const formData = new FormData();

    formData.append('file', file);
    filename && formData.append('filename', filename);
    formData.append('documentSpecie', documentSpecie);

    try {
      const uploadRes = await fetch(`${uploadFileUrl}`, {
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

  const deleteAttachment = async (filepath: string, specie: string) => {
    if (specie === 'Evolução') return;
    setDeletingPath(filepath);
    try {
      const deleteRes = await fetch(`${deleteFileUrl}?filepath=${filepath}`, {
        method: 'DELETE'
      });

      const response = await deleteRes.json();

      toast.success(response);
    } catch (error) {
      console.log(error);
      toast.error(
        'Não foi possível deletar o arquivo, tente novamente depois.'
      );
    } finally {
      setDeletingPath('');
    }
  };

  return (
    <main className={styles.container}>
      <p>{title}</p>
      <form>
        <div>
          <MyCustomDropdown
            title="Espécie do documento"
            fieldName="specie"
            getValues={getValues}
            errors={errors}
            control={control}
            options={documentSpecies}
            routeToSearch={'/api/get_document_species'}
          />
        </div>
        <div>
          <label
            className={`${specieIsEmpty ? styles.disabled : ''}`}
            htmlFor="file"
          >
            {isUploading ? 'Enviando arquivo...' : 'Anexar novo arquivo'}
          </label>
          <input
            accept="image/*, application/pdf"
            disabled={specieIsEmpty}
            onChange={(e) => uploadFile(e)}
            type={'file'}
            id={'file'}
          />
        </div>
      </form>
      <div className={styles.tableContainer}>
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
                <td>{e.specie}</td>
                <td>{`${e.user.rank} ${e.user.cadre} ${e.user.rg} ${e.user.nickname}`}</td>
                <td>{formatDateFromOriginal(e.createdAt)}</td>
                <td>
                  <a href={e.url} target="_blank" rel="noreferrer">
                    Link
                  </a>
                </td>
                <td className={styles.deleteIcon}>
                  {deletingPath === e.path ? (
                    <PulseLoader
                      color={'#EF1924'}
                      loading={deletingPath === e.path}
                      cssOverride={override}
                      size={10}
                      aria-label="Loading Spinner"
                      data-testid="loader"
                    />
                  ) : (
                    <BsFillTrash3Fill
                      className={`${styles.trash} ${
                        e.specie === 'Evolução' ? styles.disabled : ''
                      }`}
                      onClick={() => deleteAttachment(e.path, e.specie)}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
