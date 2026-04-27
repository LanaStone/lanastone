import braceletAgateBlack from "@/assets/product-bracelet-agate-black.jpg";
import braceletAgateLava from "@/assets/product-bracelet-agate-lava.jpg";
import braceletAgateLavaAmber from "@/assets/product-bracelet-agate-lava-amber.jpg";
import necklace1 from "@/assets/product-necklace-1.jpg";
import necklace2 from "@/assets/product-necklace-2.jpg";
import necklace3 from "@/assets/product-necklace-3.jpg";
import charm1 from "@/assets/product-charm-1.jpg";
import charm2 from "@/assets/product-charm-2.jpg";
import custom1 from "@/assets/product-custom-1.jpg";

export type ProductCategory = "bracelets" | "necklaces" | "charms" | "custom";

export interface Product {
  id: string;
  category: ProductCategory;
  name: string;
  mood: string;
  materials: string;
  size: string;
  price: string;
  image: string;
}

export const categories: { id: ProductCategory; label: string }[] = [
  { id: "bracelets", label: "Браслеты" },
  { id: "necklaces", label: "Колье и чокеры" },
  { id: "charms", label: "Обвесы и акценты" },
  { id: "custom", label: "Под заказ" },
];

export const products: Product[] = [
  {
    id: "br-agate-black",
    category: "bracelets",
    name: "Чёрный агат · грани силы",
    mood: "Сдержанная сила в каждой грани — браслет, который приятно держать в руках",
    materials: "натуральный чёрный агат, многогранные бусины 10 мм, прочная резинка",
    size: "17 см",
    price: "1 700 ₽",
    image: braceletAgateBlack,
  },
  {
    id: "br-agate-lava",
    category: "bracelets",
    name: "Агат и лава · баланс стихий",
    mood: "Гармония агата и сила вулканической лавы — между энергией и умиротворением",
    materials: "натуральный агат, вулканическая лава, бусины 8 мм",
    size: "19 см",
    price: "1 500 ₽",
    image: braceletAgateLava,
  },
  {
    id: "br-agate-lava-amber",
    category: "bracelets",
    name: "Агат, лава и янтарь · солнце в камне",
    mood: "Янтарь как застывший солнечный свет в чёрной оправе агата и лавы",
    materials: "натуральный агат, вулканическая лава, янтарь, бусины 8 мм",
    size: "18 см",
    price: "1 700 ₽",
    image: braceletAgateLavaAmber,
  },
  {
    id: "nk-1",
    category: "necklaces",
    name: "Чёрное сердце",
    mood: "Сдержанность с характером",
    materials: "агат, горный хрусталь, серебро",
    size: "длина 78 см",
    price: "8 600 ₽",
    image: necklace1,
  },
  {
    id: "nk-2",
    category: "necklaces",
    name: "Лунный чокер",
    mood: "Мягкое сияние",
    materials: "лунный камень, аметист, серебро 925",
    size: "длина 38 см",
    price: "5 400 ₽",
    image: necklace2,
  },
  {
    id: "nk-3",
    category: "necklaces",
    name: "Тихий рассвет",
    mood: "Глубина и спокойствие",
    materials: "агат, серый шёлк",
    size: "длина 64 см",
    price: "6 700 ₽",
    image: necklace3,
  },
  {
    id: "ch-1",
    category: "charms",
    name: "Розовая капля",
    mood: "Деликатный акцент",
    materials: "розовый кварц, серебро",
    size: "длина 42 см",
    price: "3 600 ₽",
    image: charm1,
  },
  {
    id: "ch-2",
    category: "charms",
    name: "Жемчужная грань",
    mood: "Нежная вертикаль",
    materials: "жемчуг, аметист, серебро",
    size: "длина 45 см",
    price: "3 900 ₽",
    image: charm2,
  },
  {
    id: "cu-1",
    category: "custom",
    name: "Ваш собственный образ",
    mood: "Создаётся под вас",
    materials: "по выбору — натуральные камни",
    size: "по индивидуальным меркам",
    price: "от 5 000 ₽",
    image: custom1,
  },
];
