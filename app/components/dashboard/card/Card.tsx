import InboxOutlined from '@mui/icons-material/InboxOutlined';
import LocalAtmOutlined from '@mui/icons-material/LocalAtmOutlined';
import PeopleOutlined from '@mui/icons-material/PeopleOutlined';
import WatchLaterOutlined from '@mui/icons-material/WatchLaterOutlined';
import styles from './Card.module.scss';

const iconMap = {
    collected: LocalAtmOutlined,
    customers: PeopleOutlined,
    pending: WatchLaterOutlined,
    invoices: InboxOutlined
};

export default function Card({
    title,
    value,
    type
}: {
    title: string;
    value: number | string;
    type: 'invoices' | 'customers' | 'pending' | 'collected';
}) {
    const Icon = iconMap[type];

    return (
        <div className={styles.card}>
            <div className={styles.heading}>
                {Icon ? <Icon className={styles.icon} /> : null}
                <h3 className={styles.header}>{title}</h3>
            </div>
            <p className={styles.content}>{value}</p>
        </div>
    );
}
