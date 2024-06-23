'use client';

import { ICoords, IGeoData, TTranslateFn } from '@/app/lib/types';
import { useI18n } from '@/locales/client';
import { Box, MenuItem, Typography, capitalize } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { Control, FieldValues, useForm } from 'react-hook-form';
import { z } from 'zod';
import FormSelect from '../form-select/FormSelect';
import { StyledForm } from './styled';
import { ICountryFormProps } from './types';

export const getCountryRegistrationSchema = (t: TTranslateFn) => {
    return z.object({
        countryId: z
            .string({
                required_error: 'please enter the country',
                invalid_type_error: 'please enter the country'
            })
            .min(10, { message: 'please enter the country' })
    });
};

export type TCountryRegistrationForm = z.infer<ReturnType<typeof getCountryRegistrationSchema>>;

const CountryRegistrationForm: FC<ICountryFormProps> = ({ countries }) => {
    const t = useI18n();

    const [geoData, setGeoData] = useState<IGeoData | null>(null);
    const [location, setLocation] = useState<ICoords | null>(null);

    const {
        // watch,
        control,
        setValue,
        formState: { /* dirtyFields, isDirty,  */ errors }
    } = useForm<TCountryRegistrationForm, null, TCountryRegistrationForm>({
        defaultValues: {
            countryId: ''
        }
    });

    const fetchApiData = async ({ latitude, longitude }: ICoords) => {
        // Free to use GEO Data API.
        // https://www.bigdatacloud.com/free-api/free-reverse-geocode-to-city-api
        // It being free, I may need to change it in the future.
        const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude==${latitude}&longitude=${longitude}&localityLanguage=en`
        );
        const data = await res.json();
        setGeoData(data);
    };

    useEffect(() => {
        if ('geolocation' in navigator) {
            // Retrieve latitude & longitude coordinates from `navigator.geolocation` Web API
            navigator.geolocation.getCurrentPosition(({ coords }) => {
                const { latitude, longitude } = coords;
                setLocation({ latitude, longitude });
            });
        }
    }, []);

    useEffect(() => {
        // Fetch data from API if `location` object is set
        if (location) {
            fetchApiData(location);
        }
    }, [location]);

    useEffect(() => {
        if (geoData) {
            const country =
                countries.find(
                    (country) =>
                        country.name.toLocaleLowerCase() ===
                        geoData?.countryName.toLocaleLowerCase()
                ) ?? null;
            if (country) {
                setValue('countryId', country?.id);
            }
        }
    }, [geoData]);

    // const w = watch();

    // useEffect(() => {
    //     console.log('Is Dirty:', isDirty);
    //     console.log('DirtyFields:', dirtyFields);
    //     console.log('Watch:', w);
    //     console.error('Errors:', errors);
    // }, [errors, w, dirtyFields]);

    return (
        <StyledForm onSubmit={() => {}}>
            <Typography variant='h4'>{capitalize(t('select your country'))}</Typography>
            <FormSelect
                name='countryId'
                label={capitalize(t('country'))}
                autoComplete='country'
                control={control as unknown as Control<FieldValues>}
                required
                error={!!errors.countryId}
                helperText={!!errors.countryId?.message && capitalize(errors.countryId.message)}
            >
                {countries.map((country) => {
                    return (
                        <MenuItem key={country.id} value={country.id}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {capitalize(country.name)}
                            </Box>
                        </MenuItem>
                    );
                })}
            </FormSelect>
        </StyledForm>
    );
};

export default CountryRegistrationForm;
