"use client";

import { FC } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import Image from "next/image";
import { reviews } from "@/utils/reviews";

const About: FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % reviews.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, []);

  return (
    <main className="w-screen min-h-screen flex flex-col items-center">
      <div className="text-center py-10">
        <h1 className="text-5xl font-extrabold text-gray-800 drop-shadow-md tracking-wide font-playfair">
          Papirna čarolija
        </h1>
        <p className="text-gray-600 mt-6 text-2xl font-poppins">
          Ručno rađene torte koje donose osmijeh i radost!
        </p>
      </div>

      <section className="flex flex-col md:flex-row justify-center items-center md:items-stretch max-w-6xl w-full px-6 md:px-10 py-8 gap-8">
        <div className="grid grid-cols-1 md:w-1/2">
          <Image
            src="https://lwmchmwtdietfkcnhyab.supabase.co/storage/v1/object/public/cake-images/torta.jpg"
            alt="Torta"
            height={1250}
            width={850}
            className="rounded-lg shadow-lg hover:scale-105 transition-transform duration-300 object-cover border-white h-full"
          />
        </div>

        <div className="md:w-1/2 bg-white rounded-lg shadow-md p-6 text-gray-700 leading-relaxed hover:scale-105 transition-transform duration-300 text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 font-poppins">
            O meni
          </h2>
          <p className="mb-3 text-justify">
            Zovem se Merisa, i već dugo godina izrađujem torte od papira s puno
            ljubavi i pažnje na detalje. Sve je počelo kao hobi, a pretvorilo se
            u prelijepu priču punu boja, mašte i osmijeha. Svaka torta je ručni
            rad: jedinstvena, vesela i stvorena da obraduje.
          </p>
          <p className="mb-3 text-justify">
            Inspiraciju nalazim u osmijehu onih koji je poklone i prime i
            najveća nagrada za moj rad je kad mi javite da je nekome torta
            izmamila osmijeh. Vjerujem da svaki poklon treba imati dušu, a moje
            torte upravo to nose: ljubav, pažnju, trud i emociju u svakom sloju
            papira.
          </p>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            O tortama
          </h2>
          <p className="mb-3 text-xl">
            Dobrodošli u Papirnu čaroliju. 🎀 <br /> Mjesto gdje pokloni postaju
            uspomene!
          </p>
          <br />
          <p className="mb-3 text-justify">
            Izrađujem unikatne papirne torte koje se mogu puniti slatkišima,
            sitnicama i iznenađenjima, a savršene su za rođendane, vrtiće,
            mature, diplome i sve posebne prilike. Svaka torta dolazi s
            čestitkom i može biti prazna ili puna, po vašoj želji.
          </p>
          <br></br>
          <p className="mb-3 text-justify">
            <p className="mb-3 text-xl text-center">
              💝 Poklonite osmijeh uz čaroliju papira!
            </p>
            <br /> Za sva pitanja, dodatne informacije (cijene, adresa, kontakt
            telefon), sugestije slobodno se obratite putem e-mail-a ili FB
            stranice.
          </p>
        </div>
      </section>

      <div className="my-12 w-full flex justify-center">
        <div className="w-full max-w-6xl px-6 md:px-10">
          <iframe
            src="https://maps.google.com/maps?width=1000&&height=600&hl=en&q=Adija%20Mulabegovi%C4%87a%206&t=&z=14&ie=UTF8&iwloc=B&output=embed"
            className="w-full h-96 rounded-md shadow-2xl"
            loading="lazy"
          ></iframe>
        </div>
      </div>

      <div className="relative h-30 flex flex-col items-center justify-center overflow-hidden mb-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <p className="sm:text-2xl font-semibold">
              {reviews[index].message}
            </p>
            <p className="sm:text-xl text-gray-500 mt-4">
              — {reviews[index].author}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
};

export default About;
