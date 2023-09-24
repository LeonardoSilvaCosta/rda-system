import styles from './styles.module.scss';
import { BsSearch } from "react-icons/bs";


interface SearchBarProps {
  list: { value: string }[];
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}

export function SearchBar({ search, setSearch }: SearchBarProps) {

  const handleChange = (value: string) => {
    setSearch(value);
  }

  return (
    <div className={styles.container}>
      <BsSearch className={styles.searchIcon} />
      <input value={search} onChange={(e) => handleChange(e.target.value)} />
    </div>
  )
}