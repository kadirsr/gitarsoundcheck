# PRD.md — TabFlow: Mikrofonla Çalışan İnteraktif Gitar Tab Trainer

## 1. Ürün Özeti

TabFlow, gitar öğrenen kullanıcıların kendi tablarını yazıp, düzenleyip ve gerçek zamanlı olarak çalışabilmesini sağlayan interaktif bir web uygulamasıdır.

Kullanıcı ister klasik ASCII tab yapıştırır, ister uygulama içindeki interaktif tab editörüyle tel/perde seçerek tab oluşturur. Uygulama sıradaki notayı gösterir. Kullanıcı gitarla doğru notayı çaldığında sistem mikrofondan sesi algılar, ilgili tab notasını yeşile boyar ve sıradaki notaya geçer. Yanlış nota çalındığında ilerlemez veya hata gösterir. Kullanıcı BPM/metronom ile pratik yapabilir.

İlk MVP’nin amacı tam kapsamlı gitar hocası olmak değildir. İlk hedef, tek nota riff/intro çalıştıran, kullanıcıya nota nota geri bildirim veren production kalitesine yakın bir web MVP’sidir.

---

## 2. Ürün Adı

Çalışma adı:

```text
TabFlow
```

Alternatif isimler:

```text
RiffPilot
TabSense
GuitarCheck
NotaNota
RiffCoach
```

---

## 3. Problem

Yeni başlayan gitaristler tab okurken ve pratik yaparken şu problemleri yaşar:

- Tabda sıradaki notayı takip etmek zor.
- Doğru notayı çalıp çalmadığını anlamak zor.
- BPM ile çalışırken ritim kayar.
- Hatalı nota çalınca nerede yanlış yaptığını anında göremez.
- YouTube veya düz tab siteleri pasiftir; kullanıcıyı dinlemez.
- Hazır ders uygulamaları çoğunlukla kendi ders içeriklerine bağlıdır.
- Kullanıcı kendi istediği riffi, introsu veya egzersizi çalışmak ister.
- ASCII tab yazmak yeni başlayanlar için zahmetli olabilir.
- Kullanıcı görsel ve tıklanabilir bir tab editörüyle hızlıca egzersiz oluşturmak ister.

---

## 4. Hedef

MVP hedefi:

> Kullanıcı kendi tabını ister ASCII olarak yapıştıracak, ister interaktif editörle tel/perde seçerek oluşturacak. Uygulama tabı parse edecek, sıradaki notayı belirleyecek, mikrofondan gelen gitar sesinin doğru nota olup olmadığını algılayacak ve doğruysa tab üzerinde ilerleyecek.

---

## 5. Hedef Kullanıcı

### Birincil kullanıcı

Yeni başlayan elektro/akustik gitaristler.

Örnek kullanıcı profili:

```text
- Tab okumayı yeni öğreniyor.
- Duman, Metallica, Mor ve Ötesi gibi intro/riffleri çalmak istiyor.
- Ritim ve nota doğruluğunda zorlanıyor.
- Basit, oyunlaştırılmış bir pratik deneyimi istiyor.
- Kendi kısa egzersizini hızlıca oluşturmak istiyor.
```

### İkincil kullanıcı

- Gitar öğretmenleri
- Kendi öğrencilerine egzersiz hazırlamak isteyenler
- Hobi gitaristler
- Basit riffleri hızlandırarak çalışmak isteyenler
- Pentatonik, gam ve parmak egzersizi çalışanlar

---

## 6. Ürün Konumlandırması

TabFlow, Yousician gibi tam kapsamlı gitar eğitim uygulaması değildir.

TabFlow’un farkı:

```text
Kendi tabını yaz veya interaktif olarak oluştur, uygulama seni nota nota dinleyerek çalıştırsın.
```

İlk versiyon sadece şu alanı hedefler:

```text
Single-note interactive guitar tab trainer
```

Yani:

- Tek nota riffler
- Intro çalışmaları
- Basit egzersizler
- Ölçek/pentatonik çalışmaları
- Tek tel veya çok tel ama aynı anda tek nota çalınan tablar
- Kullanıcının kendisinin oluşturduğu kısa pratik dizileri

---

## 7. MVP Kapsamı

### MVP’de olacaklar

1. ASCII tab editörü
2. Interaktif tab oluşturma/editör sistemi
3. Standart gitar akordu desteği
4. ASCII tab parser
5. Interaktif editörden ASCII tab üretme
6. Tek nota sıralaması çıkarma
7. Mikrofon izni alma
8. Gerçek zamanlı pitch detection
9. Beklenen nota ile duyulan notayı karşılaştırma
10. Doğruysa tab üzerinde ilgili notayı yeşil yapma
11. Yanlışsa ilerlememe
12. BPM/metronom
13. Practice Mode:
    - Wait Mode
    - BPM Strict Mode
14. Basit sonuç ekranı
15. LocalStorage ile tab ve ayar kaydetme
16. Responsive web arayüzü
17. Basit koyu tema
18. Temel unit testler

### MVP’de olmayacaklar

1. Akor algılama
2. Bend algılama
3. Slide algılama
4. Hammer-on / pull-off algılama
5. Distortion tonu ile gelişmiş analiz
6. Backing track
7. Mobil native uygulama
8. Kullanıcı hesabı
9. Sosyal paylaşım
10. Hazır telifli şarkı tab kütüphanesi
11. Video senkronizasyonu
12. Öğretmen paneli
13. Tam müzik notasyonu

---

## 8. Temel Kullanıcı Akışları

## 8.1 Akış 1 — ASCII Tab ile Pratik Başlatma

1. Kullanıcı uygulamayı açar.
2. ASCII tab editörüne tab yapıştırır.
3. Uygulama tabı parse eder.
4. Uygulama sıradaki notayı gösterir.
5. Kullanıcı “Start Practice” butonuna basar.
6. Tarayıcı mikrofon izni ister.
7. Kullanıcı gitarıyla beklenen notayı çalar.
8. Sistem doğru notayı algılarsa:
   - Nota yeşil olur.
   - Cursor sıradaki notaya geçer.
9. Yanlış nota çalınırsa:
   - Sistem ilerlemez.
   - Beklenen ve duyulan nota gösterilir.
10. Egzersiz tamamlanınca sonuç ekranı gelir.

---

## 8.2 Akış 2 — Interaktif Tab Oluşturma

1. Kullanıcı “Interactive Editor” sekmesine geçer.
2. Ekranda 6 gitar teli yatay olarak görünür.
3. Kullanıcı tel satırında bir pozisyona tıklar.
4. Açılan küçük input/picker ile fret numarası girer.
5. Uygulama ilgili hücreye fret numarasını yerleştirir.
6. Kullanıcı isterse klavye ile fret numarası girer.
7. Kullanıcı boşluk, ölçü çizgisi ve nota aralığı ekleyebilir.
8. Oluşan tab anlık olarak ASCII preview alanına yansır.
9. Kullanıcı “Start Practice” ile çalışmaya başlar.

---

## 8.3 Akış 3 — Grid Üzerinden Hızlı Egzersiz Girme

1. Kullanıcı “Add Note” modunu seçer.
2. Sol tarafta teller görünür: e, B, G, D, A, E.
3. Üstte zaman/step kolonları görünür.
4. Kullanıcı ilgili tel ve step kesişimine tıklar.
5. Fret input popup açılır.
6. Kullanıcı fret girer.
7. Enter’a basınca nota eklenir.
8. Sağ ok ile sonraki step’e geçer.
9. Backspace ile mevcut notayı siler.
10. Tab otomatik parse edilir ve practice engine’e hazır hale gelir.

---

## 9. Örnek Tab Girdisi

Uygulama aşağıdaki gibi standart ASCII tab formatını desteklemelidir:

```text
e|--------------------------|
B|--------------------------|
G|---------0---2---4--------|
D|---0---2------------------|
A|--------------------------|
E|--------------------------|
```

Birden fazla haneli fret desteklenmelidir:

```text
e|--------------------------|
B|--------------------------|
G|---------9---10---12------|
D|---7---9------------------|
A|--------------------------|
E|--------------------------|
```

---

## 10. Interaktif Tab Editör Sistemi

Interaktif tab editörü, ASCII tab yazmayı bilmeyen veya hızlı egzersiz oluşturmak isteyen kullanıcılar için ana özelliklerden biridir.

### 10.1 Editör Modları

MVP’de iki giriş modu olmalıdır:

```text
1. ASCII Mode
2. Interactive Grid Mode
```

Kullanıcı bu iki mod arasında geçiş yapabilmelidir.

Önemli gereksinim:

```text
ASCII Mode ve Interactive Grid Mode birbirini senkronize etmelidir.
```

Yani:

- ASCII tab değişirse grid güncellenir.
- Grid değişirse ASCII tab güncellenir.

Eğer ASCII tab parse edilemeyecek kadar bozuksa grid güncellenmemeli ve kullanıcıya hata gösterilmelidir.

---

### 10.2 Interactive Grid UI

Grid yapısı:

```text
Kolonlar = zaman/step pozisyonları
Satırlar = gitar telleri
Hücre = belirli bir zamanda belirli telde çalınacak fret
```

Örnek görsel mantık:

```text
Step:  01  02  03  04  05  06  07  08

e |    -   -   -   -   -   -   -   -
B |    -   -   -   -   -   -   -   -
G |    -   -   -   0   -   2   -   4
D |    0   -   2   -   -   -   -   -
A |    -   -   -   -   -   -   -   -
E |    -   -   -   -   -   -   -   -
```

Griddeki her hücre:

```ts
type TabGridCell = {
  stringName: GuitarString;
  stepIndex: number;
  fret: number | null;
  status: "empty" | "current" | "correct" | "wrong" | "pending";
};
```

---

### 10.3 Nota Ekleme

Kullanıcı bir hücreye tıkladığında:

1. Hücre seçili hale gelir.
2. Küçük bir fret input popup açılır.
3. Kullanıcı 0-24 arası fret girebilir.
4. Enter ile onaylar.
5. Escape ile iptal eder.
6. Boş değer girerse hücre temizlenir.

Geçerli fret aralığı:

```text
0-24
```

MVP’de 24 üstü fret reddedilmelidir.

Hata mesajı:

```text
Fret değeri 0 ile 24 arasında olmalıdır.
```

---

### 10.4 Klavye Kısayolları

Interactive Grid Mode için kısayollar:

```text
ArrowRight = sonraki step
ArrowLeft = önceki step
ArrowUp = üst tel
ArrowDown = alt tel
0-9 = fret girmeye başla
Enter = fret onayla
Backspace = seçili notayı sil
Delete = seçili notayı sil
Space = boş step ekle / sonraki step’e geç
| = ölçü çizgisi ekle
Esc = popup kapat
```

Çok haneli fret girişi:

```text
Kullanıcı 1 sonra 2 yazarsa 12 olarak algılanmalı.
Enter ile onaylanmalı.
```

---

### 10.5 Step Yönetimi

Kullanıcı şu işlemleri yapabilmelidir:

- Step ekle
- Step sil
- Seçili step’in önüne boşluk ekle
- Seçili step’ten sonra boşluk ekle
- Tüm grid’i temizle
- Grid uzunluğunu artır
- Grid uzunluğunu azalt

Varsayılan step sayısı:

```text
32
```

Minimum step:

```text
8
```

Maksimum step:

```text
256
```

MVP’de step uzunluğu kullanıcı tarafından basit bir input ile değiştirilebilir.

---

### 10.6 Ölçü Çizgisi

Kullanıcı belirli kolonlara ölçü çizgisi ekleyebilmelidir.

Ölçü çizgisi ASCII çıktıda `|` olarak görünmelidir.

Veri modeli:

```ts
type MeasureMarker = {
  stepIndex: number;
};
```

MVP’de ölçü çizgileri practice engine tarafından nota olarak sayılmamalıdır.

---

### 10.7 Tek Nota Kuralı

MVP sadece tek nota destekler.

Bu yüzden aynı stepIndex üzerinde birden fazla telde fret varsa bu akor kabul edilir.

Interactive editor’da akor girişine izin verilmemelidir.

Davranış:

```text
Kullanıcı aynı step içinde başka bir tele nota eklerse eski nota otomatik silinir veya kullanıcıya uyarı verilir.
```

Varsayılan davranış:

```text
Aynı step içindeki eski nota otomatik silinsin.
```

Bu, yeni başlayan kullanıcı için daha basit deneyim sağlar.

Ayar olarak ileride şunlar eklenebilir:

```text
- Single-note mode
- Chord mode
```

MVP’de sadece:

```text
Single-note mode
```

---

### 10.8 ASCII Senkronizasyonu

Interactive grid içeriği anlık olarak ASCII tab’a çevrilmelidir.

Örnek grid:

```text
Step 0: D telinde 0
Step 2: D telinde 2
Step 4: G telinde 0
Step 6: G telinde 2
Step 8: G telinde 4
```

ASCII çıktısı:

```text
e|------------------|
B|------------------|
G|--------0---2---4-|
D|0---2-------------|
A|------------------|
E|------------------|
```

Dikkat:

- Çok haneli fretler hizalamayı bozabilir.
- Parser ve renderer çok haneli fretleri tek token olarak yönetmelidir.
- Basit MVP’de her step 3 karakter genişliğinde render edilebilir.

Önerilen render yaklaşımı:

```text
Her step sabit width = 3 karakter.
Boş step = ---
Tek haneli fret = -5-
Çift haneli fret = 12-
```

Örnek:

```text
G|---0-----2-----4--|
D|0-----2-----------|
```

Daha temiz yaklaşım:

```text
stepWidth = 3
fret 0 => "0--"
fret 2 => "2--"
fret 10 => "10-"
empty => "---"
```

---

### 10.9 Interaktif Editör Toolbar

Toolbar butonları:

```text
Add Step
Remove Step
Clear Tab
Load Example
Convert to ASCII
Start Practice
Reset Practice
```

Ek kontroller:

```text
Step Count
Default Spacing
Tuning
BPM
Mode
```

---

### 10.10 Tab Başlığı ve Kayıt

Kullanıcı oluşturduğu tab için başlık girebilmelidir.

Örnek:

```text
Duman intro çalışması
Pentatonik 1. pozisyon
Basit D-G egzersizi
```

LocalStorage modeli:

```ts
type SavedTab = {
  id: string;
  title: string;
  tabText: string;
  grid?: TabGrid;
  createdAt: string;
  updatedAt: string;
};
```

MVP’de kayıt localStorage’da tutulur.

---

## 11. Tab Parser Gereksinimleri

### Desteklenecek string isimleri

Standart akort:

```text
e = high E
B = B
G = G
D = D
A = A
E = low E
```

Parser şu satırları tanımalıdır:

```text
e|
B|
G|
D|
A|
E|
```

Büyük/küçük harf toleransı olmalı:

```text
E|
e|
```

### Parse çıktısı

Parser her notayı şu yapıya çevirmelidir:

```ts
type ParsedNote = {
  id: string;
  stringName: "E_LOW" | "A" | "D" | "G" | "B" | "E_HIGH";
  stringLabel: string;
  fret: number;
  columnIndex: number;
  sequenceIndex: number;
  expectedNoteName: string;
  expectedMidi: number;
  expectedFrequency: number;
};
```

### Çok haneli fret

Örnek:

```text
G|---9---10---12---
```

Burada `10` tek nota olarak parse edilmelidir, `1` ve `0` ayrı ayrı alınmamalıdır.

### Parser davranışı

- `-` karakterleri boşluk kabul edilir.
- `|` karakterleri ölçü çizgisi kabul edilir.
- Sayılar fret olarak kabul edilir.
- Boş satırlar yok sayılır.
- Desteklenmeyen karakterler MVP’de yok sayılabilir.
- Aynı columnIndex üzerinde birden fazla telde sayı varsa bu akor sayılır.
- MVP’de akor desteklenmediği için kullanıcıya uyarı gösterilir:

```text
Bu tab aynı anda birden fazla nota içeriyor. MVP sadece tek nota destekler.
```

---

## 12. Nota Hesaplama

Standart gitar akordu MIDI karşılığı:

```ts
const STANDARD_TUNING_MIDI = {
  E_LOW: 40,
  A: 45,
  D: 50,
  G: 55,
  B: 59,
  E_HIGH: 64
};
```

Fret hesabı:

```ts
expectedMidi = openStringMidi + fret;
```

Frekans hesabı:

```ts
frequency = 440 * Math.pow(2, (midi - 69) / 12);
```

MIDI’den nota adı:

```text
0  = C
1  = C#
2  = D
3  = D#
4  = E
5  = F
6  = F#
7  = G
8  = G#
9  = A
10 = A#
11 = B
```

---

## 13. Ses Algılama Gereksinimleri

### Temel yaklaşım

Uygulama Web Audio API ile mikrofondan ses almalıdır.

İlk MVP’de backend’e ses gönderilmemelidir. Ses analizi browser içinde yapılmalıdır.

### Kullanılacak yöntem

Pitch detection için şu yaklaşımlardan biri kullanılabilir:

1. Autocorrelation
2. YIN algorithm
3. McLeod Pitch Method
4. Güvenilir küçük bir open-source pitch detection paketi

Öncelik:

```text
Mümkünse bağımlılık az olsun.
Ama doğruluk için küçük ve güvenilir bir pitch detection library kullanılabilir.
```

### Audio Engine çıktısı

Audio engine her frame’de şu yapıyı üretmelidir:

```ts
type PitchFrame = {
  frequency: number | null;
  midi: number | null;
  noteName: string | null;
  centsOff: number | null;
  rms: number;
  confidence: number;
  timestamp: number;
};
```

### Minimum ses seviyesi

Noise/fan/klavye seslerini engellemek için minimum RMS eşiği olmalıdır.

Varsayılan:

```ts
MIN_RMS = 0.01
```

Kullanıcı ayarlardan microphone sensitivity değiştirebilmelidir.

### Tolerans

Doğru nota kabulü için varsayılan tolerans:

```text
±35 cents
```

Ayarlar:

```text
Easy: ±50 cents
Normal: ±35 cents
Strict: ±20 cents
```

MVP’de default `Normal` olmalıdır.

### Stabilite filtresi

Bir nota tek frame’de doğru algılandığı için hemen kabul edilmemelidir.

Doğru kabul için:

```text
Aynı beklenen nota en az 80-120 ms boyunca stabil algılanmalı.
```

Varsayılan:

```ts
STABLE_NOTE_MS = 100
```

Bu sayede yanlış transient sesler ilerlemeyi tetiklemez.

---

## 14. Practice Engine

Practice Engine, tabdaki sıradaki notayı, duyulan notayı ve mod durumunu yönetir.

### Temel state

```ts
type PracticeState = {
  status: "idle" | "listening" | "paused" | "completed";
  mode: "WAIT" | "BPM_STRICT";
  currentIndex: number;
  correctCount: number;
  wrongCount: number;
  startedAt: number | null;
  completedAt: number | null;
  bpm: number;
  recentMistakes: PracticeMistake[];
};
```

### Mistake modeli

```ts
type PracticeMistake = {
  expectedNoteName: string;
  detectedNoteName: string | null;
  expectedMidi: number;
  detectedMidi: number | null;
  stringLabel: string;
  fret: number;
  sequenceIndex: number;
  timestamp: number;
};
```

---

## 15. Modlar

## 15.1 Wait Mode

Yeni başlayanlar için varsayılan mod.

Davranış:

```text
Doğru nota çalınana kadar sistem bekler.
Yanlış nota çalınırsa ilerlemez.
Doğru nota çalınınca sıradaki notaya geçer.
```

Bu modda BPM sadece isteğe bağlı metronom olarak çalışır.

### Wait Mode kabul kriterleri

- Doğru nota çalınınca ilerlemeli.
- Yanlış nota çalınınca ilerlememeli.
- Beklenen nota UI’da açıkça görünmeli.
- Duyulan nota UI’da görünmeli.
- Yeşil/kırmızı geri bildirim olmalı.

---

## 15.2 BPM Strict Mode

Bu modda metronom aktif olur.

Davranış:

```text
Sistem BPM’e göre sıradaki nota için zaman penceresi açar.
Kullanıcı doğru notayı bu pencere içinde çalarsa başarılı sayılır.
Yanlış veya geç çalarsa hata olarak işaretlenir.
```

MVP’de BPM Strict basit tutulabilir:

- Her nota bir beat kabul edilir.
- Doğru nota doğru beat içinde algılanırsa yeşil olur.
- Yanlışsa kırmızı olur.
- Strict mode’da yanlışta durabilir veya sonraki notaya geçebilir.

Varsayılan davranış:

```text
Yanlışta dur.
```

---

## 16. Metronom

Metronom gereksinimleri:

- BPM değeri ayarlanabilir.
- Varsayılan BPM: 60
- Minimum BPM: 30
- Maksimum BPM: 220
- Start/Stop kontrolü olmalı.
- Görsel beat göstergesi olmalı.
- Sesli tick opsiyonel aç/kapat olmalı.

Not:

```text
Metronom sesi mikrofon tarafından algılanıp pitch detection’ı bozabilir.
Bu yüzden kullanıcıya kulaklık önerilmelidir.
```

UI mesajı:

```text
Daha doğru algılama için kulaklık kullanmanız önerilir.
```

---

## 17. UI Gereksinimleri

### Ana ekran bölümleri

1. Header
2. Tab Input Mode Switcher
3. ASCII Tab Editor
4. Interactive Grid Editor
5. Parsed Tab Preview
6. Current Note Panel
7. Audio Status Panel
8. Practice Controls
9. Metronome Controls
10. Saved Tabs Panel
11. Results Panel

---

## 18. Ana Ekran Detayı

### 18.1 Header

İçerik:

```text
TabFlow
Kendi tabını yaz, gitarınla nota nota çalış.
```

Butonlar:

- New Tab
- Load Example
- Save Tab
- Settings

---

### 18.2 Mode Switcher

Sekmeler:

```text
ASCII Editor
Interactive Editor
Practice
Saved Tabs
```

Davranış:

- ASCII Editor’da yapılan değişiklik Interactive Editor’a yansır.
- Interactive Editor’da yapılan değişiklik ASCII Editor’a yansır.
- Practice sekmesi parse edilmiş notaları kullanır.

---

### 18.3 ASCII Tab Editor

Özellikler:

- Çok satırlı textarea
- Monospace font
- Örnek tab yükleme butonu
- Parse hatası gösterimi
- “Parse Tab” butonu
- “Sync to Grid” butonu

Placeholder:

```text
e|--------------------------|
B|--------------------------|
G|---------0---2---4--------|
D|---0---2------------------|
A|--------------------------|
E|--------------------------|
```

---

### 18.4 Interactive Grid Editor

Özellikler:

- 6 satırlı tel grid’i
- Step kolonları
- Hücreye tıklayıp fret ekleme
- Klavye ile gezinme
- Step ekleme/silme
- Ölçü çizgisi ekleme
- Grid’den ASCII üretme
- Single-note kuralı
- Hata/uyarı mesajları

Grid hücre durumları:

```text
empty
note
selected
current
correct
wrong
pending
```

---

### 18.5 Parsed Tab Preview

Tab görsel olarak gösterilmelidir.

Her fret token’ı ayrı span olarak render edilmelidir.

Durum renkleri:

```text
Not started: gri
Current: mavi veya sarı vurgu
Correct: yeşil
Wrong: kırmızı
Skipped: turuncu
```

Renkler CSS class ile yönetilmelidir.

---

### 18.6 Current Note Panel

Gösterilecek bilgiler:

```text
Şu an çal:
D teli - 0. perde
Beklenen nota: D
Duyulan nota: F#
Durum: Yanlış nota
```

Doğru nota gelirse:

```text
Durum: Doğru
```

---

### 18.7 Audio Status Panel

Gösterilecek bilgiler:

- Mikrofon durumu
- Duyulan frekans
- Duyulan nota
- Cents farkı
- RMS/seviye göstergesi
- Confidence

Örnek:

```text
Mic: Active
Detected: D3
Frequency: 146.83 Hz
Cents: +12
Signal: Good
```

---

### 18.8 Practice Controls

Butonlar:

- Start
- Pause
- Reset
- Previous Note
- Next Note

Mode selector:

```text
Wait Mode
BPM Strict Mode
```

---

### 18.9 Results Panel

Egzersiz tamamlanınca göster:

```text
Tamamlandı
Doğru: 24
Yanlış: 5
Doğruluk: %82
Ortalama BPM: 60
En çok hata yapılan notalar:
- G teli 2. perde
- D teli 0. perde
```

---

## 19. Kullanıcı Ayarları

MVP ayarları:

```ts
type UserSettings = {
  tuning: "STANDARD";
  tolerance: "EASY" | "NORMAL" | "STRICT";
  microphoneSensitivity: number;
  stableNoteMs: number;
  metronomeEnabled: boolean;
  bpm: number;
  editorMode: "ASCII" | "GRID";
};
```

Varsayılan:

```ts
const DEFAULT_SETTINGS = {
  tuning: "STANDARD",
  tolerance: "NORMAL",
  microphoneSensitivity: 0.01,
  stableNoteMs: 100,
  metronomeEnabled: true,
  bpm: 60,
  editorMode: "GRID"
};
```

---

## 20. LocalStorage

Backend olmadan MVP’de şu veriler LocalStorage’a kaydedilmelidir:

```ts
type SavedTab = {
  id: string;
  title: string;
  tabText: string;
  grid?: TabGrid;
  createdAt: string;
  updatedAt: string;
};

type SavedSettings = UserSettings;
```

Kaydedilecekler:

- Son kullanılan tab
- Kullanıcı ayarları
- Son BPM
- Kaydedilmiş tablar
- Son kullanılan editör modu

---

## 21. Teknik Stack

Önerilen frontend stack:

```text
Vite
React
TypeScript
Tailwind CSS
Zustand
Vitest
Web Audio API
```

Neden Vite?

```text
MVP için hızlı, sade, browser audio tarafında SSR problemi yok.
```

Backend MVP’de şart değildir.

V1.1 veya production SaaS aşamasında backend eklenebilir:

```text
FastAPI veya Node.js
PostgreSQL
Auth
Cloud storage
```

---

## 22. Dosya Yapısı

Önerilen yapı:

```text
src/
  app/
    App.tsx
  components/
    Header.tsx
    ModeSwitcher.tsx
    TabEditor.tsx
    InteractiveTabEditor.tsx
    TabGrid.tsx
    FretInputPopover.tsx
    TabPreview.tsx
    CurrentNotePanel.tsx
    AudioStatusPanel.tsx
    PracticeControls.tsx
    MetronomeControls.tsx
    ResultsPanel.tsx
    SettingsPanel.tsx
    SavedTabsPanel.tsx
  core/
    tabParser.ts
    tabRenderer.ts
    tabGrid.ts
    tuning.ts
    noteUtils.ts
    practiceEngine.ts
    metronome.ts
  audio/
    audioEngine.ts
    pitchDetection.ts
    audioTypes.ts
  store/
    usePracticeStore.ts
    useSettingsStore.ts
    useTabStore.ts
  storage/
    localStorage.ts
  tests/
    tabParser.test.ts
    tabRenderer.test.ts
    tabGrid.test.ts
    noteUtils.test.ts
    practiceEngine.test.ts
```

---

## 23. Core Modüller

## 23.1 tabParser.ts

Sorumluluk:

- ASCII tab text alır.
- Tel satırlarını bulur.
- Fretleri çıkarır.
- Sequence listesi üretir.
- Akor varsa uyarı üretir.

Public API:

```ts
parseTab(tabText: string): ParseResult
```

Tipler:

```ts
type ParseResult = {
  notes: ParsedNote[];
  warnings: ParseWarning[];
  errors: ParseError[];
  normalizedLines: NormalizedTabLine[];
};
```

---

## 23.2 tabRenderer.ts

Sorumluluk:

- TabGrid modelini ASCII tab text’e dönüştürür.
- ParsedNote listesini görsel preview için tokenlara dönüştürür.

Public API:

```ts
renderGridToAscii(grid: TabGrid): string;
renderNotesForPreview(notes: ParsedNote[]): TabPreviewToken[];
```

---

## 23.3 tabGrid.ts

Sorumluluk:

- Grid modelini yönetir.
- Hücreye nota ekler/siler.
- Single-note kuralını uygular.
- Step ekler/siler.
- ASCII tab’dan grid üretir.
- Grid’den ASCII üretir.

Public API:

```ts
createEmptyGrid(stepCount: number): TabGrid;
setNoteAtStep(grid: TabGrid, stepIndex: number, stringName: GuitarString, fret: number): TabGrid;
clearNoteAtStep(grid: TabGrid, stepIndex: number, stringName: GuitarString): TabGrid;
addStep(grid: TabGrid, index?: number): TabGrid;
removeStep(grid: TabGrid, index: number): TabGrid;
gridToAscii(grid: TabGrid): string;
asciiToGrid(tabText: string): TabGrid;
```

---

## 23.4 tuning.ts

Sorumluluk:

- Standart tuning değerlerini tutar.
- Tel + fret kombinasyonundan MIDI hesaplar.

Public API:

```ts
getOpenStringMidi(stringName: GuitarString): number;
getMidiForFret(stringName: GuitarString, fret: number): number;
```

---

## 23.5 noteUtils.ts

Sorumluluk:

- MIDI → nota adı
- MIDI → frekans
- Frekans → MIDI
- Cents farkı
- Tolerans kontrolü

Public API:

```ts
midiToFrequency(midi: number): number;
frequencyToMidi(frequency: number): number;
midiToNoteName(midi: number): string;
getCentsOff(frequency: number, targetFrequency: number): number;
isWithinTolerance(detectedMidi: number, expectedMidi: number, centsOff: number, tolerance: number): boolean;
```

---

## 23.6 audioEngine.ts

Sorumluluk:

- Mikrofon izni ister.
- AudioContext oluşturur.
- AnalyserNode ile ses alır.
- Pitch detection çalıştırır.
- PitchFrame üretir.

Public API:

```ts
startAudio(): Promise<void>;
stopAudio(): void;
subscribeToPitch(callback: (frame: PitchFrame) => void): () => void;
```

---

## 23.7 practiceEngine.ts

Sorumluluk:

- Sıradaki notayı takip eder.
- PitchFrame ile beklenen notayı karşılaştırır.
- Doğruysa ilerletir.
- Yanlışsa mistake kaydeder.
- Egzersiz tamamlandı mı kontrol eder.

Public API:

```ts
createPracticeSession(notes: ParsedNote[], settings: UserSettings): PracticeSession;
processPitchFrame(session: PracticeSession, frame: PitchFrame): PracticeUpdate;
resetPractice(session: PracticeSession): PracticeSession;
```

---

## 24. Pitch Detection Kabul Kriterleri

MVP için yeterli doğruluk:

- Clean gitar tonu ile tek nota çalındığında notayı algılamalı.
- Laptop mikrofonunda kabul edilebilir çalışmalı.
- Ses kartı/mikrofon kullanıldığında daha stabil olmalı.
- Düşük ses seviyesinde false positive üretmemeli.
- Aynı nota 100ms stabil kalmadan ilerlememeli.
- Çok kısa tel seslerini yanlışlıkla kabul etmemeli.
- Metronom sesi pitch detection’ı bozarsa kullanıcı kulaklık kullanması için uyarılmalı.

---

## 25. Hata Durumları

### Mikrofon izni reddedildi

Gösterilecek mesaj:

```text
Mikrofon izni verilmedi. Uygulamanın gitar sesini dinleyebilmesi için mikrofon izni gerekli.
```

### Tab parse edilemedi

Gösterilecek mesaj:

```text
Tab formatı okunamadı. Lütfen e, B, G, D, A, E satırlarını içeren standart ASCII tab girin.
```

### Grid verisi geçersiz

Gösterilecek mesaj:

```text
Interaktif tab verisi geçersiz. Lütfen fret değerlerini ve step yapısını kontrol edin.
```

### Akor algılandı

Gösterilecek mesaj:

```text
Bu tab aynı anda birden fazla nota içeriyor. MVP şu anda sadece tek nota destekliyor.
```

### Ses algılanmıyor

Gösterilecek mesaj:

```text
Gitar sesi algılanamadı. Mikrofon seviyesini kontrol edin veya gitara daha yakın çalın.
```

### Fret değeri geçersiz

Gösterilecek mesaj:

```text
Fret değeri 0 ile 24 arasında olmalıdır.
```

---

## 26. Örnek Egzersizler

Uygulama içine birkaç örnek egzersiz eklenmelidir.

### Örnek 1 — Basit D-G yürüyüşü

```text
e|--------------------------|
B|--------------------------|
G|---------0---2---4--------|
D|---0---2------------------|
A|--------------------------|
E|--------------------------|
```

### Örnek 2 — Tek tel egzersizi

```text
e|--------------------------|
B|--------------------------|
G|--------------------------|
D|--------------------------|
A|--------------------------|
E|---0---1---2---3---4------|
```

### Örnek 3 — Pentatonik benzeri basit çıkış

```text
e|--------------------------|
B|--------------------------|
G|------------------0---2---|
D|----------0---2-----------|
A|---0---3------------------|
E|--------------------------|
```

---

## 27. Görsel Tasarım

Tasarım sade, koyu tema ağırlıklı ve pratik odaklı olmalıdır.

Genel stil:

```text
- Dark mode default
- Monospace tab alanı
- Büyük current note göstergesi
- Net yeşil/kırmızı feedback
- Mobilde de okunabilir layout
- Interaktif grid’de seçili hücre belirgin görünmeli
```

Layout:

```text
Desktop:
Sol taraf: Tab editor / interactive grid
Sağ taraf: Current note + audio status + controls

Mobile:
Üstten alta sıralı kartlar
```

---

## 28. Performans Gereksinimleri

- Pitch detection gerçek zamanlı olmalı.
- UI donmamalı.
- Audio processing mümkünse requestAnimationFrame veya AudioWorklet benzeri performanslı yapı ile yapılmalı.
- MVP’de basit ScriptProcessor/Analyser yaklaşımı kabul edilebilir, ancak kod temiz soyutlanmalıdır.
- Tab uzunluğu 500 notaya kadar stabil çalışmalıdır.
- Grid editor 256 step’e kadar akıcı çalışmalıdır.

---

## 29. Güvenlik ve Gizlilik

- Mikrofon sesi backend’e gönderilmemelidir.
- MVP’de tüm audio processing local browser içinde yapılmalıdır.
- Kullanıcıya şu bilgi gösterilmelidir:

```text
Sesiniz cihazınızda analiz edilir. Sunucuya ses kaydı gönderilmez.
```

- Hazır telifli şarkı tabları uygulama içinde sunulmamalıdır.
- Kullanıcı kendi tabını girer.

---

## 30. Production’a Hazırlık

MVP frontend-only olabilir. Fakat kod ileride SaaS’a dönüşecek şekilde ayrılmalıdır.

Gelecek backend özellikleri:

```text
- Kullanıcı hesabı
- Tab kaydetme
- Egzersiz geçmişi
- BPM gelişim grafiği
- Premium egzersizler
- Öğretmen/öğrenci paneli
- Cloud sync
```

Frontend mimarisi bu genişlemeye uygun olmalıdır.

---

## 31. V1 Sonrası Yol Haritası

### V1.1

- Loop seçme
- Zorlanılan bölümü tekrar ettirme
- Otomatik BPM artırma/azaltma
- Daha iyi sonuç ekranı
- Practice history
- Grid editörde sürükle-bırak ile nota taşıma

### V1.2

- Basit akor algılama
- Akor chart desteği
- Alternative tuning desteği
- Kullanıcı hesabı

### V2

- Mobil uygulama
- Backing track
- MIDI pickup desteği
- Öğretmen paneli
- Öğrenci ödev sistemi

---

## 32. Otomatik BPM Artırma Mantığı

V1.1 için planlanmalıdır.

Davranış:

```text
Kullanıcı egzersizi %90 üzeri doğrulukla 3 kez tamamlarsa BPM +5 artar.
Kullanıcı %60 altına düşerse BPM -5 azalır.
```

Ayar:

```ts
type AdaptiveBpmSettings = {
  enabled: boolean;
  increaseAfterSuccessfulRuns: number;
  successThreshold: number;
  decreaseThreshold: number;
  bpmStep: number;
};
```

---

## 33. Test Gereksinimleri

### Unit testler

Yazılacak testler:

```text
tabParser.test.ts
tabRenderer.test.ts
tabGrid.test.ts
noteUtils.test.ts
practiceEngine.test.ts
```

### Parser testleri

Kontrol edilecekler:

- Standart 6 satırlı tab parse ediliyor mu?
- Çok haneli fret doğru parse ediliyor mu?
- Boş satırlar yok sayılıyor mu?
- Akor uyarısı üretiliyor mu?
- Sequence sırası doğru mu?

### Grid testleri

Kontrol edilecekler:

- Hücreye nota ekleniyor mu?
- Aynı step’te ikinci nota eklenirse eski nota siliniyor mu?
- Step ekleme/silme çalışıyor mu?
- Grid’den ASCII üretilebiliyor mu?
- ASCII’den grid üretilebiliyor mu?
- Çok haneli fret render bozmuyor mu?

### Note utils testleri

Kontrol edilecekler:

- MIDI 69 = A4
- A4 frekansı 440 Hz
- Fret hesabı doğru
- Cents hesabı doğru

### Practice engine testleri

Kontrol edilecekler:

- Doğru nota gelince ilerliyor mu?
- Yanlış nota gelince ilerlemiyor mu?
- Egzersiz tamamlanıyor mu?
- Mistake kaydı oluşuyor mu?

---

## 34. Definition of Done

MVP tamamlanmış sayılması için:

1. Kullanıcı ASCII tab yapıştırabiliyor.
2. Kullanıcı interaktif grid ile tab oluşturabiliyor.
3. Grid ile ASCII editor senkron çalışıyor.
4. Tab doğru parse ediliyor.
5. Sıradaki nota UI’da gösteriliyor.
6. Mikrofon izni alınabiliyor.
7. Gitar sesi analiz ediliyor.
8. Doğru nota algılanınca tabdaki nota yeşil oluyor.
9. Yanlış nota çalınca ilerlemiyor.
10. Duyulan nota ve beklenen nota gösteriliyor.
11. BPM/metronom çalışıyor.
12. Egzersiz sonunda sonuç ekranı gösteriliyor.
13. Tab ve ayarlar LocalStorage’a kaydediliyor.
14. Proje TypeScript ile hatasız build alıyor.
15. Temel unit testler geçiyor.
16. Kod modüler ve okunabilir.
17. Uygulama localde `npm install` ve `npm run dev` ile çalışıyor.

---

## 35. İlk Kodlama Görevi

AI coding agent aşağıdaki sırayla uygulamayı geliştirmelidir:

### Aşama 1

- Vite + React + TypeScript projesi oluştur.
- Tailwind kur.
- Temel layout oluştur.
- Header ve mode switcher oluştur.

### Aşama 2

- `tabParser.ts` yaz.
- `noteUtils.ts` yaz.
- ASCII tab editor componentini yaz.
- Örnek tab parse edip UI’da göster.

### Aşama 3

- `tabGrid.ts` ve `tabRenderer.ts` yaz.
- Interactive grid editor componentini oluştur.
- Hücreye tıklayıp fret ekleme sistemini yaz.
- Grid’den ASCII üret.
- ASCII’den grid üret.

### Aşama 4

- Practice state yönetimini oluştur.
- Current note panelini ekle.
- Manual “mark correct” butonu ile ilerleme test et.

### Aşama 5

- Web Audio API ile mikrofon erişimi ekle.
- Pitch detection ekle.
- Audio status panelinde duyulan frekans/notayı göster.

### Aşama 6

- Pitch detection ile practice engine’i bağla.
- Doğru nota gelince otomatik ilerlet.
- Yanlış nota gelince hata göster.

### Aşama 7

- Metronom ekle.
- BPM ayarı ekle.
- BPM Strict Mode’un basit versiyonunu ekle.

### Aşama 8

- LocalStorage ile tab ve ayar kaydet.
- Results panel ekle.
- Unit testleri yaz.
- Build hatalarını düzelt.

---

## 36. AI Coding Agent Talimatı

Bu PRD’ye göre production kalitesine yakın bir MVP geliştir.

Kurallar:

1. TypeScript kullan.
2. Kod modüler olsun.
3. Büyük componentler küçük parçalara bölünsün.
4. Audio logic UI componentlerinin içine gömülmesin.
5. Tab parser ayrı modül olsun.
6. Grid editor logic ayrı modül olsun.
7. Practice engine ayrı modül olsun.
8. Pitch detection ayrı modül olsun.
9. Gereksiz backend kurma.
10. İlk sürüm browser içinde çalışsın.
11. UI sade ama kullanılabilir olsun.
12. Koyu tema kullan.
13. Kullanıcıya net hata mesajları göster.
14. Unit test yaz.
15. README.md dosyasına kurulum ve kullanım yaz.
16. Eğer teknik belirsizlik varsa MVP için en basit doğru çözümü seç.
17. Interaktif tab editörü MVP’nin ana parçası olarak ele alınmalı.
18. ASCII editor ve interactive editor çift yönlü senkron olmalı.

---

## 37. README İçeriği

README.md içinde şunlar olmalı:

```text
# TabFlow

Interactive guitar tab trainer.

## Features

- Paste ASCII guitar tabs
- Build tabs with an interactive grid editor
- Real-time microphone pitch detection
- Note-by-note practice
- Wait Mode
- BPM/metronome
- Correct/wrong visual feedback
- Local-only audio processing

## Installation

npm install
npm run dev

## Build

npm run build

## Test

npm run test

## Privacy

Audio is processed locally in the browser. No audio is uploaded.
```

---

## 38. Başarı Metrikleri

MVP başarı kriterleri:

```text
- Kullanıcı 1 dakika içinde tab oluşturup çalışmaya başlayabiliyor.
- Kullanıcı ASCII bilmeden interactive grid ile egzersiz oluşturabiliyor.
- Clean gitarla tek nota doğruluğu kabul edilebilir seviyede.
- Kullanıcı yanlış nota çaldığında sistem çoğunlukla ilerlemiyor.
- Doğru nota çalındığında gecikme rahatsız edici değil.
- Tab preview anlaşılır.
```

Ürün metrikleri, ileride backend eklendiğinde:

```text
- Günlük pratik süresi
- Tamamlanan egzersiz sayısı
- Ortalama doğruluk oranı
- Kullanıcının BPM gelişimi
- En çok hata yapılan notalar
- Oluşturulan tab sayısı
- Kaydedilen egzersiz sayısı
```

---

## 39. Riskler

### Risk 1 — Mikrofon doğruluğu düşük olabilir

Çözüm:

```text
- Clean ton öner.
- Kulaklık öner.
- RMS threshold kullan.
- Stabilite süresi kullan.
- Tolerans ayarı sun.
```

### Risk 2 — Aynı nota farklı telde çalınabilir

Mikrofon sadece notayı algılar, tel/perdeyi kesin anlayamaz.

Çözüm:

```text
MVP’de doğru nota yeterli kabul edilir.
UI’da bu açıkça belirtilir.
```

Gösterilecek not:

```text
MVP doğru notayı algılar. Aynı notayı farklı telde çalarsanız doğru kabul edilebilir.
```

### Risk 3 — Akorlar doğru algılanamayabilir

Çözüm:

```text
MVP sadece tek nota destekler.
Akorlar V1.2 veya V2 kapsamına alınır.
```

### Risk 4 — Telifli tab içerikleri

Çözüm:

```text
Uygulama telifli tab kütüphanesi sunmaz.
Kullanıcı kendi tabını girer.
```

### Risk 5 — Interaktif grid ile ASCII senkronizasyonu karmaşıklaşabilir

Çözüm:

```text
MVP’de grid ana kaynak kabul edilebilir.
ASCII değiştiğinde parse başarılıysa grid güncellenir.
Parse başarısızsa eski grid korunur ve hata gösterilir.
```

---

## 40. Örnek UI Metinleri

Başlık:

```text
TabFlow
Kendi tabını yaz, gitarınla nota nota çalış.
```

Mikrofon izni açıklaması:

```text
Gitar sesini algılayabilmemiz için mikrofon izni gerekiyor. Ses cihazında analiz edilir, sunucuya gönderilmez.
```

Interaktif editör açıklaması:

```text
Tel ve step seçerek kendi tabını oluştur. Bir hücreye tıkla, fret numarasını gir ve Enter’a bas.
```

Başlama butonu:

```text
Start Practice
```

Beklenen nota:

```text
Şu an çal: D teli 0. perde
Beklenen nota: D
```

Yanlış nota:

```text
Yanlış nota. Beklenen: D, Duyulan: F#
```

Tamamlandı:

```text
Egzersiz tamamlandı.
```

---

## 41. En Önemli MVP İlkesi

Bu ürünün ilk versiyonu şu cümleyi kusursuza yakın gerçekleştirmelidir:

```text
Kullanıcı interaktif olarak veya ASCII ile tek nota içeren bir tab oluşturur, doğru notayı çaldıkça tab yeşile döner ve ilerler.
```

Bunun dışındaki her özellik ikincildir.

---

## 42. Codex / Cursor İçin Kısa Prompt

Bu PRD’ye göre projeyi sıfırdan oluştur.

Öncelik sırası:

1. Çalışan Vite + React + TypeScript uygulaması kur.
2. Interaktif tab editörünü ve ASCII editörü oluştur.
3. Grid ile ASCII senkronizasyonunu kur.
4. Tab parser ve note utils modüllerini yaz.
5. Practice engine’i manuel ilerlemeyle test et.
6. Web Audio API ile mikrofon pitch detection ekle.
7. Doğru nota algılanınca otomatik ilerlemeyi bağla.
8. Metronom ve BPM kontrollerini ekle.
9. LocalStorage kayıtlarını ekle.
10. Unit testleri yaz.
11. README.md oluştur.
12. Build hatalarını düzelt.

Gereksiz backend kurma. İlk MVP tamamen browser içinde çalışsın. Kod modüler, temiz ve genişletilebilir olsun.

Ek olarak proje Ubuntu 24 sunucuda Docker üzerinde çalışacak şekilde hazırlanmalı:
- Dockerfile
- docker-compose.yml
- nginx.conf
- .dockerignore
- README içinde Docker deployment adımları
- Varsayılan port: 8080
- Production static build: Vite build + Nginx container
- Mikrofon erişimi için HTTPS gerekliliği README’de belirtilmeli.

---

## 43. Deployment ve Çalışma Ortamı

Bu ürünün MVP ve production preview ortamı kullanıcının kendi Ubuntu 24 sunucusunda Docker üzerinde çalışacak şekilde hazırlanmalıdır.

Hedef çalışma ortamı:

```text
OS: Ubuntu 24.04 LTS
Runtime: Docker
Orchestration: Docker Compose
App type: Frontend-only Vite/React static build
Serving: Nginx container veya Caddy container
Optional reverse proxy: Host üzerindeki Nginx / Caddy / Traefik
```

İlk MVP backend gerektirmediği için uygulama production build alındıktan sonra statik dosya olarak servis edilebilir.

---

## 44. Docker Gereksinimleri

Projede aşağıdaki dosyalar bulunmalıdır:

```text
Dockerfile
docker-compose.yml
.dockerignore
nginx.conf
```

Amaç:

```text
npm run build ile Vite production build alınır.
Build çıktısı Nginx container içinde servis edilir.
Uygulama Ubuntu 24 sunucuda docker compose up -d ile ayağa kalkar.
```

---

## 45. Dockerfile Gereksinimi

Dockerfile multi-stage build kullanmalıdır.

Örnek yapı:

```Dockerfile
# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Runtime stage
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

Notlar:

```text
- Node sürümü güncel LTS olmalı.
- Production runtime içinde node_modules taşınmamalı.
- Runtime image küçük olmalı.
- Build çıktısı Nginx ile servis edilmeli.
```

---

## 46. docker-compose.yml Gereksinimi

MVP için tek servis yeterlidir.

Örnek:

```yaml
services:
  tabflow:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: tabflow
    restart: unless-stopped
    ports:
      - "8080:80"
```

Bu yapı ile uygulama şu adreste çalışmalıdır:

```text
http://SUNUCU_IP:8080
```

Eğer sunucuda reverse proxy varsa dış dünyaya şu şekilde açılabilir:

```text
https://tabflow.example.com
```

---

## 47. nginx.conf Gereksinimi

React/Vite SPA için Nginx route fallback ayarı olmalıdır.

Örnek:

```nginx
server {
  listen 80;
  server_name _;

  root /usr/share/nginx/html;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }

  location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
    expires 30d;
    add_header Cache-Control "public, max-age=2592000";
  }
}
```

---

## 48. .dockerignore Gereksinimi

Proje kökünde `.dockerignore` bulunmalıdır.

Örnek:

```text
node_modules
dist
.git
.gitignore
.env
.env.local
npm-debug.log
Dockerfile
docker-compose.override.yml
README.md
```

Not:

```text
README.md build için gerekli değilse ignore edilebilir.
Eğer Docker içinde dokümantasyon gerekiyorsa README.md ignore edilmemelidir.
```

---

## 49. Ubuntu 24 Sunucu Kurulum Talimatı

README.md içinde Ubuntu 24 için kurulum adımları olmalıdır.

Örnek:

```bash
sudo apt update
sudo apt install -y ca-certificates curl gnupg git
```

Docker kurulumu sistemde yoksa:

```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
```

Docker Compose kontrolü:

```bash
docker compose version
```

Projeyi çalıştırma:

```bash
git clone <repo-url>
cd tabflow
docker compose up -d --build
```

Logları izleme:

```bash
docker compose logs -f
```

Durdurma:

```bash
docker compose down
```

Yeniden build alma:

```bash
docker compose up -d --build
```

---

## 50. Production Ortam Notları

Mikrofon erişimi tarayıcı güvenlik politikaları nedeniyle önemlidir.

Çoğu modern tarayıcıda microphone API şu ortamlarda düzgün çalışır:

```text
- localhost
- HTTPS domain
```

Bu yüzden production sunucuda uygulama gerçek kullanıcıya açılacaksa HTTPS kullanılmalıdır.

Önerilen production yapı:

```text
Internet
↓
Domain + HTTPS
↓
Host Nginx / Caddy / Traefik reverse proxy
↓
Docker container: tabflow
↓
Nginx static app
```

Örnek reverse proxy hedefi:

```text
http://127.0.0.1:8080
```

Eğer sadece kişisel kullanım veya test yapılacaksa:

```text
http://SUNUCU_IP:8080
```

fakat mikrofon izni bazı tarayıcılarda HTTPS olmadan çalışmayabilir. Bu yüzden testte sorun yaşanırsa domain + SSL kurulmalıdır.

---

## 51. Environment Değişkenleri

MVP frontend-only olduğu için zorunlu environment değişkeni yoktur.

Ancak ileride eklenebilecek ayarlar için `.env.example` dosyası oluşturulabilir:

```env
VITE_APP_NAME=TabFlow
VITE_DEFAULT_BPM=60
VITE_DEFAULT_TOLERANCE=NORMAL
```

Not:

```text
Mikrofon ve audio processing local çalıştığı için API key gerekmemelidir.
```

---

## 52. Healthcheck

Docker Compose içine basit healthcheck eklenebilir.

Örnek:

```yaml
services:
  tabflow:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: tabflow
    restart: unless-stopped
    ports:
      - "8080:80"
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://localhost"]
      interval: 30s
      timeout: 5s
      retries: 3
```

Eğer `nginx:alpine` image içinde `wget` yoksa healthcheck için farklı yöntem seçilebilir veya healthcheck kaldırılabilir.

---

## 53. Codex / Cursor İçin Ek Deployment Talimatı

AI coding agent, uygulamayı sadece local development için değil, Ubuntu 24 + Docker ortamında çalışacak şekilde hazırlamalıdır.

Ek kurallar:

1. Proje köküne `Dockerfile` ekle.
2. Proje köküne `docker-compose.yml` ekle.
3. Proje köküne `nginx.conf` ekle.
4. Proje köküne `.dockerignore` ekle.
5. `README.md` içine Docker ile çalıştırma adımlarını ekle.
6. Production build `npm run build` ile alınmalı.
7. Runtime container Nginx ile statik dosyaları servis etmeli.
8. Uygulama varsayılan olarak host üzerinde `8080` portundan erişilebilir olmalı.
9. React router veya SPA route’ları için Nginx fallback ayarı yapılmalı.
10. Mikrofon erişimi için HTTPS gerekliliği README içinde belirtilmeli.

Örnek çalıştırma hedefi:

```bash
docker compose up -d --build
```

Başarılı sonuç:

```text
TabFlow uygulaması Ubuntu 24 sunucuda Docker container olarak çalışır ve http://SUNUCU_IP:8080 adresinden açılır.
```

---

## 54. Güncellenmiş En Önemli MVP İlkesi

Bu ürünün ilk versiyonu şu cümleyi kusursuza yakın gerçekleştirmelidir:

```text
Kullanıcı Ubuntu 24 sunucusundaki Docker ortamında çalışan web uygulamasını açar, interaktif olarak veya ASCII ile tek nota içeren bir tab oluşturur, doğru notayı çaldıkça tab yeşile döner ve ilerler.
```

Bunun dışındaki her özellik ikincildir.
