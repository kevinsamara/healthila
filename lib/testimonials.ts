export type Testimonial = { quote: string; name: string; city: string; tone: "coral" | "sky" | "leaf" };

// From the previous healthila.id site. Add new ones here (or move to the CRM later).
export const testimonials: Testimonial[] = [
  {
    quote: "Buahnya segar banget dan kemasannya cantik. Cocok banget buat kado.",
    name: "Elri Astuti",
    city: "Malang",
    tone: "coral",
  },
  {
    quote: "Jus cold-pressednya enak, gak ada rasa gula tambahan. Recommended!",
    name: "Ari Pratama",
    city: "Malang",
    tone: "sky",
  },
];
