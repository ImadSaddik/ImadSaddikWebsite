import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios";

axios.defaults.baseURL = "/";

const app = createApp(App);

app.use(router, axios);
app.mount("#app");
