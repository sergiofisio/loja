import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Testimonials({ testimonials, user }) {
  const [testimonialPagination, setTestimonialPagination] = useState(0);
  useEffect(() => {
    setTimeout(() => {
      if (testimonialPagination === 2) {
        return setTestimonialPagination(0);
      }
      return setTestimonialPagination(testimonialPagination + 1);
    }, 5000);
  }, [testimonialPagination]);
  return (
    <section className=" p-32 flex ">
      <div className=" flex bg-[#c5ead9] rounded-2xl p-14 gap-[7%]">
        <div className=" flex flex-col justify-center w-full gap-5 text-black font-main text-5xl font-bold text-start">
          <h2>Depoimentos</h2>
          <p className="font-special text-3xl font-[250]">
            Veja o que nossos usuários estão achando dos nossos produtos.
          </p>
        </div>
        {testimonials.length
          ? testimonials
              .slice(testimonialPagination, testimonialPagination + 1)
              .map((testimonial, key) => {
                return (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key={key}
                    className="w-full max-h-full flex justify-center items-center p-6 rounded-2xl bg-green rounded-tl-none shadow-md shadow-black-500/40 gap-[5%] transition-all duration-500 ease-in-out"
                  >
                    <div className="text-white font-main text-3xl font-bold flex flex-col text-center gap-4">
                      <h1>{testimonial.nome}</h1>
                      <p className="text-sm text-black">{testimonial.texto}</p>
                    </div>
                  </motion.div>
                );
              })
          : ""}
      </div>
    </section>
  );
}
