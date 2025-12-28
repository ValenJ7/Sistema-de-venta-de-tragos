import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectCreative } from "swiper/modules";

import img1 from "../assets/home/imagen1.webp";
import img2 from "../assets/home/imagen2.jpg";
import img3 from "../assets/home/imagen3.jpg";

export function HomeStorySection() {
  return (
    <section className=" relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen">

      <div className="w-full">
        <div className=" bg-orange-100 shadow-sm  overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4 lg:p-5 items-center">
           {/* TEXTO */}
            <div className="max-w-2xl">
                <p className="text-base font-semibold text-orange-600">
                    Quiénes somos
                </p>

                <h2 className="mt-2 text-5xl font-black text-slate-900 tracking-tight">
                    Donde nace la noche
                </h2>

                <p className="mt-5 text-lg text-slate-700 leading-relaxed">
                    Somos una coctelería y boliche pensada para arrancar suave y terminar arriba:
                    luces bajas, barra encendida y una vibra que se siente apenas entrás.
                </p>

                <p className="mt-4 text-lg text-slate-700 leading-relaxed">
                    Acá la música marca el pulso y los tragos acompañan el momento: clásicos bien hechos,
                    autor de la casa y combinaciones que sorprenden sin perder estilo.
                </p>

                <p className="mt-4 text-lg text-slate-700 leading-relaxed">
                    Cada fin de semana es una historia distinta: DJs invitados, sets en vivo, brindis
                    espontáneos y una pista que se prende cuando la noche pide más. Vení con tu gente,
                    elegí tu trago y dejate llevar.
                </p>
            </div>


            {/* SLIDER */}
            <div className="w-full">
              <div className="rounded-xl overflow-hidden ">
                <Swiper
                  modules={[Autoplay, Pagination, EffectCreative]}
                  effect="creative"
                  creativeEffect={{
                    prev: {
                      shadow: true,
                      translate: ["-12%", 0, -120],
                      scale: 0.94,
                    },
                    next: {
                      shadow: true,
                      translate: ["12%", 0, -120],
                      scale: 0.94,
                    },
                  }}
                  centeredSlides
                  grabCursor
                  loop
                  speed={300}
                  autoplay={{ delay: 1200, disableOnInteraction: false }}
                  pagination={{ clickable: true }}
                  className="w-full"
                >
                  {[img1, img2, img3].map((src, i) => (
                    <SwiperSlide key={i}>
                      <img
                        src={src}
                        alt={`Slide ${i + 1}`}
                        className="w-full h-44 sm:h-52 lg:h-56 object-cover"
                        loading="lazy"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
