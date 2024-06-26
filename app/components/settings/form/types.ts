import { z } from 'zod';
import { getSettingsCreateSchema, getSettingsUpdateSchema } from './formSchema';

export type TCreateSettingsForm = z.input<ReturnType<typeof getSettingsCreateSchema>>;
export type TUpdateSettingsForm = z.input<ReturnType<typeof getSettingsUpdateSchema>>;
export type TCreateSettingsFormOutput = z.output<ReturnType<typeof getSettingsCreateSchema>>;
export type TUpdateSettingsFormOutput = z.output<ReturnType<typeof getSettingsUpdateSchema>>;
