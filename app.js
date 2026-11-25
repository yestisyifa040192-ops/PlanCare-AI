/* =========================================
   PLANTCARE AI
   11 jenis tanaman
   ========================================= */

const MODEL_URL =
  "https://teachablemachine.withgoogle.com/models/j1Ae0LpoI/";

const HISTORY_KEY = "plantcare-ai-history-v1";

let model = null;
let currentImage = null;
let cameraStream = null;
let isAnalyzing = false;

const $ = id => document.getElementById(id);

// =========================================
// 1. DATA TANAMAN
// =========================================

const plants = {
  
  bayam: {
    name: "Bayam",
    image: "bayam.jpeg",
    spec: "Daun sederhana, oval/lonjong, hijau; tepi umumnya rata.",
    healthy: "Hijau segar, tidak layu, tidak banyak bercak/lubang.",
    healthyCare: "Jaga penyiraman teratur, cukup cahaya, drainase baik, dan periksa daun secara berkala.",
    symptomaticSpec: "Bercak, menguning, berlubang atau layu; gejala tidak otomatis menunjukkan satu penyakit tertentu.",
    symptomaticCare: "Buang daun rusak berat, periksa hama, hindari daun terlalu lama basah dan genangan."
  },

  jeruk: {
    name: "Jeruk",
    image: "jeruk.jpeg",
    spec: "Daun oval/lonjong, hijau, bertulang daun jelas.",
    healthy: "Warna hijau relatif merata, bentuk normal, tidak menggulung.",
    healthyCare: "Siram sesuai kebutuhan, beri nutrisi seimbang, pangkas ranting mati, dan periksa tunas muda.",
    symptomaticSpec: "Klorosis/menguning tidak merata, tulang daun tetap hijau, daun kecil atau berlorong.",
    symptomaticCare: "Periksa hama dan akar; jangan memastikan CVPD hanya dari foto, pemeriksaan laboratorium dapat diperlukan."
  },

  nangka: {
    name: "Nangka",
    image: "nangka.jpeg",
    spec: "Daun oval hingga lonjong, hijau dan relatif licin.",
    healthy: "Daun utuh, hijau, tidak banyak bercak.",
    healthyCare: "Jaga drainase, bersihkan area pangkal, dan periksa daun serta ranting berkala.",
    symptomaticSpec: "Bercak cokelat/kehitaman, menguning atau mengering.",
    symptomaticCare: "Buang daun gugur/rusak, pangkas bagian mati dengan alat bersih, pantau penyebaran."
  },

  kelor: {
    name: "Kelor",
    image: "kelor.JPG",
    spec: "Daun majemuk dengan anak daun kecil berbentuk oval.",
    healthy: "Anak daun hijau segar, tidak banyak berlubang.",
    healthyCare: "Pastikan cahaya cukup, drainase baik, dan pemangkasan tidak berlebihan.",
    symptomaticSpec: "Bercak, menguning, berlubang atau gugur lebih awal.",
    symptomaticCare: "Periksa hama, buang bagian rusak berat, hindari tanah tergenang."
  },

  katup: {
    name: "Katup",
    image: "katup.JPG",
    spec: "Daun sederhana, kecil, oval/lonjong, hijau.",
    healthy: "Hijau segar dengan bentuk normal.",
    healthyCare: "Siram sesuai kondisi tanah, jaga drainase, pangkas seperlunya.",
    symptomaticSpec: "Menguning, menggulung, berlubang atau bercak.",
    symptomaticCare: "Periksa bagian bawah daun dan hama; buang daun rusak; sesuaikan air."
  },

  mengkudu: {
    name: "Mengkudu",
    image: "mengkudu.JPG",
    spec: "Daun besar, oval/lonjong dengan tulang daun jelas.",
    healthy: "Hijau, helaian utuh, tidak layu.",
    healthyCare: "Jaga kelembapan stabil, drainase baik, dan kebersihan area tanam.",
    symptomaticSpec: "Bercak cokelat, menguning atau tepi mengering.",
    symptomaticCare: "Periksa hama dan akar; buang daun rusak berat; hindari penyiraman berlebih."
  },

  belimbing_wuluh: {
    name: "Belimbing Wuluh",
    image: "belimbing wuluh.jpeg",
    spec: "Daun majemuk menyirip dengan anak daun kecil.",
    healthy: "Anak daun hijau, tidak banyak bercak.",
    healthyCare: "Jaga drainase, pangkas ranting mati, periksa daun secara rutin.",
    symptomaticSpec: "Menguning, bercak atau tepi mengering; perlu pemeriksaan penyebab.",
    symptomaticCare: "Bersihkan daun rusak/gugur, periksa hama, hindari genangan."
  },

  belimbing: {
    name: "Belimbing",
    image: "Belimbing.jpeg",
    spec: "Daun majemuk menyirip, anak daun oval.",
    healthy: "Hijau segar, bentuk relatif normal.",
    healthyCare: "Siram sesuai kebutuhan, jaga kebersihan dan sirkulasi udara.",
    symptomaticSpec: "Bercak, perubahan warna atau bentuk daun.",
    symptomaticCare: "Pisahkan/buang daun rusak berat dan amati penyebaran gejala."
  },

  daun_sup: {
    name: "Daun Sup",
    image: "daun sup .jpeg",
    spec: "Daun majemuk berlekuk, hijau, bertangkai.",
    healthy: "Hijau segar, tidak layu, tangkai kokoh.",
    healthyCare: "Jaga media tetap lembap tetapi tidak tergenang; siram pada pangkal.",
    symptomaticSpec: "Mosaik, vein clearing, menguning atau bercak.",
    symptomaticCare: "Buang daun bergejala, kendalikan serangga vektor sesuai panduan dan hindari memindahkan tanaman terinfeksi."
  },

  jambu: {
    name: "Jambu Monyet",
    image: "jambu.jpeg",
    spec: "Daun lebar, oval/lonjong, hijau.",
    healthy: "Daun utuh, hijau, tidak banyak bercak.",
    healthyCare: "Jaga drainase, periksa hama dan pangkas bagian mati.",
    symptomaticSpec: "Bercak gelap, lubang atau tepi mengering.",
    symptomaticCare: "Periksa hama dan perkembangan bercak; buang bagian mati; hindari kelembapan berlebih."
  },

  kacang_panjang: {
    name: "Kacang Panjang",
    image: "kacang panjang.jpeg",
    spec: "Daun majemuk dengan tiga anak daun.",
    healthy: "Hijau, bentuk normal, tidak banyak kerusakan.",
    healthyCare: "Sediakan rambatan, air cukup, dan sirkulasi udara.",
    symptomaticSpec: "Mosaik, menguning, keriting, bercak atau lubang.",
    symptomaticCare: "Periksa kutu daun/serangga; tanaman dengan dugaan virus perlu dikonfirmasi dan dipisahkan."
  },

  kangkung: {
    name: "Kangkung",
    image: "kangkung.jpeg",
    spec: "Daun lonjong hingga menyerupai mata tombak.",
    healthy: "Hijau segar, tidak layu.",
    healthyCare: "Sesuaikan air dengan sistem budidaya; jaga kebersihan dan nutrisi.",
    symptomaticSpec: "Bercak, lubang, menguning atau layu.",
    symptomaticCare: "Periksa hama dan akar; atur air dan drainase sesuai media tanam."
  },

  lobak: {
    name: "Lobak",
    image: "lobak.jpeg",
    spec: "Daun hijau, berlekuk atau menjari.",
    healthy: "Hijau segar dan tidak banyak lubang.",
    healthyCare: "Jaga kelembapan stabil, drainase baik, dan periksa hama.",
    symptomaticSpec: "Lubang bekas gigitan, bercak atau menguning.",
    symptomaticCare: "Periksa ulat/serangga, gunakan pelindung tanaman bila perlu, dan buang daun yang sangat rusak."
  },

  sawi: {
    name: "Sawi",
    image: "sawi .jpeg",
    spec: "Daun hijau, oval hingga memanjang, tulang daun jelas.",
    healthy: "Hijau segar, helaian utuh.",
    healthyCare: "Jaga jarak tanam, air cukup, dan bersihkan gulma/sisa tanaman.",
    symptomaticSpec: "Bercak kecil gelap, menguning, berlubang atau lapisan putih.",
    symptomaticCare: "Buang daun terinfeksi, periksa ulat, jaga sirkulasi udara dan hindari daun terlalu lama basah."
  },

  sirsak: {
    name: "Sirsak",
    image: "sirsak.jpeg",
    spec: "Daun oval/lonjong, hijau, permukaan relatif halus.",
    healthy: "Hijau, tidak banyak bercak dan tidak layu.",
    healthyCare: "Jaga drainase, siram sesuai kebutuhan, dan periksa daun berkala.",
    symptomaticSpec: "Bercak kecil hitam/cokelat yang dapat membesar.",
    symptomaticCare: "Buang daun rusak berat, pangkas bagian mati, dan pantau gejala pada daun lain."
  },

  terong: {
    name: "Terong",
    image: "terong.jpeg",
    spec: "Daun lebar, oval/berlekuk, kadang berbulu halus.",
    healthy: "Hijau segar, tidak layu atau bercak berat.",
    healthyCare: "Siram pangkal tanaman, jaga drainase dan periksa bawah daun.",
    symptomaticSpec: "Bercak dengan pusat cokelat, menguning, berlubang atau keriting.",
    symptomaticCare: "Buang daun rusak berat, periksa hama, dan cek akar/batang bila layu berlanjut."
  },

  timun: {
    name: "Timun",
    image: "timun.jpeg",
    spec: "Daun lebar, berlekuk/menjari.",
    healthy: "Hijau segar, bentuk relatif normal.",
    healthyCare: "Siram pangkal, sediakan rambatan bila perlu, dan jaga sirkulasi udara.",
    symptomaticSpec: "Daun menguning/keriting, mosaik atau bercak.",
    symptomaticCare: "Buang daun rusak berat, periksa hama, dan jangan menetapkan virus hanya dari foto."
  },

  alpukat: {
    name: "Alpukat",
    image: "alpukat.jpeg",
    spec: "Daun oval/lonjong, hijau dengan tulang daun jelas.",
    healthy: "Hijau, utuh, tidak layu atau bercak berat.",
    healthyCare: "Jaga drainase, siram sesuai kebutuhan, dan periksa tunas baru.",
    symptomaticSpec: "Bercak cokelat/kehitaman, tepi mengering atau hawar.",
    symptomaticCare: "Buang daun terinfeksi, hindari pembasahan berlebihan, dan pantau apakah bercak meluas."
  },

  cabai: {
    name: "Cabai",
    image: "cabe.jpeg",
    spec: "Daun oval/lanset, hijau, ujung meruncing.",
    healthy: "Hijau, tidak keriting dan tidak banyak bercak.",
    healthyCare: "Siram pangkal, jaga nutrisi seimbang, periksa hama secara rutin.",
    symptomaticSpec: "Bercak, menguning, keriting atau berlubang.",
    symptomaticCare: "Periksa kutu daun/trips, buang bagian rusak dan konfirmasi penyebab sebelum pengendalian."
  },

  pepaya: {
    name: "Pepaya",
    image: "pepaya.JPG",
    spec: "Daun besar menjari dengan tangkai panjang.",
    healthy: "Hijau dan membuka normal.",
    healthyCare: "Jaga drainase, hindari luka pada batang, periksa hama.",
    symptomaticSpec: "Mosaik, keriting, klorosis atau bercak.",
    symptomaticCare: "Periksa kemungkinan virus dan vektornya; gunakan bibit sehat; konfirmasi sebelum menyimpulkan penyebab."
  },

  pisang: {
    name: "Pisang",
    image: "pisang.jpeg",
    spec: "Daun besar memanjang dengan tulang tengah menonjol.",
    healthy: "Hijau luas, tidak ada bercak berat.",
    healthyCare: "Jaga nutrisi dan drainase; bersihkan daun mati secara hati-hati.",
    symptomaticSpec: "Bercak cokelat/kehitaman, garis atau area kering.",
    symptomaticCare: "Pangkas bagian mati dengan alat bersih, bersihkan sisa tanaman dan pantau penyebaran."
  },

  singkong: {
    name: "Singkong",
    image: "singkong.jpeg",
    spec: "Daun menjari dengan beberapa lobus.",
    healthy: "Lobus hijau dan tidak banyak nekrosis.",
    healthyCare: "Gunakan bahan tanam sehat, jaga air dan kebersihan kebun.",
    symptomaticSpec: "Bercak, hawar, nekrosis atau tepi menguning.",
    symptomaticCare: "Buang sisa tanaman sakit sesuai panduan setempat dan pantau penyebaran."
  },

  mangga: {
    name: "Mangga",
    image: "mangga.JPG",
    spec: "Daun lonjong/lanset, hijau, tulang tengah jelas.",
    healthy: "Hijau dan tidak banyak bercak.",
    healthyCare: "Jaga drainase, pangkas bagian mati, hindari tajuk terlalu rapat.",
    symptomaticSpec: "Bercak cokelat/kehitaman atau bagian daun mengering.",
    symptomaticCare: "Pangkas daun/ranting rusak, jaga kebersihan kebun dan pantau gejala."
  },

  tomat: {
    name: "Tomat",
    image: "tomat.jpeg",
    spec: "Daun majemuk, berlekuk, berwarna hijau.",
    healthy: "Hijau, tidak layu dan pertumbuhan normal.",
    healthyCare: "Siram pangkal, jaga jarak tanam, beri nutrisi sesuai kebutuhan.",
    symptomaticSpec: "Bercak cokelat/kuning, menggulung atau layu.",
    symptomaticCare: "Buang daun bergejala berat, periksa bagian bawah daun, dan identifikasi penyebab sebelum penanganan."
  },

  jambu_biji: {
    name: "Jambu Biji",
    image: "jambu biji.jpeg",
    spec: "Daun oval, berhadapan, tulang daun jelas.",
    healthy: "Hijau, utuh, tidak banyak bercak.",
    healthyCare: "Jaga drainase, periksa hama, bersihkan daun gugur.",
    symptomaticSpec: "Bercak cokelat/kehitaman, menguning atau berlubang.",
    symptomaticCare: "Periksa hama dan perluasan bercak; buang daun rusak berat dan pangkas bagian mati."
  }
};

// =========================================
// 2. MEMBACA LABEL TEACHABLE MACHINE
// =========================================

function parseLabel(label) {
  const normalized = String(label || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

  // Mendukung kata GEJALA maupun BERGEJALA.
  const symptomatic =
    /\b(bergejala|gejala|sakit|rusak|symptomatic|symptom)\b/.test(normalized);

  const healthy =
    /\b(sehat|healthy)\b/.test(normalized);

  // Tidak menebak kondisi jika label tidak jelas.
  if (symptomatic === healthy) {
    return null;
  }

  // Bersihkan kata penanda dan kata "daun".
  const rawName = normalized
    .replace(/\b(daun|leaf|leaves)\b/g, " ")
    .replace(
      /\b(bergejala|gejala|sakit|rusak|symptomatic|symptom|sehat|healthy)\b/g,
      " "
    )
    .replace(/\s+/g, " ")
    .trim();

  if (!rawName) return null;

  // Alias untuk variasi nama tanaman.
  const aliases = {
    "cabai": "cabe",
    "cabe rawit": "cabe",
    "cabai rawit": "cabe",
    "jambu biji": "jambu"
  };

  const key = aliases[rawName] || rawName;

  if (!plants[key]) {
    // Nama kelas yang tidak ada dalam data tidak dipaksakan
    // menjadi salah satu tanaman lain.
    return {
      key: null,
      plantName: rawName.replace(/\b\w/g, c => c.toUpperCase()),
      condition: symptomatic ? "Bergejala" : "Sehat",
      symptomatic
    };
  }

  return {
    key,
    plantName: plants[key].name,
    condition: symptomatic ? "Bergejala" : "Sehat",
    symptomatic
  };
}

// =========================================
// 3. MEMUAT MODEL AI
// =========================================

async function loadModel() {
  const status = $("modelStatus");
  const button = $("analyzeButton");

  if (!status || !button) {
    console.error(
      "Elemen modelStatus atau analyzeButton tidak ditemukan."
    );
    return;
  }

  button.disabled = true;

  try {
    status.textContent = "Memuat model AI...";

    if (typeof tmImage === "undefined") {
      throw new Error("Library Teachable Machine belum dimuat.");
    }

    const url = MODEL_URL.endsWith("/")
      ? MODEL_URL
      : MODEL_URL + "/";

    model = await tmImage.load(
      url + "model.json",
      url + "metadata.json"
    );

    status.textContent = "Model AI siap digunakan.";
    button.disabled = !currentImage;

  } catch (error) {
    console.error("Gagal memuat model:", error);

    status.textContent =
      "Model gagal dimuat. Periksa URL dan koneksi internet.";

    button.disabled = true;
  }
}

// =========================================
// 4. PILIH DAN TAMPILKAN FOTO
// =========================================

function preview(src) {
  currentImage = src;

  $("preview").src = src;
  $("previewArea").hidden = false;
  $("resultPanel").hidden = true;

  $("analyzeButton").disabled = !model || isAnalyzing;
}

if ($("imageInput")) {
  $("imageInput").addEventListener("change", event => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Pilih file gambar yang valid.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      stopCamera();
      preview(reader.result);
    };

    reader.onerror = () => {
      alert("Foto gagal dibaca. Silakan pilih ulang.");
    };

    reader.readAsDataURL(file);
  });
}

// =========================================
// 5. KAMERA
// =========================================

function stopCamera() {
  if (cameraStream) {
    cameraStream.getTracks().forEach(track => track.stop());
  }

  cameraStream = null;

  if ($("camera")) {
    $("camera").srcObject = null;
  }

  if ($("cameraArea")) {
    $("cameraArea").hidden = true;
  }

  if ($("startCamera")) {
    $("startCamera").disabled = false;
  }

  if ($("stopCamera")) {
    $("stopCamera").disabled = true;
  }
}

if ($("startCamera")) {
  $("startCamera").addEventListener("click", async () => {
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("Kamera tidak tersedia.");
      }

      cameraStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false
      });

      $("camera").srcObject = cameraStream;
      await $("camera").play();

      $("cameraArea").hidden = false;
      $("startCamera").disabled = true;
      $("stopCamera").disabled = false;

    } catch (error) {
      console.error("Kamera gagal dibuka:", error);
      stopCamera();

      alert(
        "Izinkan akses kamera dan gunakan localhost atau HTTPS."
      );
    }
  });
}

if ($("stopCamera")) {
  $("stopCamera").addEventListener("click", stopCamera);
}

if ($("capturePhoto")) {
  $("capturePhoto").addEventListener("click", () => {
    const video = $("camera");

    if (!video || !video.videoWidth) {
      alert("Tunggu sampai kamera siap.");
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    canvas.getContext("2d").drawImage(
      video, 0, 0, canvas.width, canvas.height
    );

    preview(canvas.toDataURL("image/jpeg", 0.85));
    stopCamera();
  });
}


function showResult(image, label, probability) {
  const parsed = parseLabel(label);

  $("resultPanel").hidden = false;
  $("resultImage").src = image || "";

  const percent = Math.max(
    0,
    Math.min(100, Number(probability) * 100)
  );

  $("confidence").textContent = percent.toFixed(1) + "%";
  $("confidenceBar").style.width = percent + "%";
  $("predictionLabel").textContent = "Kelas model: " + label;

  if (!parsed) {
    $("plantName").textContent = "Tanaman belum dikenali";
    $("conditionBadge").textContent = "Periksa label model";

    $("specification").textContent =
      "Nama tanaman atau kondisi belum dapat dibaca dari label kelas.";

    $("careAdvice").textContent =
      "Gunakan label yang mencantumkan nama tanaman serta kondisi, misalnya DAUN JERUK SEHAT atau NANGKA GEJALA.";

    return null;
  }

  $("plantName").textContent = parsed.plantName;
  $("conditionBadge").textContent = parsed.condition;

  const data = parsed.key ? plants[parsed.key] : null;

  $("specification").textContent = data
    ? (
        parsed.symptomatic
          ? (data.symptomaticSpec || data.spec)
          : data.spec
      )
    : "Spesifikasi untuk tanaman ini belum ditambahkan.";

  $("careAdvice").textContent = data
    ? (
        parsed.symptomatic
          ? (
              data.symptomaticCare ||
              "Saran perawatan untuk daun bergejala belum tersedia."
            )
          : (
              data.healthyCare ||
              "Saran perawatan untuk daun sehat belum tersedia."
            )
      )
    : "Tambahkan spesifikasi dan saran perawatan untuk tanaman ini pada data plants.";

  return parsed;
}


// =========================================
// 7. MEMPERKECIL FOTO RIWAYAT
// =========================================

function compressImage(src) {
  return new Promise(resolve => {
    const image = new Image();

    image.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const maxSize = 320;

        const scale = Math.min(
          1,
          maxSize / Math.max(image.width, image.height)
        );

        canvas.width = Math.max(
          1, Math.round(image.width * scale)
        );

        canvas.height = Math.max(
          1, Math.round(image.height * scale)
        );

        canvas.getContext("2d").drawImage(
          image, 0, 0, canvas.width, canvas.height
        );

        resolve(canvas.toDataURL("image/jpeg", 0.55));
      } catch (error) {
        console.error(error);
        resolve("");
      }
    };

    image.onerror = () => resolve("");
    image.src = src;
  });
}

// =========================================
// 8. TOMBOL IDENTIFIKASI
// =========================================

if ($("analyzeButton")) {
  $("analyzeButton").addEventListener("click", async () => {
    if (isAnalyzing) return;

    if (!model) {
      alert("Tunggu sampai model AI siap.");
      return;
    }

    if (!currentImage) {
      alert("Unggah foto daun terlebih dahulu.");
      return;
    }

    isAnalyzing = true;

    const button = $("analyzeButton");
    button.disabled = true;
    button.textContent = "Menganalisis...";

    try {
      const image = new Image();
      image.src = currentImage;

      await image.decode();

      const predictions = await model.predict(image);

      if (!predictions || predictions.length === 0) {
        throw new Error("Model tidak menghasilkan prediksi.");
      }

      predictions.sort(
        (a, b) => b.probability - a.probability
      );

      const best = predictions[0];

      const parsed = showResult(
        currentImage,
        best.className,
        best.probability
      );

      const historyImage = await compressImage(currentImage);

      saveHistory({
        plant: parsed ? parsed.plantName : "Belum dikenali",
        condition: parsed ? parsed.condition : "Belum dikenali",
        confidence: best.probability,
        label: best.className,
        date: new Date().toLocaleString("id-ID"),
        image: historyImage
      });

      $("resultPanel").scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    } catch (error) {
      console.error("Analisis gagal:", error);

      alert(
        "Analisis gagal. Periksa foto, URL model, dan koneksi internet."
      );

    } finally {
      isAnalyzing = false;
      button.textContent = "Identifikasi dengan AI";
      button.disabled = !model || !currentImage;
    }
  });
}

// =========================================
// 9. PENYIMPANAN RIWAYAT
// =========================================

function getHistory() {
  try {
    const history = JSON.parse(
      localStorage.getItem(HISTORY_KEY) || "[]"
    );

    return Array.isArray(history) ? history : [];
  } catch (error) {
    console.error("Riwayat gagal dibaca:", error);
    return [];
  }
}

function saveHistory(item) {
  const history = getHistory();
  history.unshift(item);

  try {
    localStorage.setItem(
      HISTORY_KEY,
      JSON.stringify(history.slice(0, 8))
    );
  } catch (error) {
    console.error("Penyimpanan riwayat gagal:", error);

    try {
      const reduced = history.slice(0, 8).map(entry => ({
        ...entry,
        image: ""
      }));

      localStorage.setItem(
        HISTORY_KEY,
        JSON.stringify(reduced)
      );
    } catch (secondError) {
      console.error(secondError);
      alert("Penyimpanan penuh. Hapus riwayat lama.");
    }
  }

  renderHistory();
}

// =========================================
// 10. MENAMPILKAN RIWAYAT
// =========================================

function renderHistory() {
  const element = $("historyList");

  if (!element) return;

  element.replaceChildren();

  const history = getHistory();

  if (history.length === 0) {
    const message = document.createElement("p");
    message.className = "hint";
    message.textContent = "Belum ada riwayat.";

    element.appendChild(message);
    return;
  }

  history.forEach(item => {
    const row = document.createElement("article");
    row.className = "history-item";

    if (item.image) {
      const img = document.createElement("img");
      img.src = item.image;
      img.alt = "Foto riwayat tanaman";
      row.appendChild(img);
    }

    const details = document.createElement("div");
    const title = document.createElement("strong");
    const small = document.createElement("small");

    title.textContent =
      item.plant + " — " + item.condition;

    small.textContent =
      item.date + " · " +
      (Number(item.confidence || 0) * 100).toFixed(1) + "%";

    details.append(title, small);

    const button = document.createElement("button");
    button.type = "button";
    button.className = "btn alt";
    button.textContent = "Lihat";

    button.addEventListener("click", () => {
      if (item.image) {
        currentImage = item.image;
        $("preview").src = item.image;
        $("previewArea").hidden = false;
      }

      showResult(
        item.image || currentImage || "",
        item.label,
        Number(item.confidence || 0)
      );

      $("resultPanel").hidden = false;

      $("resultPanel").scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });

    row.append(details, button);
    element.appendChild(row);
  });
}

// =========================================
// 11. MENGHAPUS RIWAYAT
// =========================================

if ($("clearHistory")) {
  $("clearHistory").addEventListener("click", () => {
    if (confirm("Hapus semua riwayat identifikasi?")) {
      localStorage.removeItem(HISTORY_KEY);
      renderHistory();
    }
  });
}

// =========================================
// 12. MULAI APLIKASI
// =========================================

renderHistory();
loadModel();
