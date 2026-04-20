const { createApp, ref, computed } = Vue;

const getItemValue = (url, key) => {
    const getItemFromFragmentIdentifier = (url, key) => {
        if (url && url.hash) {
            const hash = url.hash.substr(1);
            const params = new URLSearchParams(hash);
            return params.get(key);
        }
        return null;
    };
    return (
        url.searchParams.get(key) ||
        getItemFromFragmentIdentifier(url, key) ||
        localStorage.getItem(key)
    );
};

const encodeHTMLToBase64 = (html) => {
    const script =
        '<script>document.querySelectorAll("a").forEach(link => link.setAttribute("target", "_blank"))<\/script>';
    const index = html.indexOf("</html>");
    if (index >= 0) {
        html = html.slice(0, index) + script + html.slice(index);
    } else {
        html += script;
    }
    return `data:text/html;charset=utf-8,${encodeURIComponent(html)}`;
};

const html2Text = (html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    div.querySelectorAll("head, style, script").forEach((el) => el.remove());
    div.querySelectorAll("br").forEach((br) => br.replaceWith("\n"));
    div.querySelectorAll("a").forEach((a) => {
        const href = a.getAttribute("href");
        const text = a.textContent;
        a.replaceWith(`${text}[${href}]`);
    });
    return div.textContent;
};

const isMobile = () => window.innerWidth <= 768;

const app = createApp({
    setup() {
        const url = new URL(document.location.href);
        const namespace = ref(getItemValue(url, "namespace"));
        const apikey = ref(getItemValue(url, "apikey"));
        const items = ref([]);
        const current = ref(null);
        const showAlert = ref(true);
        const showHTML = ref(false);
        const showContent = ref(false);
        const offset = ref(0);
        const loading = ref(false);
        const mobileMode = ref(isMobile());

        window.addEventListener("resize", () => {
            mobileMode.value = isMobile();
        });

        const encodedHTML = computed(() => {
            return encodeHTMLToBase64(current.value?.html || "");
        });

        const selectItem = (item) => {
            showHTML.value = false;
            showAlert.value = true;
            if (!item.text && item.html) {
                item.text = html2Text(item.html);
            }
            current.value = item;
            if (mobileMode.value) {
                showContent.value = true;
            }
        };

        const goBack = () => {
            showContent.value = false;
        };

        const loadData = (_offset) => {
            if (!namespace.value || !apikey.value) {
                ElementPlus.ElMessage.warning("请输入命名空间和 API 密钥");
                return;
            }

            loading.value = true;
            localStorage.setItem("namespace", namespace.value);
            localStorage.setItem("apikey", apikey.value);

            fetch("/api/emails", {
                method: "POST",
                body: btoa(
                    JSON.stringify({
                        apikey: apikey.value,
                        namespace: namespace.value,
                        limit: 10,
                        offset: _offset,
                    })
                ),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.error) {
                        ElementPlus.ElMessage.error(`请求失败：${data.error}`);
                        return;
                    }
                    if (_offset) {
                        items.value = items.value.concat(data.emails);
                    } else {
                        items.value = data.emails;
                        if (data.emails.length > 0 && !mobileMode.value) {
                            selectItem(items.value[0]);
                        } else {
                            current.value = null;
                            showContent.value = false;
                        }
                    }
                    offset.value = data.offset + data.limit;
                })
                .catch((err) => {
                    ElementPlus.ElMessage.error(`请求异常：${err.message}`);
                })
                .finally(() => {
                    loading.value = false;
                });
        };

        const fileSizeToString = (size) => {
            if (size < 1000) return `${size} B`;
            if (size < 1e6) return `${(size / 1e3).toFixed(1)} KB`;
            if (size < 1e9) return `${(size / 1e6).toFixed(1)} MB`;
            return `${(size / 1e9).toFixed(1)} GB`;
        };

        if (apikey.value && namespace.value) {
            loadData(0);
        }

        return {
            namespace, apikey, items, offset, current,
            showAlert, showHTML, showContent, encodedHTML,
            loading, mobileMode,
            loadData, selectItem, goBack, fileSizeToString, isMobile
        };
    },
});

app.use(ElementPlus);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}
app.mount("#app");
