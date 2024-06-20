import { z } from 'zod';
import { getSettingsUpdateSchema } from './formSchema';

export type TSettingsForm = z.input<ReturnType<typeof getSettingsUpdateSchema>>;
export type TSettingsFormOutput = z.output<ReturnType<typeof getSettingsUpdateSchema>>;
