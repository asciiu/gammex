import Document, { Head, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
  static async getInitialProps(ctx: any) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <html>
        <Head>
          <title>gammex</title>
          <script src="https://www.google.com/recaptcha/api.js?onload=onloadCallback&render=explicit" async defer></script>
          <script src="https://code.createjs.com/easeljs-0.8.2.min.js"></script>
          <script src="https://code.createjs.com/1.0.0/tweenjs.min.js"></script>
          <script src="https://code.createjs.com/1.0.0/preloadjs.min.js"></script>
        </Head>
        <body className="custom_class">
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}