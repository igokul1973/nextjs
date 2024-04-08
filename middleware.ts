// import NextAuth from 'next-auth';
import NextAuth from 'next-auth';
import { createI18nMiddleware } from 'next-international/middleware';
import { NextRequest } from 'next/server';
import { authConfig } from './auth.config';

const I18nMiddleware = createI18nMiddleware({
    locales: ['en', 'sv'],
    defaultLocale: 'sv',
    urlMappingStrategy: 'rewrite'
});

export default NextAuth(authConfig).auth((request: NextRequest) => {
    return I18nMiddleware(request);
});

// new
export const config = {
    matcher: ['/((?!api|static|.*\\..*|_next|favicon.ico|robots.txt).*)']
};
