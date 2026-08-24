

import { HeroSlider } from "@/components/modules/home/hero/HeroSlider";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>Realo Style - Trendy Fashion & Lifestyle Products Online</title>
        <meta
          name="description"
          content="Shop the latest fashion trends at Realo Style. Discover stylish clothing, accessories, and lifestyle products at great prices with fast and secure online shopping."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <HeroSlider />
        
      </main>
    </>
  );
}

