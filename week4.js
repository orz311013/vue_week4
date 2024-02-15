import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.4.14/vue.esm-browser.min.js';

const apiUrl = 'https://vue3-course-api.hexschool.io/v2';
const apiPath = 'orzorzorz';
import pagination from './pagination.js';
import ProductModal from './ProductModal.js';
import DeleteModal from './DeleteModal.js';

const app = createApp({
    data() {
        return {
            products: [],
            tempProduct: {
                imageUrl: [], //多圖
            },
            pages: {},
            isNew: false, //判斷是否為新增(編輯)產品，決定要呼叫的api
            modalProduct: null, //productModal所使用
            modalDel: null, //delModal所使用
            //modal定義 空字串或null 無差異 JS為動態型別
        };
    },
    methods: {
        getProducts(page = 1) {
            //參數預設值
            const api = `${apiUrl}/api/${apiPath}/admin/products?page=${page}`; //有分頁
            //?page=1 (query string)/第一頁
            //?page=2 (query string)/第二頁

            axios.get(api).then((res) => {
                console.log(res);
                this.products = res.data.products;
                this.pages = res.data.pagination; //將分頁存起來
            });
        },
        openModal(status, product) {
            if (status === 'new') {
                this.tempProduct = {
                    imageUrl: [], //確保初始狀態
                };
                this.isNew = true; //是否為新的
                this.$refs.pModal.openModal();
                // this.modalProduct.show();
            } else if (status === 'edit') {
                //將product 帶入
                this.tempProduct = { ...product };
                this.isNew = false; //是否為新的
                if (!Array.isArray(this.tempProduct.imagesUrl)) {
                    this.tempProduct.imagesUrl = [];
                }
                this.$refs.pModal.openModal();
                // this.modalProduct.show();
            } else if ((status = 'delete')) {
                this.tempProduct = { ...product };
                this.$refs.delModal.showModal();
                // this.modalDel.show();
            }
        },
        updateProduct() {
            //新增
            let api = `${apiUrl}/api/${apiPath}/admin/product`;

            let method = 'post';
            //更新
            if (!this.isNew) {
                api = `${apiUrl}/api/${apiPath}/admin/product/${this.tempProduct.id}`;
                method = 'put'; //更換put  axios['put']
            }

            axios[method](api, { data: this.tempProduct }).then((res) => {
                this.getProducts();
                // this.modalProduct.hide();
                this.$refs.pModal.closeModal();
                this.tempProduct = {};
            });
        },
        delProduct() {
            const api = `${apiUrl}/api/${apiPath}/admin/product/${this.tempProduct.id}`;
            axios
                .delete(api)
                .then((res) => {
                    this.$refs.delModal.hideModal();
                    this.getProducts();
                    //   this.modalDel.hide();
                })
                .catch((err) => {
                    alert(err.data.message);
                });
        },
        createImages() {
            this.tempProduct.imagesUrl = [];
            this.tempProduct.imagesUrl.push('');
        },
    },
    mounted() {
        // 取得 Token
        const token = document.cookie.replace(
            /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
            '$1'
        );
        axios.defaults.headers.common.Authorization = token;
        // 將token內容加到 headers裡
        // https://github.com/axios/axios?tab=readme-ov-file#-axiosheaders
        this.getProducts();
        // this.modalProduct = new bootstrap.Modal(this.$refs.productModal);
        //bs文件中js打開modal
        // const myModalAlternative = new bootstrap.Modal('#myModal', options)
        // this.modalDel = new bootstrap.Modal(this.$refs.delProductModal);
    },
    //區域註冊
    components: {
        pagination,
        ProductModal,
        DeleteModal,
    },
});

app.mount('#app');
