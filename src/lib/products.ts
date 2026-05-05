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
import braceletPearlHorseSilver from "@/assets/product-bracelet-pearl-horse-silver.jpg";
import braceletMoonstoneSilver from "@/assets/product-bracelet-moonstone-silver.jpg";
import braceletMoonstoneButterfly from "@/assets/product-bracelet-moonstone-butterfly.jpg";
import braceletBlackAgateRedGlass from "@/assets/product-bracelet-black-agate-red-glass.jpg";
import braceletBlackAgateRedHeart from "@/assets/product-bracelet-black-agate-red-heart.jpg";
import braceletRockCrystalAgate from "@/assets/product-bracelet-rock-crystal-agate.jpg";
import braceletBlackAgateFacetedSilver from "@/assets/product-bracelet-black-agate-faceted-silver.jpg";
import braceletMoonstoneAmethystCharm from "@/assets/product-bracelet-moonstone-amethyst-charm.jpg";
import braceletBlackAgateGraphite from "@/assets/product-bracelet-black-agate-graphite.jpg";
import braceletGarnetSilver from "@/assets/product-bracelet-garnet-silver.jpg";
import braceletWhiteOnyxSilver from "@/assets/product-bracelet-white-onyx-silver.jpg";
import braceletHematiteBasic from "@/assets/product-bracelet-hematite-basic.jpg";
import braceletHematiteMultilayer from "@/assets/product-bracelet-hematite-multilayer.jpg";
import braceletLarvikiteSilver from "@/assets/product-bracelet-larvikite-silver.jpg";
import braceletBlackAgateCubeChain from "@/assets/product-bracelet-black-agate-cube-chain.jpg";
import braceletLavaAgateCitrine from "@/assets/product-bracelet-lava-agate-citrine.jpg";
import necklaceHematiteRhodium from "@/assets/product-necklace-hematite-rhodium.jpg";
import necklaceHematiteCharms from "@/assets/product-necklace-hematite-charms.jpg";
import necklacePearlHeart from "@/assets/product-necklace-pearl-heart.jpg";
import necklacePearlFlower from "@/assets/product-necklace-pearl-flower.jpg";
import necklacePearlHorse from "@/assets/product-necklace-pearl-horse.jpg";
import necklaceMarcasiteAgateBow from "@/assets/product-necklace-marcasite-agate-bow.jpg";
import charmBlackAgateBag from "@/assets/product-charm-black-agate-bag.jpg";
import charmRockCrystal from "@/assets/product-charm-rock-crystal.jpg";
import charmBlackAgateFaceted from "@/assets/product-charm-black-agate-faceted.jpg";
import charmHematiteHorse from "@/assets/product-charm-hematite-horse.jpg";
import necklaceBlackAgateHeart from "@/assets/product-necklace-black-agate-heart.jpg";
import setHematiteRhodium from "@/assets/product-set-hematite-rhodium.jpg";

export type ProductCategory = "bracelets" | "necklaces" | "charms";

export interface Product {
  id: string;
  category: ProductCategory;
  name: string;
  mood: string;
  materials: string;
  size: string;
  price: string;
  image: string;
  badge?: string;
}

export const categories: { id: ProductCategory; label: string }[] = [
  { id: "bracelets", label: "Браслеты" },
  { id: "necklaces", label: "Колье и чокеры" },
  { id: "charms", label: "Обвесы и акценты" },
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
    mood: "Браслет для огненного Стрельца с кулоном-знаком зодиака в фианитах",
    materials: "натуральный агат, аметист, аквамарин, бусины 8 мм, кулон со знаком Стрельца и фианитами",
    size: "17 см",
    price: "1 600 ₽",
    image: braceletSagittarius,
  },
  {
    id: "br-larvikite-silver",
    category: "bracelets",
    name: "Лаврикит и серебро · глубина северного сияния",
    mood: "Сдержанная мужская энергия и таинственные серебристо-синие переливы «камня северного сияния»",
    materials: "натуральный лаврикит, бусины 8 мм, фурнитура серебро 925 пробы",
    size: "18 см",
    price: "1 600 ₽",
    image: braceletLarvikiteSilver,
    badge: "Мужской",
  },
  {
    id: "br-black-agate-cube-chain",
    category: "bracelets",
    name: "Чёрный агат · кубы на родиевой цепи",
    mood: "Идеальные кубы чёрного агата на стильной цепочке с родиевым покрытием — холодный блеск и устойчивость",
    materials: "натуральный чёрный агат, кубы 8 мм, цепочка с родиевым покрытием",
    size: "18 см",
    price: "1 600 ₽",
    image: braceletBlackAgateCubeChain,
  },
  {
    id: "br-lava-agate-citrine",
    category: "bracelets",
    name: "Лава, агат и цитрин · три стихии",
    mood: "Сила земли в лаве, защита агата и солнечный оптимизм цитрина — три энергии в одном браслете",
    materials: "натуральная вулканическая лава, агат, цитрин, бусины 8 мм",
    size: "18 см",
    price: "1 800 ₽",
    image: braceletLavaAgateCitrine,
  },
  {
    id: "br-white-onyx-silver",
    category: "bracelets",
    name: "Белый оникс и серебро · спокойная уверенность",
    mood: "Кремовый белый оникс с лунным рисунком в холодной оправе серебра — унисекс и универсальность",
    materials: "натуральный белый оникс, бусины 8 мм, фурнитура серебро 925 пробы",
    size: "17,5 см",
    price: "1 800 ₽",
    image: braceletWhiteOnyxSilver,
  },
  {
    id: "br-hematite-basic",
    category: "bracelets",
    name: "Гематит · базовый стилевой союзник",
    mood: "Прохладный металлический блеск и стальная глубина — идеальная база и абсолютный унисекс",
    materials: "натуральный гематит, бусины 6,5 мм",
    size: "17 см",
    price: "1 300 ₽",
    image: braceletHematiteBasic,
  },
  {
    id: "br-hematite-multilayer",
    category: "bracelets",
    name: "Гематит · многослойная геометрия",
    mood: "Игра форм и оттенков сталинисто-серого — сдержанная геометрия и тактильный холодный блеск",
    materials: "натуральный гематит, разноформатные бусины, застёжка-карабин",
    size: "17 см",
    price: "1 500 ₽",
    image: braceletHematiteMultilayer,
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
    name: "Агат и аквамарин · невероятная гармония",
    mood: "Прохладный аквамарин и мудрый серый агат в достойной оправе серебра 925 пробы",
    materials: "натуральный агат, аквамарин, бусины 8 мм, фурнитура серебро 925 пробы",
    size: "17 см",
    price: "1 800 ₽",
    image: braceletAgateAquamarineSilver,
  },
  {
    id: "br-pearl-horse-silver",
    category: "bracelets",
    name: "Жемчуг и серебро · подвеска-лошадка",
    mood: "Натуральный жемчуг с тёплым переливом и серебряная подвеска-лошадка — идеальный подарок",
    materials: "натуральный жемчуг, фурнитура и подвеска-лошадка из серебра 925 пробы",
    size: "16+ см",
    price: "3 200 ₽",
    image: braceletPearlHorseSilver,
  },
  {
    id: "br-moonstone-silver",
    category: "bracelets",
    name: "Лунный камень и серебро · лунная магия",
    mood: "Прохладное сияние натурального лунного камня в обрамлении серебра — сдержанно и женственно",
    materials: "натуральный лунный камень, фурнитура серебро 925 пробы",
    size: "17+ см",
    price: "3 600 ₽",
    image: braceletMoonstoneSilver,
  },
  {
    id: "br-moonstone-butterfly",
    category: "bracelets",
    name: "Лунный камень · бабочка-трансформация",
    mood: "Тихая магия лунного камня и серебряная бабочка — символ трансформации и нежной красоты",
    materials: "натуральный лунный камень, серебряная подвеска-бабочка, фурнитура серебро 925 пробы",
    size: "17+ см",
    price: "3 600 ₽",
    image: braceletMoonstoneButterfly,
  },
  {
    id: "br-black-agate-red-glass",
    category: "bracelets",
    name: "Чёрный агат · красные акценты",
    mood: "Матовый чёрный агат с сочными вставками из красного стекла — графичный контраст и характер",
    materials: "натуральный матовый чёрный агат, вставки из красного стекла, бусины 8 мм",
    size: "17 см",
    price: "1 500 ₽",
    image: braceletBlackAgateRedGlass,
  },
  {
    id: "br-black-agate-red-heart",
    category: "bracelets",
    name: "Чёрный агат · красное сердце",
    mood: "Матовый чёрный агат и глубокое бордовое стеклянное сердце — страсть и энергия в нужном русле",
    materials: "натуральный матовый чёрный агат, стеклянная подвеска-сердце, бусины 8 мм",
    size: "17 см",
    price: "1 500 ₽",
    image: braceletBlackAgateRedHeart,
  },
  {
    id: "br-rock-crystal-agate",
    category: "bracelets",
    name: "Горный хрусталь и агат · идеальный спутник",
    mood: "Чистота горного хрусталя и гармония натурального агата — классика на каждый день",
    materials: "натуральный горный хрусталь, агат, гранёные бусины 8 мм",
    size: "17 см",
    price: "1 700 ₽",
    image: braceletRockCrystalAgate,
  },
  {
    id: "br-black-agate-faceted-silver",
    category: "bracelets",
    name: "Чёрный агат · многогранное сияние",
    mood: "Прохладные многогранные бусины ловят свет — успокаивающий акцент с серебром 925",
    materials: "натуральный чёрный агат, многогранные бусины 4 мм, фурнитура серебро 925 пробы",
    size: "16+ см",
    price: "2 800 ₽",
    image: braceletBlackAgateFacetedSilver,
  },
  {
    id: "br-moonstone-amethyst-charm",
    category: "bracelets",
    name: "Лунный камень и аметист · талисман интуиции",
    mood: "Мягкое сияние лунного камня и мудрость аметиста — благородный талисман и роскошный подарок",
    materials: "натуральный лунный камень, аметист, подвеска-бусина, фурнитура серебро 925 пробы",
    size: "17 см",
    price: "2 600 ₽",
    image: braceletMoonstoneAmethystCharm,
  },
  {
    id: "br-black-agate-graphite",
    category: "bracelets",
    name: "Чёрный агат · графитовый блеск",
    mood: "Сдержанная роскошь и игра граней — оберег уверенности и спокойствия",
    materials: "натуральный чёрный агат, многогранные бусины 5 мм",
    size: "16 см",
    price: "1 700 ₽",
    image: braceletBlackAgateGraphite,
  },
  {
    id: "br-garnet-silver",
    category: "bracelets",
    name: "Гранат и серебро · огонь внутри",
    mood: "Многогранные бусины граната сияют как маленькие рубины — страсть, энергия и вдохновение",
    materials: "натуральный гранат, многогранные бусины 4 мм, фурнитура серебро 925 пробы",
    size: "16 см",
    price: "1 700 ₽",
    image: braceletGarnetSilver,
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
    id: "nk-hematite-rhodium",
    category: "necklaces",
    name: "Гематит и родий · стальной блеск",
    mood: "Матовая металлическая серьёзность гематита и зеркальный блеск родиевой цепи",
    materials: "натуральный гематит, цепь с родиевым покрытием",
    size: "длина 45 см",
    price: "2 500 ₽",
    image: necklaceHematiteRhodium,
    badge: "На заказ",
  },
  {
    id: "nk-hematite-charms",
    category: "necklaces",
    name: "Гематит и родий · колье с подвесками",
    mood: "Матовая серьёзность гематита и родиевые цепочки-подвески — драматичный акцент с характером",
    materials: "натуральный гематит, цепь с родиевым покрытием, подвески-звёзды и луна",
    size: "длина 45 см",
    price: "2 500 ₽",
    image: necklaceHematiteCharms,
  },
  {
    id: "nk-pearl-heart",
    category: "necklaces",
    name: "Жемчуг · чокер с сердцем",
    mood: "Нежный жемчужный чокер с подвеской-сердцем — романтичный акцент на каждый день",
    materials: "натуральный жемчуг, подвеска-сердце, регулируемая цепочка",
    size: "длина 45+ см",
    price: "3 500 ₽",
    image: necklacePearlHeart,
    badge: "На заказ",
  },
  {
    id: "nk-pearl-flower",
    category: "necklaces",
    name: "Жемчуг · чокер с цветком в фианитах",
    mood: "Изысканный жемчужный чокер с сияющей серединкой-цветком — утончённая женственность",
    materials: "натуральный жемчуг, центральная подвеска-цветок с фианитами, регулируемая цепочка",
    size: "длина 40+ см",
    price: "4 100 ₽",
    image: necklacePearlFlower,
    badge: "На заказ",
  },
  {
    id: "nk-pearl-horse",
    category: "necklaces",
    name: "Жемчуг · чокер к году Лошади",
    mood: "Жемчужный чокер с подвеской-лошадкой в позолоте — символ года и тёплый подарок",
    materials: "натуральный жемчуг, серебро 925 пробы с позолотой, подвеска-лошадка",
    size: "длина 40+ см",
    price: "4 700 ₽",
    image: necklacePearlHorse,
  },
  {
    id: "nk-marcasite-agate-bow",
    category: "necklaces",
    name: "Марказит и агат · чокер-бантик",
    mood: "Нежный и женственный бантик из многогранных бусин — максимальное сияние и романтика",
    materials: "натуральный марказит, агат, многогранные бусины 3 мм",
    size: "длина 40+ см",
    price: "2 300 ₽",
    image: necklaceMarcasiteAgateBow,
  },
  {
    id: "ch-black-agate-bag",
    category: "charms",
    name: "Чёрный агат · обвес для сумки",
    mood: "Деталь с характером — оживит сумку, рюкзак или поясную петлю брюк",
    materials: "натуральный чёрный агат, подвеска-замок и сердце, фурнитура латунь с родиевым покрытием",
    size: "универсальный",
    price: "2 000 ₽",
    image: charmBlackAgateBag,
  },
  {
    id: "ch-rock-crystal",
    category: "charms",
    name: "Горный хрусталь · кристальная актуальность",
    mood: "Прозрачные грани играют на свету — словно кристаллы льда и бриллиантовая россыпь",
    materials: "натуральный горный хрусталь, гранёные бусины, подвески-сердце и замок",
    size: "универсальный",
    price: "2 200 ₽",
    image: charmRockCrystal,
  },
  {
    id: "ch-black-agate-faceted",
    category: "charms",
    name: "Чёрный агат · тёмная магия деталей",
    mood: "Многогранный чёрный агат — идеальный акцент для сумки, рюкзака или пояса",
    materials: "натуральный многогранный чёрный агат, фурнитура латунь с родиевым покрытием",
    size: "универсальный",
    price: "2 300 ₽",
    image: charmBlackAgateFaceted,
  },
  {
    id: "ch-hematite-horse",
    category: "charms",
    name: "Гематит · подвеска-лошадка",
    mood: "Стальной блеск гематита и изящная лошадка — обвес с характером для сумки или ремня",
    materials: "натуральный гематит, подвеска-лошадка и сердце, металлическая фурнитура",
    size: "универсальный",
    price: "1 300 ₽",
    image: charmHematiteHorse,
  },
  {
    id: "nk-black-agate-heart",
    category: "necklaces",
    name: "Чёрный агат · колье с сердцем",
    mood: "Гранёный чёрный агат, родированная цепь и подвеска-сердце — драматичная элегантность",
    materials: "натуральный чёрный агат, цепь и фурнитура с родиевым покрытием, подвеска-сердце",
    size: "регулируемая длина",
    price: "по запросу",
    image: necklaceBlackAgateHeart,
    badge: "На заказ",
  },
  {
    id: "set-hematite-rhodium",
    category: "necklaces",
    name: "Гематит и родий · комплект колье и браслет",
    mood: "Гранёный гематит и родированная цепь — стальной блеск в дуэте украшений",
    materials: "натуральный гематит, цепь с родиевым покрытием, подвески-сердца",
    size: "браслет 18+ см, колье регулируемое",
    price: "1 800 ₽ (браслет)",
    image: setHematiteRhodium,
    badge: "На заказ",
  },
];
