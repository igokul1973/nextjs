import { lusitana } from '@/app/ui/fonts';
import PublicOutlined from '@mui/icons-material/PublicOutlined';
import styles from './acme-logo.module.scss';

export default function AcmeLogo() {
    return (
        <div className={`${lusitana.className} ${styles['logo-wrapper']}`}>
            <PublicOutlined className={styles.icon} />
            <p className={styles.text}>Acme</p>
        </div>
    );
}
