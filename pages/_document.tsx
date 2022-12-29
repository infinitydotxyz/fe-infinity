import NextDocument, { Html, Head, Main, NextScript } from 'next/document';
import { Preferences } from 'src/utils/preferences';
import { twMerge } from 'tailwind-merge';
import { GA_TRACKING_ID } from '../lib/ga/gtag';

export default class Document extends NextDocument {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* Warning: viewport meta tags should not be used in _document.js's <Head>. https://nextjs.org/docs/messages/no-document-viewport-meta */}
          {/* <meta name="viewport" content="width=device-width, initial-scale=1" /> */}

          {/* Global Site Tag (gtag.js) - Google Analytics */}
          {
            <>
              <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`} />
              <script
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{
                  __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${GA_TRACKING_ID}', {
                    page_path: window.location.pathname,
                    });
                    `
                }}
              />
            </>
          }
        </Head>
        <body className={twMerge(Preferences.darkMode() ? 'dark' : 'light')}>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
