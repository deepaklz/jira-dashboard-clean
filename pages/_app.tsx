// pages/_app.tsx - App initialization

import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { SWRConfig } from 'swr';
import Head from 'next/head';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>MIS Dashboard - JIRA Analytics</title>
        <meta name="description" content="Advanced JIRA analytics and sprint metrics dashboard" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <SWRConfig
        value={{
          refreshInterval: 3600000, // Auto-refresh every hour
          revalidateOnFocus: false,
          revalidateOnReconnect: true,
          dedupingInterval: 10000,
          fetcher: (url: string) => fetch(url).then(res => res.json()),
        }}
      >
        <Component {...pageProps} />
      </SWRConfig>
    </>
  );
}
