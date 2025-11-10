// ===================== SMART GATE SYSTEM =====================
document.addEventListener("DOMContentLoaded", () => {

  // ===================== LOGIN ADMIN =====================
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();
      const restrictedPages = ["dashboard.html", "visitor.html", "warning.html", "user.html", "data.html"];


      // Daftar akun admin (bisa ditambah)
      const adminAccounts = [
        { email: "admin@gmail.com", password: "1234", name: "Administrator" },
        { email: "superadmin@gmail.com", password: "admin123", name: "Super Admin" }
      ];

      const admin = adminAccounts.find(acc => acc.email === email && acc.password === password);
      if (admin) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("adminName", admin.name);
        alert(`Selamat datang, ${admin.name}!`);
        window.location.href = "dashboard.html";
      } else {
        alert("Email atau password salah!");
      }
    });
  }

  // ===================== CEK LOGIN DI HALAMAN LAIN =====================
  const restrictedPages = ["dashboard.html", "visitor.html", "warning.html", "user.html", "data.html"];
  const currentPage = window.location.pathname.split("/").pop();
  if (restrictedPages.includes(currentPage)) {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      alert("Silakan login sebagai admin terlebih dahulu!");
      window.location.href = "index.html";
    }
  }

  // ===================== LOGOUT =====================
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("adminName");
      window.location.href = "index.html";
    });
  }

  // ===================== TAMPILKAN NAMA ADMIN DI NAVBAR =====================
  const navbarTitle = document.querySelector(".navbar h3");
  const adminName = localStorage.getItem("adminName");
  if (navbarTitle && adminName) {
    navbarTitle.textContent = `Smart Gate System - ${adminName}`;
  }

  // ===================== VISITOR TABLE =====================
  const visitorTable = document.getElementById("visitorTable");
  if (visitorTable) {
    let visitors = JSON.parse(localStorage.getItem("visitors")) || [
      { no: 1, photo: "img1.jpg", gate: "A", time: "2025-11-10T09:10", plate: "B 1234 XYZ", face: "Match", status: "Approved" },
      { no: 2, photo: "img2.jpg", gate: "B", time: "2025-11-10T10:20", plate: "D 4321 ABC", face: "Not Match", status: "Warning" }
    ];

    // Fungsi render table
    function renderVisitorTable() {
      visitorTable.innerHTML = "";
      visitors.forEach((v, i) => {
        visitorTable.innerHTML += `
          <tr>
            <td>${i + 1}</td>
            <td>${v.photo ? `<img src="${v.photo}" width="60">` : '-'}</td>
            <td>${v.gate}</td>
            <td>${new Date(v.time).toLocaleString()}</td>
            <td>${v.plate}</td>
            <td>${v.face}</td>
            <td>${v.status}</td>
            <td><button class="deleteBtn" data-index="${i}">Hapus</button></td>
          </tr>
        `;
      });

      // Tombol hapus data
      document.querySelectorAll(".deleteBtn").forEach(btn => {
        btn.addEventListener("click", (e) => {
          const index = e.target.dataset.index;
          visitors.splice(index, 1);
          localStorage.setItem("visitors", JSON.stringify(visitors));
          renderVisitorTable();
        });
      });
    }

    renderVisitorTable();

    // Tambah data visitor (jika form ada)
    const addVisitorForm = document.getElementById("addVisitorForm");
    if (addVisitorForm) {
      addVisitorForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const gate = document.getElementById("gate").value;
        const time = document.getElementById("time").value;
        const plate = document.getElementById("plate").value;
        const face = document.getElementById("face").value;
        const status = document.getElementById("status").value;
        const photo = document.getElementById("photo").value;
        const newVisitor = { no: visitors.length + 1, gate, time, plate, face, status, photo };

        visitors.push(newVisitor);
        localStorage.setItem("visitors", JSON.stringify(visitors));
        addVisitorForm.reset();
        renderVisitorTable();
      });
    }
  }

  // ===================== DASHBOARD CAMERA & STATISTIK =====================
  const cameraFeed = document.getElementById("cameraFeed");
  const connectCameraBtn = document.getElementById("connectCamera");
  const cameraUrlInput = document.getElementById("cameraUrl");

  if (connectCameraBtn) {
    connectCameraBtn.addEventListener("click", () => {
      const url = cameraUrlInput.value.trim();
      if (url) {
        cameraFeed.src = url;
      } else {
        alert("Masukkan URL streaming kamera terlebih dahulu!");
      }
    });
  }
  // ===================== TABLE WARNING DI DASHBOARD =====================
const warningTable = document.getElementById("warningTable");
if (warningTable) {
  const visitors = JSON.parse(localStorage.getItem("visitors")) || [];
  const warnings = visitors.filter(v => v.status === "Warning");

  warningTable.innerHTML = "";
  if (warnings.length === 0) {
    warningTable.innerHTML = `<tr><td colspan="7" style="text-align:center;">Tidak ada data warning</td></tr>`;
  } else {
    warnings.forEach((v, i) => {
      warningTable.innerHTML += `
        <tr>
          <td>${i + 1}</td>
          <td>${v.photo ? `<img src="${v.photo}" width="60">` : '-'}</td>
          <td>${v.gate}</td>
          <td>${new Date(v.time).toLocaleString()}</td>
          <td>${v.plate}</td>
          <td>${v.face}</td>
          <td style="color:red;font-weight:bold;">${v.status}</td>
        </tr>
      `;
    });
  }
}


  // Statistik Dashboard
  const totalVisitor = document.getElementById("totalVisitor");
  const totalWarning = document.getElementById("totalWarning");
  const totalApproved = document.getElementById("totalApproved");

  if (totalVisitor) {
    const visitors = JSON.parse(localStorage.getItem("visitors")) || [];
    totalVisitor.textContent = visitors.length;
    totalWarning.textContent = visitors.filter(v => v.status === "Warning").length;
    totalApproved.textContent = visitors.filter(v => v.status === "Approved").length;
  }

  // ===================== HALAMAN DATA (REKAP SEMUA) =====================
  const dataTable = document.getElementById("dataTable");
  const totalData = document.getElementById("totalData");
  const dataApproved = document.getElementById("dataApproved");
  const dataWarning = document.getElementById("dataWarning");

  if (dataTable) {
    const visitors = JSON.parse(localStorage.getItem("visitors")) || [];

    dataTable.innerHTML = "";
    visitors.forEach((v, i) => {
      dataTable.innerHTML += `
        <tr>
          <td>${i + 1}</td>
          <td>${v.photo ? `<img src="${v.photo}" width="60">` : '-'}</td>
          <td>${v.gate}</td>
          <td>${new Date(v.time).toLocaleString()}</td>
          <td>${v.plate}</td>
          <td>${v.face}</td>
          <td>${v.status}</td>
        </tr>
      `;
    });

    totalData.textContent = visitors.length;
    dataApproved.textContent = visitors.filter(v => v.status === "Approved").length;
    dataWarning.textContent = visitors.filter(v => v.status === "Warning").length;
  }

});
// ===================== DATA PAGE (REKAP SEMUA) =====================
document.addEventListener("DOMContentLoaded", () => {
  const dataTable = document.getElementById("dataTable");
  const totalData = document.getElementById("totalData");
  const dataApproved = document.getElementById("dataApproved");
  const dataWarning = document.getElementById("dataWarning");

  // Jika sedang di halaman data.html
  if (dataTable) {
    // Ambil data visitor dari localStorage (jika ada)
    let visitors = JSON.parse(localStorage.getItem("visitors")) || [];

    // Jika belum ada data, isi dengan contoh default
    if (visitors.length === 0) {
      visitors = [
        {
          no: 1,
          photo: "https://placehold.co/60x60?text=V1",
          gate: "A",
          time: "2025-11-10T09:10",
          plate: "B 1234 XYZ",
          face: "Match",
          status: "Approved"
        },
        {
          no: 2,
          photo: "https://placehold.co/60x60?text=V2",
          gate: "B",
          time: "2025-11-10T10:25",
          plate: "D 4321 ABC",
          face: "Not Match",
          status: "Warning"
        },
        {
          no: 3,
          photo: "https://placehold.co/60x60?text=V3",
          gate: "C",
          time: "2025-11-10T11:15",
          plate: "F 9876 KLM",
          face: "Match",
          status: "Approved"
        }
      ];
      localStorage.setItem("visitors", JSON.stringify(visitors));
    }

    // Render tabel
    dataTable.innerHTML = "";
    visitors.forEach((v, i) => {
      dataTable.innerHTML += `
        <tr>
          <td>${i + 1}</td>
          <td><img src="${v.photo}" width="60" style="border-radius:8px"></td>
          <td>${v.gate}</td>
          <td>${new Date(v.time).toLocaleString()}</td>
          <td>${v.plate}</td>
          <td>${v.face}</td>
          <td style="color:${v.status === "Warning" ? "#f87171" : "#4ade80"};font-weight:bold;">${v.status}</td>
        </tr>
      `;
    });

    // Update card statistik
    totalData.textContent = visitors.length;
    dataApproved.textContent = visitors.filter(v => v.status === "Approved").length;
    dataWarning.textContent = visitors.filter(v => v.status === "Warning").length;
  }
});
// ===================== FULL CAMERA PAGE =====================
document.addEventListener("DOMContentLoaded", () => {
  const cameraFeed = document.getElementById("cameraFeed");
  const connectCameraBtn = document.getElementById("connectCamera");
  const cameraUrlInput = document.getElementById("cameraUrl");

  if (connectCameraBtn) {
    connectCameraBtn.addEventListener("click", () => {
      const url = cameraUrlInput.value.trim();
      if (url) {
        cameraFeed.src = url;
      } else {
        alert("Masukkan URL streaming kamera terlebih dahulu!");
      }
    });
  }
});async function loadVisitors() {
  const res = await fetch("http://localhost/smartgate_api/getVisitors.php");
  const visitors = await res.json();

  // Hitung jumlah Approved & Warning
  const totalApproved = visitors.filter(v => v.status === "Approved").length;
  const totalWarning = visitors.filter(v => v.status === "Warning").length;

  // Tampilkan data di tabel (seperti biasa)
  const visitorTable = document.getElementById("visitorTable");
  visitorTable.innerHTML = "";
  visitors.forEach((v, i) => {
    visitorTable.innerHTML += `
      <tr>
        <td>${i + 1}</td>
        <td>${v.plate}</td>
        <td>${v.face}</td>
        <td>${v.status}</td>
        <td>${v.time}</td>
      </tr>`;
  });

  // Statistik text di card
  document.getElementById("totalVisitor").textContent = visitors.length;
  document.getElementById("totalApproved").textContent = totalApproved;
  document.getElementById("totalWarning").textContent = totalWarning;

  // === GRAFIK (Chart.js) ===
  const ctx = document.getElementById("visitorChart").getContext("2d");
  const visitorChart = new Chart(ctx, {
    type: "doughnut", // bisa juga "bar", "pie", "line"
    data: {
      labels: ["Approved", "Warning"],
      datasets: [{
        label: "Status Pengunjung",
        data: [totalApproved, totalWarning],
        backgroundColor: ["#4ade80", "#f87171"],
        borderWidth: 0
      }]
    },
    options: {
      plugins: {
        legend: { labels: { color: "#fff" } },
      },
    }
  });
}

document.addEventListener("DOMContentLoaded", loadVisitors);
const byDate = {};
visitors.forEach(v => {
  const date = v.time.split(" ")[0];
  byDate[date] = (byDate[date] || 0) + 1;
});

const labels = Object.keys(byDate);
const counts = Object.values(byDate);

new Chart(ctx, {
  type: "bar",
  data: {
    labels,
    datasets: [{
      label: "Jumlah Pengunjung per Hari",
      data: counts,
      backgroundColor: "#3b82f6"
    }]
  },
  options: { scales: { x: { ticks: { color: "#fff" } }, y: { ticks: { color: "#fff" } } } }
});


