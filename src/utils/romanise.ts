/**
 * Pure-JS kana → Hepburn rōmaji conversion.
 * No dictionary, no external dependencies, works instantly in the browser.
 * Converts hiragana and katakana; leaves other characters (kanji, Latin) as-is.
 */

// Longer sequences must come before shorter ones to match greedily
const KANA_MAP: [string, string][] = [
  // ── Double-consonant (っ/ッ) handled separately below ──
  // ── Special combos ──
  ["きゃ", "kya"],
  ["きゅ", "kyu"],
  ["きょ", "kyo"],
  ["しゃ", "sha"],
  ["しゅ", "shu"],
  ["しょ", "sho"],
  ["ちゃ", "cha"],
  ["ちゅ", "chu"],
  ["ちょ", "cho"],
  ["にゃ", "nya"],
  ["にゅ", "nyu"],
  ["にょ", "nyo"],
  ["ひゃ", "hya"],
  ["ひゅ", "hyu"],
  ["ひょ", "hyo"],
  ["みゃ", "mya"],
  ["みゅ", "myu"],
  ["みょ", "myo"],
  ["りゃ", "rya"],
  ["りゅ", "ryu"],
  ["りょ", "ryo"],
  ["ぎゃ", "gya"],
  ["ぎゅ", "gyu"],
  ["ぎょ", "gyo"],
  ["じゃ", "ja"],
  ["じゅ", "ju"],
  ["じょ", "jo"],
  ["びゃ", "bya"],
  ["びゅ", "byu"],
  ["びょ", "byo"],
  ["ぴゃ", "pya"],
  ["ぴゅ", "pyu"],
  ["ぴょ", "pyo"],
  ["でゃ", "dya"],
  ["でゅ", "dyu"],
  ["でょ", "dyo"],
  ["てゃ", "tha"],
  ["てゅ", "thu"],
  ["てょ", "tho"],
  ["ふぁ", "fa"],
  ["ふぃ", "fi"],
  ["ふぇ", "fe"],
  ["ふぉ", "fo"],
  ["うぁ", "wa"],
  // ── Katakana combos ──
  ["キャ", "kya"],
  ["キュ", "kyu"],
  ["キョ", "kyo"],
  ["シャ", "sha"],
  ["シュ", "shu"],
  ["ショ", "sho"],
  ["チャ", "cha"],
  ["チュ", "chu"],
  ["チョ", "cho"],
  ["ニャ", "nya"],
  ["ニュ", "nyu"],
  ["ニョ", "nyo"],
  ["ヒャ", "hya"],
  ["ヒュ", "hyu"],
  ["ヒョ", "hyo"],
  ["ミャ", "mya"],
  ["ミュ", "myu"],
  ["ミョ", "myo"],
  ["リャ", "rya"],
  ["リュ", "ryu"],
  ["リョ", "ryo"],
  ["ギャ", "gya"],
  ["ギュ", "gyu"],
  ["ギョ", "gyo"],
  ["ジャ", "ja"],
  ["ジュ", "ju"],
  ["ジョ", "jo"],
  ["ビャ", "bya"],
  ["ビュ", "byu"],
  ["ビョ", "byo"],
  ["ピャ", "pya"],
  ["ピュ", "pyu"],
  ["ピョ", "pyo"],
  ["ファ", "fa"],
  ["フィ", "fi"],
  ["フェ", "fe"],
  ["フォ", "fo"],
  ["ウァ", "wa"],
  ["ティ", "ti"],
  ["ディ", "di"],
  ["デュ", "du"],
  ["ツァ", "tsa"],
  ["ツィ", "tsi"],
  ["ツェ", "tse"],
  ["ツォ", "tso"],
  ["ヴァ", "va"],
  ["ヴィ", "vi"],
  ["ヴ", "vu"],
  ["ヴェ", "ve"],
  ["ヴォ", "vo"],
  // ── Single kana ──
  ["あ", "a"],
  ["い", "i"],
  ["う", "u"],
  ["え", "e"],
  ["お", "o"],
  ["か", "ka"],
  ["き", "ki"],
  ["く", "ku"],
  ["け", "ke"],
  ["こ", "ko"],
  ["さ", "sa"],
  ["し", "shi"],
  ["す", "su"],
  ["せ", "se"],
  ["そ", "so"],
  ["た", "ta"],
  ["ち", "chi"],
  ["つ", "tsu"],
  ["て", "te"],
  ["と", "to"],
  ["な", "na"],
  ["に", "ni"],
  ["ぬ", "nu"],
  ["ね", "ne"],
  ["の", "no"],
  ["は", "ha"],
  ["ひ", "hi"],
  ["ふ", "fu"],
  ["へ", "he"],
  ["ほ", "ho"],
  ["ま", "ma"],
  ["み", "mi"],
  ["む", "mu"],
  ["め", "me"],
  ["も", "mo"],
  ["や", "ya"],
  ["ゆ", "yu"],
  ["よ", "yo"],
  ["ら", "ra"],
  ["り", "ri"],
  ["る", "ru"],
  ["れ", "re"],
  ["ろ", "ro"],
  ["わ", "wa"],
  ["を", "wo"],
  ["ん", "n"],
  ["が", "ga"],
  ["ぎ", "gi"],
  ["ぐ", "gu"],
  ["げ", "ge"],
  ["ご", "go"],
  ["ざ", "za"],
  ["じ", "ji"],
  ["ず", "zu"],
  ["ぜ", "ze"],
  ["ぞ", "zo"],
  ["だ", "da"],
  ["ぢ", "ji"],
  ["づ", "zu"],
  ["で", "de"],
  ["ど", "do"],
  ["ば", "ba"],
  ["び", "bi"],
  ["ぶ", "bu"],
  ["べ", "be"],
  ["ぼ", "bo"],
  ["ぱ", "pa"],
  ["ぴ", "pi"],
  ["ぷ", "pu"],
  ["ぺ", "pe"],
  ["ぽ", "po"],
  ["ぁ", "a"],
  ["ぃ", "i"],
  ["ぅ", "u"],
  ["ぇ", "e"],
  ["ぉ", "o"],
  ["ゃ", "ya"],
  ["ゅ", "yu"],
  ["ょ", "yo"],
  // Katakana single
  ["ア", "a"],
  ["イ", "i"],
  ["ウ", "u"],
  ["エ", "e"],
  ["オ", "o"],
  ["カ", "ka"],
  ["キ", "ki"],
  ["ク", "ku"],
  ["ケ", "ke"],
  ["コ", "ko"],
  ["サ", "sa"],
  ["シ", "shi"],
  ["ス", "su"],
  ["セ", "se"],
  ["ソ", "so"],
  ["タ", "ta"],
  ["チ", "chi"],
  ["ツ", "tsu"],
  ["テ", "te"],
  ["ト", "to"],
  ["ナ", "na"],
  ["ニ", "ni"],
  ["ヌ", "nu"],
  ["ネ", "ne"],
  ["ノ", "no"],
  ["ハ", "ha"],
  ["ヒ", "hi"],
  ["フ", "fu"],
  ["ヘ", "he"],
  ["ホ", "ho"],
  ["マ", "ma"],
  ["ミ", "mi"],
  ["ム", "mu"],
  ["メ", "me"],
  ["モ", "mo"],
  ["ヤ", "ya"],
  ["ユ", "yu"],
  ["ヨ", "yo"],
  ["ラ", "ra"],
  ["リ", "ri"],
  ["ル", "ru"],
  ["レ", "re"],
  ["ロ", "ro"],
  ["ワ", "wa"],
  ["ヲ", "wo"],
  ["ン", "n"],
  ["ガ", "ga"],
  ["ギ", "gi"],
  ["グ", "gu"],
  ["ゲ", "ge"],
  ["ゴ", "go"],
  ["ザ", "za"],
  ["ジ", "ji"],
  ["ズ", "zu"],
  ["ゼ", "ze"],
  ["ゾ", "zo"],
  ["ダ", "da"],
  ["ヂ", "ji"],
  ["ヅ", "zu"],
  ["デ", "de"],
  ["ド", "do"],
  ["バ", "ba"],
  ["ビ", "bi"],
  ["ブ", "bu"],
  ["ベ", "be"],
  ["ボ", "bo"],
  ["パ", "pa"],
  ["ピ", "pi"],
  ["プ", "pu"],
  ["ペ", "pe"],
  ["ポ", "po"],
  ["ァ", "a"],
  ["ィ", "i"],
  ["ゥ", "u"],
  ["ェ", "e"],
  ["ォ", "o"],
  ["ャ", "ya"],
  ["ュ", "yu"],
  ["ョ", "yo"],
  ["ー", "-"],
  ["・", " "],
  ["　", " "],
];

const SOKU_HIRA = "っ";
const SOKU_KATA = "ッ";

export function toRomaji(text: string): string {
  if (!text?.trim()) return text;

  let result = "";
  let i = 0;

  while (i < text.length) {
    // Double-consonant (っ/ッ): duplicate the first consonant of the next mora
    if (text[i] === SOKU_HIRA || text[i] === SOKU_KATA) {
      // Find what the next mora romanises to and double its first letter
      let found = false;
      for (const [kana, roma] of KANA_MAP) {
        if (text.startsWith(kana, i + 1)) {
          result += roma[0]; // doubled consonant
          found = true;
          break;
        }
      }
      if (!found) result += "tt"; // fallback
      i += 1;
      continue;
    }

    // Try longest match first (combos are listed before singles in KANA_MAP)
    let matched = false;
    for (const [kana, roma] of KANA_MAP) {
      if (text.startsWith(kana, i)) {
        result += roma;
        i += kana.length;
        matched = true;
        break;
      }
    }

    if (!matched) {
      // Pass through kanji, Latin, spaces, punctuation unchanged
      result += text[i];
      i += 1;
    }
  }

  // Capitalise first letter of each whitespace-separated word
  return result
    .trim()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
