import Head from 'next/head'
import HomeComponent from '@/component/Home';
import dynamic from 'next/dynamic'
// import p5Types from 'p5'

const Sketch = dynamic(import('react-p5'), {
  loading: () => <></>,
  ssr: false
})

export default function Home() {
  return (
    <div>
      <Head>
        <title>Poker Tools</title>
        <meta name="description" content="Simplified hand range chart of no-limit hold'em" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      <HomeComponent />
    </div>
  )
}
