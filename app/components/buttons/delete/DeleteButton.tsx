import DeleteOutlineOutlined from '@mui/icons-material/DeleteOutlineOutlined';
import BaseFormActionIconButton from '../base/BaseFormActionIconButton';
import { IBaseFormActionIconButtonProps } from '../types';

export function DeleteButton({ action, actionArgs, color }: IBaseFormActionIconButtonProps) {
    return (
        <BaseFormActionIconButton
            action={action}
            actionArgs={actionArgs}
            ariaLabel='Delete'
            icon={DeleteOutlineOutlined}
            color={color}
        />
    );
}
