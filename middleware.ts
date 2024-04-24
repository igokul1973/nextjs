// import NextAuth from 'next-auth';
import NextAuth from 'next-auth';
import { createI18nMiddleware } from 'next-international/middleware';
import { NextRequest } from 'next/server';
import { authConfig } from './auth.config';
import { LocaleEnum } from './app/lib/types';

const I18nMiddleware = createI18nMiddleware({
    locales: [LocaleEnum.en_US, LocaleEnum.sv_SE],
    defaultLocale: LocaleEnum.en_US,
    urlMappingStrategy: 'rewrite' as 'redirect' | 'rewrite' | 'rewriteDefault'
});

export default NextAuth(authConfig).auth((request: NextRequest) => {
    return I18nMiddleware(request);
});

// new
export const config = {
    matcher: ['/((?!api|static|.*\\..*|_next|favicon.ico|robots.txt).*)']
};
