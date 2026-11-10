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
  alpukat: {
    name: "Alpukat",
    image: "images/alpukat.jpeg",
    spec: "Daun berbentuk lonjong hingga elips, dengan ujung meruncing dan tulang daun menyirip.",
    symptomaticSpec: "Jika terlihat menguning atau berbintik, catat gejala tersebut; penyebabnya belum dapat dipastikan hanya dari foto.",
    healthy: "Jaga kelembapan tanah, berikan sinar matahari cukup, dan pastikan drainase baik.",
    symptomatic: "Periksa daun yang menguning atau berbintik. Amati kemungkinan hama, kelembapan tanah berlebih, dan gangguan nutrisi."
  },

  cabe: {
    name: "Cabe",
    image: "images/cabe.jpeg",
    spec: "Daun berbentuk lonjong dengan ujung meruncing dan tulang daun menyirip.",
    symptomaticSpec: "Jika terlihat menguning, berbintik, atau menggulung, periksa bagian bawah daun dan kondisi tanaman.",
    healthy: "Siram secukupnya pada pangkal tanaman, berikan sinar matahari cukup, dan jaga kesuburan tanah.",
    symptomatic: "Periksa daun yang menguning, berbintik, atau menggulung. Amati bagian bawah daun untuk mengetahui kemungkinan hama."
  },

  pepaya: {
    name: "Pepaya",
    image: "images/pepaya.JPG",
    spec: "Daun berukuran besar, bertangkai panjang, dan memiliki lekukan menjari yang dalam.",
    symptomaticSpec: "Jika terlihat menguning, bercak, atau menggulung, periksa drainase dan kemungkinan hama.",
    healthy: "Pastikan tanaman mendapat sinar matahari cukup, penyiraman teratur, dan tanah tidak tergenang.",
    symptomatic: "Periksa daun yang menguning, bercak, atau menggulung. Pastikan drainase baik dan amati kemungkinan serangan hama."
  },

  tomat: {
    name: "Tomat",
    image: "images/tomat.jpeg",
    spec: "Daun majemuk dengan anak daun berlekuk, tepi tidak rata, dan permukaan agak berambut.",
    symptomaticSpec: "Jika terlihat bercak atau mengering, periksa pola bercak dan kemungkinan hama sebelum menentukan penanganan.",
    healthy: "Berikan sinar matahari cukup, siram pada pangkal tanaman, dan gunakan penyangga bila diperlukan.",
    symptomatic: "Periksa bercak pada daun, perubahan warna, atau daun yang mengering. Hindari membasahi daun berlebihan dan periksa kemungkinan hama."
  },

  singkong: {
    name: "Singkong",
    image: "images/singkong.jpeg",
    spec: "Daun menjari dengan beberapa lobus panjang yang terpisah dan tangkai daun cukup panjang.",
    symptomaticSpec: "Jika terlihat menguning, berbintik, atau berubah bentuk, periksa kondisi air dan kemungkinan hama.",
    healthy: "Pastikan tanaman mendapat sinar matahari cukup, tanah memiliki drainase baik, dan air tersedia saat diperlukan.",
    symptomatic: "Periksa daun yang menguning, berbintik, atau berubah bentuk. Amati kemungkinan hama dan pastikan tanaman tidak kekurangan air."
  },

  pisang: {
    name: "Pisang",
    image: "images/pisang.jpeg",
    spec: "Daun sangat lebar dan memanjang, dengan tulang daun utama besar di bagian tengah.",
    symptomaticSpec: "Jika terlihat bercak cokelat atau mengering, periksa apakah kerusakan meluas pada daun lain.",
    healthy: "Jaga kelembapan tanah, berikan bahan organik, dan pastikan tanaman mendapat air yang cukup.",
    symptomatic: "Periksa bercak cokelat, bagian daun mengering, atau perubahan warna. Buang bagian yang benar-benar mati dengan alat bersih dan periksa kondisi tanaman."
  },

  mangga: {
    name: "Mangga",
    image: "images/mangga.JPG",
    spec: "Daun berbentuk lonjong memanjang, berujung runcing, dengan tulang daun menyirip yang jelas.",
    symptomaticSpec: "Jika terlihat bercak gelap, menguning, atau mengering, periksa kondisi kelembapan dan kemungkinan hama.",
    healthy: "Berikan sinar matahari cukup, siram sesuai kebutuhan, dan hindari tanah yang terus-menerus tergenang.",
    symptomatic: "Periksa bercak hitam, daun mengering, atau perubahan warna. Amati kemungkinan hama dan gangguan kelembapan."
  },

  jambu: {
    name: "Jambu",
    image: "images/jambu.jpeg",
    spec: "Daun umumnya berbentuk elips, dengan tulang daun menyirip yang cukup jelas. Ciri dapat berbeda menurut jenis jambu.",
    symptomaticSpec: "Jika terlihat bercak, menguning, atau tepi daun rusak, amati bagian bawah daun dan kondisi tanaman.",
    healthy: "Siram sesuai kondisi tanah, berikan sinar matahari cukup, dan lakukan pemangkasan seperlunya.",
    symptomatic: "Periksa bercak, daun menguning, atau kerusakan pada tepi daun. Amati kemungkinan hama dan jaga kebersihan area tanaman."
  },

  bayam: {
    name: "Bayam",
    image: "images/bayam.jpeg",
    spec: "Daun umumnya berbentuk oval hingga menyerupai belah ketupat, dengan tepi relatif rata.",
    symptomaticSpec: "Jika terlihat berlubang, berbintik, atau menguning, periksa kemungkinan hama serta kecukupan air dan nutrisi.",
    healthy: "Jaga tanah tetap lembap tetapi tidak tergenang, berikan sinar matahari cukup, dan pastikan nutrisi tanah memadai.",
    symptomatic: "Periksa daun yang menguning, berlubang, atau berbintik. Amati kemungkinan hama dan periksa kondisi air serta nutrisi tanah."
  },

  jeruk: {
    name: "Jeruk",
    image: "images/jeruk.jpeg",
    spec: "Daun umumnya berbentuk elips, berujung agak runcing, dan pada beberapa jenis memiliki tangkai bersayap.",
    symptomaticSpec: "Jika terlihat bercak, menguning, atau menggulung, periksa bagian bawah daun dan kemungkinan hama.",
    healthy: "Berikan sinar matahari cukup, siram sesuai kebutuhan, dan pastikan air tidak menggenang di sekitar akar.",
    symptomatic: "Periksa daun yang menguning, memiliki bercak, atau menggulung. Amati bagian bawah daun dan kemungkinan serangan hama."
  },

  nangka: {
    name: "Nangka",
    image: "images/nangka.jpeg",
    spec: "Daun umumnya berbentuk oval hingga elips, dengan ujung membulat atau sedikit meruncing dan tepi rata.",
    symptomaticSpec: "Jika terlihat bercak cokelat, menguning, atau mengering, periksa kondisi kelembapan dan kemungkinan hama.",
    healthy: "Pastikan tanaman mendapat sinar matahari cukup, penyiraman sesuai kebutuhan, dan drainase tanah yang baik.",
    symptomatic: "Periksa bercak cokelat, daun menguning, atau bagian daun mengering. Amati kemungkinan hama dan kondisi kelembapan tanah."
  },

  kelor: {
    name: "Daun Kelor",
    image: "kelor.JPG",
    spec: "Daun majemuk berukuran kecil, berbentuk bulat telur, berwarna hijau, dan tersusun berpasangan pada tangkai daun.",
    symptomatic: "Jika terlihat bercak cokelat, daun menguning, berlubang, atau layu, periksa kemungkinan gangguan hama, penyakit, atau kondisi lingkungan.",
    healthy: "Pastikan tanaman mendapatkan sinar matahari cukup, penyiraman teratur, dan tanah dengan drainase yang baik.",
  },

  katup: {
    name: "Daun Katup",
    image: "katup.JPG",
    spec: "Daun tunggal berbentuk lonjong hingga oval, berwarna hijau, dengan ujung meruncing dan tersusun berselang-seling pada batang.",
    symptomatic: "Jika daun menguning, memiliki bercak, berlubang, atau layu, periksa kondisi tanaman dan kemungkinan adanya hama.",
    healthy: "Berikan sinar matahari yang cukup, jaga kelembapan tanah, lakukan penyiraman secukupnya, dan pangkas bagian tanaman yang rusak.",
  },
  
  mengkudu: {
    name: "Daun Mengkudu",
    image: "mengkudu.JPG",
    spec: "Daun berukuran relatif besar, berbentuk elips hingga lonjong, berwarna hijau, dengan permukaan mengilap dan tulang daun yang jelas.",
    symptomatic: "Jika daun menunjukkan bercak cokelat, menguning, berlubang, atau layu, periksa kondisi daun dan lingkungan tumbuh tanaman.",
    healthy: "Pastikan tanaman memperoleh sinar matahari cukup, penyiraman sesuai kebutuhan, serta tanah yang subur dan tidak tergenang air.",
  },

  belimbingWuluh: {
  name: "Daun Belimbing Wuluh",
  image: "belimbing wuluh.jpeg",
  spec: "Daun majemuk menyirip dengan anak daun berbentuk lonjong, berwarna hijau, dan tersusun berpasangan pada tangkai daun.",
  symptomatic: "Jika daun menguning, memiliki bercak cokelat, berlubang, atau menggulung, periksa kondisi daun dan lingkungan tumbuh tanaman.",
  healthy: "Pastikan tanaman memperoleh sinar matahari cukup, penyiraman sesuai kebutuhan, serta tanah subur dengan drainase baik."
  },

  belimbing: {
  name: "Daun Belimbing",
  image: "Belimbing.jpeg",
  spec: "Daun majemuk menyirip dengan anak daun berbentuk oval hingga lonjong, ujung meruncing, dan berwarna hijau.",
  symptomatic: "Jika daun menunjukkan bercak gelap, menguning, berlubang, atau mengering, periksa kemungkinan hama dan kondisi lingkungan.",
  healthy: "Berikan sinar matahari cukup, siram secara teratur sesuai kebutuhan, dan gunakan tanah yang subur serta tidak tergenang."
  },

  daunSup: {
  name: "Daun Sup",
  image: "daun sup .jpeg",
  spec: "Daun memiliki beberapa bagian dengan bentuk menyerupai kipas dan tepi bergerigi.",
  symptomatic: "Jika daun menguning, memiliki bercak cokelat, berlubang, atau layu, periksa kelembapan tanah dan kemungkinan gangguan hama.",
  healthy: "Jaga kelembapan tanah, berikan cahaya matahari yang cukup, dan gunakan media tanam yang gembur."
  },

  jambuBiji: {
  name: "Daun Jambu Biji",
  image: "jambu biji.jpeg",
  spec: "Daun berbentuk oval hingga lonjong, berwarna hijau, dengan tulang daun menyirip yang jelas dan permukaan agak bertekstur.",
  symptomatic: "Jika daun menguning, memiliki bercak hitam atau cokelat, berlubang, atau mengering, periksa kondisi daun dan lingkungan tumbuh tanaman.",
  healthy: "Pastikan tanaman mendapat sinar matahari cukup, penyiraman sesuai kebutuhan, dan pemupukan secara berkala."
  },

  kacangPanjang: {
  name: "Daun Kacang Panjang",
  image: "kacang panjang.jpeg",
  spec: "Daun majemuk terdiri dari tiga anak daun berbentuk oval hingga meruncing, dengan warna hijau dan tulang daun yang jelas.",
  symptomatic: "Jika daun menguning, berlubang, menggulung, atau memiliki bercak, periksa kemungkinan hama dan kondisi pertumbuhan tanaman.",
  healthy: "Berikan sinar matahari cukup, jaga kelembapan tanah, dan pastikan tanah subur serta tidak tergenang air."
  },

  kangkung: {
  name: "Daun Kangkung",
  image: "kangkung.jpeg",
  spec: "Daun berbentuk memanjang hingga menyerupai mata tombak, berwarna hijau, dengan ujung meruncing dan tulang daun utama yang jelas.",
  symptomatic: "Jika daun menguning, berlubang, memiliki bercak, atau layu, periksa kondisi air, tanah, dan kemungkinan hama.",
  healthy: "Pastikan tanaman memperoleh cahaya matahari cukup, air sesuai kebutuhan, dan media tanam yang mendukung pertumbuhan."
  },

  lobak: {
  name: "Daun Lobak",
  image: "lobak.jpeg",
  spec: "Daun relatif lebar dengan tulang daun utama yang jelas serta tepi yang dapat berlekuk atau bergerigi.",
  symptomatic: "Jika daun berlubang, menguning, memiliki bercak gelap, atau mengering, periksa kemungkinan hama dan kondisi lingkungan.",
  healthy: "Gunakan tanah yang gembur dan subur, jaga kelembapan tanah, serta berikan sinar matahari yang cukup."
  },

  sawi: {
  name: "Daun Sawi",
  image: "sawi .jpeg",
  spec: "Daun berwarna hijau, berbentuk lebar, dengan tulang daun utama yang menonjol dan urat daun yang terlihat jelas.",
  symptomatic: "Jika daun menunjukkan bercak, lubang, perubahan warna menjadi kuning, atau layu, periksa kemungkinan hama dan kelembapan.",
  healthy: "Jaga tanah tetap lembap tetapi tidak tergenang, berikan cahaya cukup, dan lakukan pemupukan sesuai kebutuhan."
  },

  sirsak: {
  name: "Daun Sirsak",
  image: "sirsak.jpeg",
  spec: "Daun berbentuk elips hingga lonjong, berwarna hijau, dengan permukaan relatif licin dan ujung meruncing.",
  symptomatic: "Jika daun menguning, memiliki bercak cokelat atau hitam, atau mengering, periksa kondisi daun dan lingkungan tumbuh tanaman.",
  healthy: "Berikan sinar matahari cukup, lakukan penyiraman sesuai kebutuhan, dan pastikan tanah tidak tergenang air."
  },

  terong: {
  name: "Daun Terong",
  image: "terong.jpeg",
  spec: "Daun berbentuk oval hingga lonjong, dengan tulang daun menyirip yang jelas dan permukaan yang dapat memiliki rambut halus.",
  symptomatic: "Jika daun menguning, memiliki bercak, berlubang, menggulung, atau mengering, periksa kemungkinan hama dan kondisi pertumbuhan tanaman.",
  healthy: "Pastikan tanaman memperoleh sinar matahari cukup, tanah subur, penyiraman teratur, dan drainase yang baik."
  },

  timun: {
  name: "Daun Timun",
  image: "timun.jpeg",
  spec: "Daun berbentuk lebar menyerupai hati, dengan tulang daun menjari, permukaan agak kasar, dan tepi bergerigi.",
  symptomatic: "Jika daun memiliki bercak kuning atau cokelat, berlubang, menggulung, atau menunjukkan lapisan putih, periksa kondisi daun dan kemungkinan hama.",
  healthy: "Berikan sinar matahari cukup, jaga kelembapan tanah, gunakan media tanam subur, dan sediakan penyangga bagi batang yang merambat."
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

// =========================================
// 6. MENAMPILKAN HASIL IDENTIFIKASI
// =========================================

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
          ? data.symptomatic
          : data.healthy
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