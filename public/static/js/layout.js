/* Alur 2: kerangka aplikasi & menu per role */

// Ikon garis sederhana (SVG inline) untuk menu samping
const IKON = {
    dashboard: '<path d="M3 13h8V3H3zM13 21h8V11h-8zM3 21h8v-6H3zM13 3v6h8V3z"/>',
    items: '<path d="M21 8l-9-5-9 5 9 5 9-5z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/>',
    stockcard: '<path d="M4 4h16v16H4z"/><path d="M8 9h8M8 13h8M8 17h5"/>',
    categories: '<path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z"/>',
    warehouses: '<path d="M3 21V9l9-6 9 6v12"/><path d="M7 21v-8h10v8"/><path d="M7 17h10"/>',
    suppliers: '<path d="M1 7h13v10H1z"/><path d="M14 11h4l3 3v3h-7"/><circle cx="5.5" cy="18.5" r="1.8"/><circle cx="17.5" cy="18.5" r="1.8"/>',
    requests: '<path d="M14 3H6v18h12V7z"/><path d="M14 3v4h4"/><path d="M9 13h6M12 10v6"/>',
    pos: '<path d="M6 6h15l-2 9H8z"/><path d="M6 6L5 3H2"/><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/>',
    opnames: '<path d="M9 11l3 3 8-8"/><path d="M20 12v8H4V4h11"/>',
    reports: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    audit: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2 20c0-3.5 3-6 7-6s7 2.5 7 6"/><path d="M16 4.5a3.5 3.5 0 010 7M22 20c0-2.6-1.6-4.7-4-5.6"/>'
};
function ikon(nama) {
    return `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${IKON[nama] || ""}</svg>`;
}
const LOGO = '<span class="logo-mark"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8l-9-5-9 5 9 5 9-5z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/></svg></span>';

function inisial(nama) {
    return String(nama || "?").trim().split(/\s+/).slice(0, 2).map(k => k[0]).join("").toUpperCase();
}

function daftarMenu() {
    const AM = ["admin", "manager"], AS = ["admin", "staff"], MS = ["manager", "staff"];
    return [
        { id: "dashboard", value: "Dashboard", roles: ["admin"], bangun: halamanDashboard },
        { id: "items", value: "Barang dan Stok", roles: AS, bangun: halamanBarang },
        { id: "stockcard", value: "Kartu Stok", roles: AS, bangun: halamanKartuStok },
        { id: "categories", value: "Kategori", roles: ["admin"], bangun: halamanKategori },
        { id: "warehouses", value: "Warehouse", roles: ["admin"], bangun: halamanWarehouse },
        { id: "suppliers", value: "Data Supplier", roles: ["admin"], bangun: halamanSupplier },
        { id: "requests", value: "Request Barang", roles: MS, bangun: halamanRequest },
        { id: "pos", value: "Purchase Order dan Barang Masuk", roles: MS, bangun: halamanPO },
        { id: "opnames", value: "Stock Opname", roles: MS, bangun: halamanOpname },
        { id: "reports", value: "Monitoring dan Laporan", roles: AM, bangun: halamanLaporan },
        { id: "audit", value: "Audit Log", roles: AM, bangun: halamanAudit },
        { id: "users", value: "Pengguna", roles: ["admin"], bangun: halamanPengguna }
    ];
}

// Animasi halus saat berpindah halaman (hanya kelas CSS, tidak mengubah alur)
function animasiHalaman(id) {
    const el = $$(id) && $$(id).$view;
    if (!el) return;
    el.classList.remove("page-in");
    void el.offsetWidth;
    el.classList.add("page-in");
}

function mulaiAplikasi(user) {
    if (user.role === "supplier") { window.location.href = "/portal"; return; }   // akun supplier memakai portal sendiri
    userAktif = user;
    hancurkanRoot();
    const menu = daftarMenu().filter(m => !m.roles || m.roles.includes(user.role));
    webix.ui({
        id: "root", css: "app-root",
        rows: [
            {
                view: "toolbar", css: "app-header", height: 60, paddingX: 20, elements: [
                    { view: "template", css: "brand", borderless: true, width: 240, template: `${LOGO}<span class="brand-text">Blue <b>Warehouse</b></span>` },
                    {},
                    {
                        view: "template", css: "user-chip", borderless: true, width: 280,
                        template: `<div class="avatar">${esc(inisial(user.full_name))}</div><div class="who"><div class="nm">${esc(user.full_name)}</div><div class="rl">${LABEL_ROLE[user.role]}</div></div>`
                    },
                    { view: "button", value: "Logout", width: 90, height: 36, css: "btn-ghost", click: prosesLogout }
                ]
            },
            {
                cols: [
                    {
                        view: "list", id: "menu", css: "app-sidebar", width: 250, select: true, scroll: "auto", type: { height: 44 },
                        template: o => `${ikon(o.id)}<span class="mtext">${o.value}</span>`,
                        data: menu.map(m => ({ id: m.id, value: m.value })),
                        on: { onAfterSelect(id) { $$("halaman").setValue(id); animasiHalaman(id); HALAMAN[id].muat(); } }
                    },
                    {
                        css: "app-content", padding: 18,
                        rows: [{ view: "multiview", id: "halaman", css: "app-page", animate: false, cells: menu.map(m => { const h = m.bangun(); HALAMAN[m.id] = h; return h.ui; }) }]
                    }
                ]
            }
        ]
    });
    $$("menu").select(menu[0].id);   // halaman pertama sesuai role
}
