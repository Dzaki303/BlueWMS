/* Alur 1: login & logout */

const formLogin = {
    view: "form", id: "formLogin", width: 400, borderless: true, css: "login-card", padding: 32, margin: 14,
    elementsConfig: { labelPosition: "top" },
    elements: [
        {
            view: "template", borderless: true, height: 118, css: "login-brand",
            template: () => `${LOGO}<h1>WMS Warehouse</h1><p>Masuk untuk mengelola stok gudang</p>`
        },
        { view: "text", name: "username", label: "Username", placeholder: "Masukkan username", required: true, height: 68 },
        { view: "text", name: "password", label: "Password", type: "password", placeholder: "Masukkan password", required: true, height: 68 },
        { view: "button", value: "Masuk", css: "webix_primary btn-login", height: 44, hotkey: "enter", click: prosesLogin }
    ]
};

function hancurkanRoot() {
    ["win_detail"].forEach(id => { if ($$(id)) $$(id).close(); });
    if ($$("root")) $$("root").destructor();
}

function tampilkanLogin() {
    hancurkanRoot();
    webix.ui({ id: "root", css: "login-bg", rows: [{}, { cols: [{}, formLogin, {}] }, {}] });
}

function prosesLogin() {
    const f = $$("formLogin");
    if (!f.validate()) { webix.message({ type: "error", text: "Username dan password wajib diisi" }); return; }
    panggilApi("POST", "/api/auth/login", f.getValues()).then(res => mulaiAplikasi(res.user));
}

function prosesLogout() {
    panggilApi("POST", "/api/auth/logout", {}).then(() => { userAktif = null; tampilkanLogin(); });
}
