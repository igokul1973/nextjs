import InboxOutlined from '@mui/icons-material/InboxOutlined';
import LocalAtmOutlined from '@mui/icons-material/LocalAtmOutlined';
import PeopleOutlined from '@mui/icons-material/PeopleOutlined';
import WatchLaterOutlined from '@mui/icons-material/WatchLaterOutlined';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
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
        <Box className={styles.card}>
            <div className={styles.heading}>
                {Icon ? <Icon className={styles.icon} /> : null}
                <Typography variant='h6' className={styles.title}>
                    {title}
                </Typography>
            </div>
            <div className={styles.content}>{value}</div>
        </Box>
    );
}
