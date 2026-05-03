import braceletAgateBlack from "@/assets/product-bracelet-agate-black.jpg";
import braceletAgateLava from "@/assets/product-bracelet-agate-lava.jpg";
import braceletAgateLavaAmber from "@/assets/product-bracelet-agate-lava-amber.jpg";
import braceletLabradoriteHematite from "@/assets/product-bracelet-labradorite-hematite.jpg";
import braceletCitrineAgateLava from "@/assets/product-bracelet-citrine-agate-lava.jpg";
import braceletHematiteThin from "@/assets/product-bracelet-hematite-thin.jpg";
import braceletAzurmalachiteHematiteLava from "@/assets/product-bracelet-azurmalachite-hematite-lava.jpg";
import braceletSagittarius from "@/assets/product-bracelet-sagittarius.jpg";
import braceletRockCrystal from "@/assets/product-bracelet-rock-crystal.jpg";
import braceletMoonstoneAmethyst from "@/assets/product-bracelet-moonstone-amethyst.jpg";
import braceletAgateAmethystHematiteCitrine from "@/assets/product-bracelet-agate-amethyst-hematite-citrine.jpg";
import braceletAquamarineHematiteFlower from "@/assets/product-bracelet-aquamarine-hematite-flower.jpg";
import braceletCacholong from "@/assets/product-bracelet-cacholong.jpg";
import braceletAgateAquamarineSilver from "@/assets/product-bracelet-agate-aquamarine-silver.jpg";
import braceletWhiteOnyxSilver from "@/assets/product-bracelet-white-onyx-silver.jpg";
import braceletHematiteBasic from "@/assets/product-bracelet-hematite-basic.jpg";
import braceletHematiteMultilayer from "@/assets/product-bracelet-hematite-multilayer.jpg";
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
    id: "br-labradorite-hematite",
    category: "bracelets",
    name: "Лаврикит и гематит · спокойствие и защита",
    mood: "Лаврикит для душевного равновесия и гематит-защитник — стиль со смыслом",
    materials: "натуральный лаврикит, гематит, бусины 8 мм",
    size: "17 см",
    price: "1 300 ₽",
    image: braceletLabradoriteHematite,
  },
  {
    id: "br-citrine-agate-lava",
    category: "bracelets",
    name: "Цитрин, агат и лава · солнечный баланс",
    mood: "Солнечный цитрин, спокойный агат и сила вулканической лавы — три стихии в одном браслете",
    materials: "натуральный цитрин, агат, вулканическая лава, бусины 8 мм",
    size: "18 см",
    price: "1 500 ₽",
    image: braceletCitrineAgateLava,
  },
  {
    id: "br-hematite-thin",
    category: "bracelets",
    name: "Гематит · стальная грация",
    mood: "Изящный браслет со стальным блеском — сдержанная элегантность с характером",
    materials: "натуральный гематит, бусины 4 мм с двумя ажурными акцентами",
    size: "15 см",
    price: "750 ₽",
    image: braceletHematiteThin,
  },
  {
    id: "br-azurmalachite-hematite-lava",
    category: "bracelets",
    name: "Азурмалахит, гематит и лава · игра текстур",
    mood: "Глубокий азурмалахит, графичный гематит и тёплая пористая лава — игра объёма и фактуры",
    materials: "натуральный азурмалахит, гематит, вулканическая лава, бусины 8 и 10 мм",
    size: "18 см",
    price: "1 600 ₽",
    image: braceletAzurmalachiteHematiteLava,
  },
  {
    id: "br-sagittarius",
    category: "bracelets",
    name: "Стрелец · агат, аметист и аквамарин",
    mood: "Браслет для огненного Стрельца с серебряным кулоном-знаком зодиака в фианитах",
    materials: "натуральный агат, аметист, аквамарин, бусины 8 мм, серебряный кулон со знаком Стрельца с фианитами",
    size: "17 см",
    price: "1 600 ₽",
    image: braceletSagittarius,
  },
  {
    id: "br-rock-crystal",
    category: "bracelets",
    name: "Горный хрусталь · ледяная чистота",
    mood: "Прозрачный искристый браслет — словно горный ручей и кусочек зимы на запястье",
    materials: "натуральный горный хрусталь, гранёные бусины 8 мм, фурнитура серебро 925 пробы",
    size: "16 см",
    price: "2 500 ₽",
    image: braceletRockCrystal,
  },
  {
    id: "br-agate-amethyst-hematite-citrine",
    category: "bracelets",
    name: "Агат, аметист, гематит и цитрин · сияние звезды",
    mood: "Энергия четырёх камней и сияющая подвеска-звезда — для тех, кто любит украшения с характером и блеском",
    materials: "натуральный агат, аметист, гематит, цитрин, бусины 8 мм, подвеска-звезда",
    size: "17 см",
    price: "1 500 ₽",
    image: braceletAgateAmethystHematiteCitrine,
  },
  {
    id: "br-aquamarine-hematite-flower",
    category: "bracelets",
    name: "Аквамарин и гематит · цветок на запястье",
    mood: "Нежный аквамарин и строгий гематит в дуэте контраста и гармонии — с сияющей застёжкой-цветком в фианитах",
    materials: "натуральный аквамарин, гематит, бусины 8 мм, застёжка-цветок с фианитами",
    size: "17 см",
    price: "1 700 ₽",
    image: braceletAquamarineHematiteFlower,
  },
  {
    id: "br-cacholong",
    category: "bracelets",
    name: "Опал-кахолонг · чистота в каждой бусине",
    mood: "Молочно-белое сияние кахолонга — простота как высшая форма изящества",
    materials: "натуральный опал-кахолонг, бусины 8 и 9,5 мм",
    size: "18 см",
    price: "2 200 ₽",
    image: braceletCacholong,
  },
  {
    id: "br-agate-aquamarine-silver",
    category: "bracelets",
    name: "Агат и аквамарин · дебют в серебре",
    mood: "Прохладный аквамарин и мудрый серый агат в достойной оправе серебра 925 пробы",
    materials: "натуральный агат, аквамарин, бусины 8 мм, фурнитура серебро 925 пробы",
    size: "17 см",
    price: "1 800 ₽",
    image: braceletAgateAquamarineSilver,
  },
  {
    id: "br-moonstone-amethyst",
    category: "bracelets",
    name: "Лунный камень и аметист · мягкое сияние",
    mood: "Лунный свет и магия аметиста — талисман интуиции и душевного равновесия",
    materials: "натуральный лунный камень, аметист, бусины-подвеска, фурнитура серебро 925 пробы",
    size: "17 см",
    price: "2 600 ₽",
    image: braceletMoonstoneAmethyst,
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
