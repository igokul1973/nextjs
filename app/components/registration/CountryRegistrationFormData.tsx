import { getCountries } from '@/app/lib/data/country';
import { FC } from 'react';
import CountryRegistrationForm from './CountryRegistrationForm';

const CountryRegistrationFormData: FC = async () => {
    const countries = await getCountries();
    return <CountryRegistrationForm countries={countries} />;
};

export default CountryRegistrationFormData;
