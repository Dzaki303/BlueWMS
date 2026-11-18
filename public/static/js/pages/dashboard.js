/* Halaman: Dashboard */

function halamanDashboard() {
    function kartu(d) {
        const s = d.stats || {};
        const k = (v, l, nama, css) => `<div class="card ${css || ""}"><div class="card-ico">${ikon(nama)}</div>
            <div><div class="v">${v == null ? "-" : webix.i18n.numberFormat(v).replace(/[.,]00$/, "")}</div><div class="l">${l}</div></div></div>`;
        return `<div class="cards">
            ${k(s.items, "Jenis barang", "items")}
            ${k(s.total_stock, "Total unit stok", "categories", "ok")}
            ${k(s.low_stock, "Barang stok menipis", "reports", "bad")}
            ${k(s.pending_requests, "Request menunggu approval", "requests", "warn")}
            ${k(s.ready_requests, "Request siap diserahkan / backorder", "pos", "warn")}
            ${k(s.pending_opnames, "Adjustment opname menunggu approval", "opnames", "warn")}</div>`;
    }
    const muat = () => panggilApi("GET", "/api/dashboard").then(d => {
        $$("kartu_dashboard").setValues(d);
        isiGrid("grid_stok_menipis", d.low_items);
    });
    return {
        muat: muat,
        ui: {
            id: "dashboard", rows: [
                judul("Dashboard - " + LABEL_ROLE[userAktif.role]),
                { view: "template", id: "kartu_dashboard", css: "dash-cards", height: 230, borderless: true, scroll: false, template: kartu, data: {} },
                { view: "template", css: "section-title", height: 40, borderless: true, template: "<h3>Barang di bawah stok minimum</h3>" },
                buatGrid("grid_stok_menipis", [
                    { id: "code", header: "Kode", width: 100 }, { id: "name", header: "Barang", fillspace: true },
                    { id: "stock", header: "Stok", width: 80, css: "low" }, { id: "min_stock", header: "Min", width: 70 }, { id: "unit", header: "Satuan", width: 90 }
                ])
            ]
        }
    };
}
