import fs from "fs";
const artikel = fs.readFileSync("artikel.txt", "utf8");

// a
function serachByWord(word) {
  const teksKecil = artikel.toLowerCase();
  const kataKecil = word.toLowerCase();

  const jumlahKata = teksKecil.split(kataKecil).length - 1;
  return `Kata '${word}' ditemukan sebanyak ${jumlahKata} kali.`;
}

// b
function replaceWord(oldWord, newWord) {
  return artikel.replaceAll(oldWord, newWord);
}

// c
function sortWord() {
  let angka = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  let teksBersih = artikel.toLowerCase();
  teksBersih = teksBersih
    .replaceAll(",", "")
    .replaceAll(".", "")
    .replaceAll("\n", " ");

  let daftarKata = teksBersih.split(" ");
  let kataUnik = [...new Set(daftarKata)].filter((kata) => {
    if (kata === "") {
      return false;
    }
    
    let adaAngka = angka.some((digit) => kata.includes(digit));

    if (adaAngka === true) {
      return false;
    }

    return true;
  });
  return kataUnik.sort();
}

console.log(serachByWord("pendidikan"));
console.log(replaceWord("adalah", "ialah"));
console.log(sortWord());
