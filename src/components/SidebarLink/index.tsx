import Link, { LinkProps } from 'next/link';
import { usePathname } from 'next/navigation';
import { IconType } from 'react-icons';

import styles from './styles.module.scss';

interface SidebarLinkProps extends LinkProps {
  children: React.ReactNode;
  icon: IconType;
}

export function SidebarLink({
  href,
  children,
  icon: Icon,
  ...rest
}: SidebarLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href.toString();

  return (
    <>
      <Link
        href={href}
        className={`${styles.link} ${isActive ? styles.active : ''}`}
        {...rest}
      >
        <Icon className={styles.navIcon} />
        {children}
      </Link>
    </>
  );
}
