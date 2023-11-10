import Image from 'next/image';
import { useEffect, useState } from 'react';
import { BsImage } from 'react-icons/bs';

import styles from './styles.module.scss';

import { Button } from '@/components/Button';
import { LoadingComponent } from '@/components/Loading/loading';
import { useRegisterUserContext } from '@/context/registerUserContext';

export function FifthUserForm() {
  const { goToPreviousStep, register } = useRegisterUserContext();
  const [avatarUrl, setAvatarUrl] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsUploading(true);

    if (!event.target.files || event.target.files.length === 0) {
      throw new Error('You must select an image to upload.');
    }
    const file = event.target.files[0];

    const imageUrl = URL.createObjectURL(file);
    setAvatarUrl(imageUrl);
    setIsUploading(false);
  };

  return (
    <>
      {isLoading ? (
        <LoadingComponent />
      ) : (
        <>
          <div className={styles.container}>
            <h2>Cadastre uma foto para o perfil do usuário.</h2>
            <main className={styles.uploadBox}>
              {avatarUrl ? (
                <Image
                  width={100}
                  height={100}
                  src={avatarUrl}
                  alt="Avatar"
                  className="avatar image"
                />
              ) : (
                <div className={styles.noImage}>
                  <BsImage />
                </div>
              )}
              <div className={styles.inputContainer}>
                <label htmlFor="avatar">
                  {isUploading ? 'Enviando arquivo...' : 'Carregar foto'}
                </label>
                <input
                  type="file"
                  id="avatar"
                  {...register('avatar')}
                  accept="image/*"
                  onChange={uploadAvatar}
                  disabled={isUploading}
                />
              </div>
            </main>
          </div>
          <div className={styles.buttonsBox}>
            <Button type="button" name="Voltar" onClick={goToPreviousStep} />
            <Button type="submit" name="Enviar" />
          </div>
        </>
      )}
    </>
  );
}
