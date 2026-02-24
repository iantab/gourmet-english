export interface ServiceArea {
  code: string;
  name: string;
}

export interface LargeServiceArea {
  name: string;
  prefectures: ServiceArea[];
}

export const largeServiceAreas: LargeServiceArea[] = [
  {
    name: "Hokkaido / Tohoku",
    prefectures: [
      { code: "SA41", name: "Hokkaido" },
      { code: "SA51", name: "Aomori" },
      { code: "SA52", name: "Iwate" },
      { code: "SA53", name: "Miyagi" },
      { code: "SA54", name: "Akita" },
      { code: "SA55", name: "Yamagata" },
      { code: "SA56", name: "Fukushima" },
    ],
  },
  {
    name: "Kanto",
    prefectures: [
      { code: "SA11", name: "Tokyo" },
      { code: "SA12", name: "Kanagawa" },
      { code: "SA13", name: "Saitama" },
      { code: "SA14", name: "Chiba" },
      { code: "SA15", name: "Ibaraki" },
      { code: "SA16", name: "Tochigi" },
      { code: "SA17", name: "Gunma" },
      { code: "SA65", name: "Yamanashi" },
    ],
  },
  {
    name: "Shinetsu / Hokuriku",
    prefectures: [
      { code: "SA61", name: "Niigata" },
      { code: "SA62", name: "Toyama" },
      { code: "SA63", name: "Ishikawa" },
      { code: "SA64", name: "Fukui" },
      { code: "SA66", name: "Nagano" },
    ],
  },
  {
    name: "Tokai",
    prefectures: [
      { code: "SA33", name: "Aichi" },
      { code: "SA32", name: "Shizuoka" },
      { code: "SA31", name: "Gifu" },
      { code: "SA34", name: "Mie" },
    ],
  },
  {
    name: "Kansai",
    prefectures: [
      { code: "SA23", name: "Osaka" },
      { code: "SA24", name: "Hyogo" },
      { code: "SA22", name: "Kyoto" },
      { code: "SA21", name: "Shiga" },
      { code: "SA25", name: "Nara" },
      { code: "SA26", name: "Wakayama" },
    ],
  },
  {
    name: "Chugoku",
    prefectures: [
      { code: "SA74", name: "Hiroshima" },
      { code: "SA73", name: "Okayama" },
      { code: "SA71", name: "Tottori" },
      { code: "SA72", name: "Shimane" },
      { code: "SA75", name: "Yamaguchi" },
    ],
  },
  {
    name: "Shikoku",
    prefectures: [
      { code: "SA83", name: "Ehime" },
      { code: "SA82", name: "Kagawa" },
      { code: "SA84", name: "Kochi" },
      { code: "SA81", name: "Tokushima" },
    ],
  },
  {
    name: "Kyushu / Okinawa",
    prefectures: [
      { code: "SA91", name: "Fukuoka" },
      { code: "SA92", name: "Saga" },
      { code: "SA93", name: "Nagasaki" },
      { code: "SA94", name: "Kumamoto" },
      { code: "SA95", name: "Oita" },
      { code: "SA96", name: "Miyazaki" },
      { code: "SA97", name: "Kagoshima" },
      { code: "SA98", name: "Okinawa" },
    ],
  },
];
