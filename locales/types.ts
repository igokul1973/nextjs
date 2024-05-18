import { enPlural, enSingle } from './en';

export type TSingleTranslationKey = keyof typeof enSingle;
export type TPluralTranslationKeyRaw = keyof typeof enPlural;

export type TPluralTranslationKey<
    S extends TPluralTranslationKeyRaw = TPluralTranslationKeyRaw,
    K extends string = '#many'
> = S extends `${infer T}${K}` ? T : never;
