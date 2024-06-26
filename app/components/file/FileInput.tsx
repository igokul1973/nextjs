import { TFile } from '@/app/lib/types';
import { useI18n } from '@/locales/client';
import { TSingleTranslationKey } from '@/locales/types';
import { FileUploadOutlined } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import { TextField, capitalize } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { ChangeEvent, FC, useRef } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { IProps } from './types';

const FileInput: FC<IProps> = ({ inputName, label, user }) => {
    const {
        control,
        setValue,
        getValues,
        formState: { errors }
    } = useFormContext();
    const t = useI18n();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const deleteFile = () => {
        setValue(inputName, null, {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true
        });
        (fileInputRef.current as HTMLInputElement).value = '';
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
        let file: TFile | null = null;
        if (event.target.files?.[0]) {
            const { name, size, type } = event.target.files[0];
            const newFileInputValues = {
                name,
                size,
                type,
                data: event.target.files[0],
                createdBy: user.id,
                updatedBy: user.id
            };
            const oldFileInputValues = getValues(inputName);
            file = oldFileInputValues
                ? { ...oldFileInputValues, ...newFileInputValues }
                : { ...newFileInputValues, id: '' };
        }

        if (file) {
            setValue(inputName, file, {
                shouldDirty: true,
                shouldTouch: true,
                shouldValidate: true
            });
        }
    };
    const fileError = errors[inputName];

    const getFileErrorMessage = (error: NonNullable<typeof fileError>) => {
        if ('message' in error && typeof error?.message === 'string') {
            return capitalize(error.message);
        } else if ('id' in error && typeof error.id?.message === 'string') {
            return capitalize(error.id?.message);
        } else if ('name' in error && typeof error.name?.message === 'string') {
            return capitalize(error.name.message);
        } else if ('size' in error && typeof error.size?.message === 'string') {
            return capitalize(error.size.message);
        } else if (
            'type' in error &&
            typeof error.type !== 'string' &&
            error.type &&
            'message' in error.type &&
            typeof error.type?.message === 'string'
        ) {
            return capitalize(error.type.message);
        } else if ('data' in error && typeof error.data?.message === 'string') {
            return capitalize(error.data.message);
        } else if ('url' in error && typeof error.url?.message === 'string') {
            return capitalize(error.url.message);
        } else {
            return '';
        }
    };
    return (
        <FormControl variant='filled'>
            <Controller
                name={inputName}
                control={control}
                render={({ field: { value, onChange, ...field } }) => {
                    return (
                        <TextField
                            variant='outlined'
                            label={label}
                            placeholder={capitalize(
                                t(
                                    `click icon to the right to upload ${inputName}` as TSingleTranslationKey
                                )
                            )}
                            type='text'
                            value={value && 'name' in value ? value.name : ''}
                            error={!!fileError}
                            helperText={
                                fileError
                                    ? getFileErrorMessage(fileError)
                                    : capitalize(
                                          t(
                                              'square picture (png, jpg, jpeg or svg) with max file size: kb',
                                              {
                                                  count: 100
                                              }
                                          )
                                      )
                            }
                            InputProps={{
                                endAdornment: (
                                    <>
                                        <Tooltip title={capitalize(t('click to change avatar'))}>
                                            <IconButton component='label'>
                                                <FileUploadOutlined color='info' />
                                                <input
                                                    style={{ display: 'none' }}
                                                    type='file'
                                                    hidden
                                                    onChange={handleFileChange}
                                                    ref={fileInputRef}
                                                />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title={capitalize(t('click to delete avatar'))}>
                                            <IconButton component='button' onClick={deleteFile}>
                                                <DeleteIcon color='warning' />
                                            </IconButton>
                                        </Tooltip>
                                    </>
                                )
                            }}
                            {...field}
                        />
                    );
                }}
            />
        </FormControl>
    );
};

export default FileInput;
