
import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.4.14/vue.esm-browser.min.js';

createApp({
    data() {
        return {
            user: {
                // v-model綁定
                username: '', //API資料格式:屬性
                password: '',
            },
        };
    },
    methods: {
        login() {
            const apiUrl =
                'https://vue3-course-api.hexschool.io/v2/admin/signin';
            axios
                .post(apiUrl, this.user)
                //post帶上this.user資料(帳號密碼)
                //成功登入
                .then((res) => {
                    const { token, expired } = res.data;
                    //解構token,expired   token登入憑證  expired時間戳記

                    document.cookie = `hexToken=${token}; expires=${new Date(
                        expired
                    )}; path=/`;
                    // https://developer.mozilla.org/zh-CN/docs/Web/API/Document/cookie
                    //token、expired 存入到cookie
                    //token 每次登入都會不同
                    window.location = 'week4.html';
                    //成功後 跳轉到index.html
                })
                .catch((err) => {
                    //失敗
                    alert(err.response.data.message); //alert跳出失敗訊息
                });
        },
    },
}).mount('#app');
