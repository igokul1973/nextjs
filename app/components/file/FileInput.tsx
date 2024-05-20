import { TFile } from '@/app/lib/types';
import { useI18n } from '@/locales/client';
import { TPluralTranslationKey, TSingleTranslationKey } from '@/locales/types';
import { FileUploadOutlined } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import { TextField, capitalize } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { ChangeEvent, FC, useRef } from 'react';
import { Controller, FieldError, useFormContext } from 'react-hook-form';
import { IProps } from './types';

const FileInput: FC<IProps> = ({ inputName, label, user, maxFileSize }) => {
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
            const aa = {
                name,
                size,
                type,
                data: event.target.files[0],
                createdBy: user.id,
                updatedBy: user.id
            };
            const a = getValues(inputName);
            file = a ? { ...a, ...aa } : { ...aa, id: '' };
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
        if ('message' in error) {
            return capitalize(t(error.message as TSingleTranslationKey));
        } else if ('id' in error && error.id) {
            return capitalize(t(error.id.message as TSingleTranslationKey));
        } else if ('name' in error && error.name) {
            return capitalize(t(error.name.message as TSingleTranslationKey));
        } else if ('size' in error && error.size) {
            return capitalize(t(error.size.message as TSingleTranslationKey));
        } else if ('type' in error && error.type) {
            return capitalize(t((error.type as FieldError).message as TSingleTranslationKey));
        } else if ('data' in error && error.data) {
            return capitalize(
                t(error.data.message as TPluralTranslationKey, { count: maxFileSize })
            );
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
                                !!fileError
                                    ? getFileErrorMessage(fileError)
                                    : capitalize(
                                          t(
                                              'square picture (png, jpg, jpeg, webp, or svg) with max file size: kb',
                                              {
                                                  count: 200
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
