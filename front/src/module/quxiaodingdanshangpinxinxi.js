import http from "@/utils/ajax/http";
import { useRoute } from "vue-router";
import { useUserStore } from "@/stores";
import { reactive, ref, unref } from "vue";
import rule from "@/utils/rule";
import { extend, isArray } from "@/utils/extend";
import { ElMessageBox } from "element-plus";
import router from "@/router";
import event from "@/utils/event";

/**
 * 响应式的对象数据
 * @return {EQuxiaodingdanshangpinxinxi}
 */

export const QuxiaodingdanshangpinxinxiCreateForm = () => {
    var route = unref(router.currentRoute);
    const userStore = useUserStore();
    const $session = userStore.session;
    if (!route.query) {
        route = useRoute();
    }
    const form = {
        numbers: "",
        names: "",
        ification: "",
        picture: "",
        price: "",
        quantity: "",
        userss: $session.username,
    };

    return form;
};

/**
 * 异步模式获取数据
 * @param id
 * @param readMap
 * @return {Promise<EQuxiaodingdanshangpinxinxiForm>}
 */
export const canQuxiaodingdanshangpinxinxiCreateForm = () => {
    return new Promise(async (resolve, reject) => {
        var form = QuxiaodingdanshangpinxinxiCreateForm();
        resolve({ form });
    });
};

/**
 * 响应式获取取消订单商品信息 模块的表单字段数据
 * @return {EQuxiaodingdanshangpinxinxiForm}
 */
export const useQuxiaodingdanshangpinxinxiCreateForm = () => {
    const form = QuxiaodingdanshangpinxinxiCreateForm();
    const formReactive = reactive(form);

    return { form: formReactive };
};

export const canQuxiaodingdanshangpinxinxiSelect = (filter, result) => {
    http.post("/api/quxiaodingdanshangpinxinxi/selectPages").then((res) => {
        if (res.code == 0) {
            extend(result, res.data);
        } else {
            ElMessageBox.alert(res.msg);
        }
    });
};

/**
 * 获取分页数据
 * @param filter
 */
export const useQuxiaodingdanshangpinxinxiSelect = (filter) => {
    const result = reactive({
        lists: [],
        total: {},
    });
    canQuxiaodingdanshangpinxinxiSelect(filter, result);
    return result;
};

/**
 * 根据
 * @param id
 * @return {Promise<EQuxiaodingdanshangpinxinxi>}
 */
export const canQuxiaodingdanshangpinxinxiFindById = (id) => {
    return new Promise((resolve, reject) => {
        // 读取后台数据
        http.get("/api/quxiaodingdanshangpinxinxi/findById", { id }).then((res) => {
            if (res.code == 0) {
                resolve(res.data);
            } else {
                reject(new Error(res.msg));
            }
        }, reject);
    });
};

/**
 * 根据id 获取一行数据
 * @param id
 * @return {EQuxiaodingdanshangpinxinxi}
 */
export const useQuxiaodingdanshangpinxinxiFindById = (id) => {
    var form = reactive({});

    canQuxiaodingdanshangpinxinxiFindById(id).then((res) => {
        extend(form, res);
    });
    return form;
};

/**
 * 根据数据,插入到数据库中
 * @param {EQuxiaodingdanshangpinxinxi} data
 * @return {Promise<EResponseData<EQuxiaodingdanshangpinxinxi>>}
 */
export const canQuxiaodingdanshangpinxinxiInsert = (data) => {
    return new Promise((resolve, reject) => {
        http.post("/api/quxiaodingdanshangpinxinxi/insert", data)
            .json()
            .then(
                (res) => {
                    resolve(res);
                    if (res.code == 0) {
                        event.emit("quxiaodingdanshangpinxinxi_insert", res.data);
                        event.emit("quxiaodingdanshangpinxinxi_change", res.data);
                    }
                },
                (err) => {
                    reject(err);
                }
            );
    });
};

/**
 * 根据数据更新数据库
 * @param {EQuxiaodingdanshangpinxinxi} data
 * @return {Promise<EResponseData<EQuxiaodingdanshangpinxinxi>>}
 */
export const canQuxiaodingdanshangpinxinxiUpdate = (data) => {
    return new Promise((resolve, reject) => {
        http.post("/api/quxiaodingdanshangpinxinxi/update", data)
            .json()
            .then(
                (res) => {
                    resolve(res);
                    if (res.code == 0) {
                        event.emit("quxiaodingdanshangpinxinxi_update", res.data);
                        event.emit("quxiaodingdanshangpinxinxi_change", res.data);
                    }
                },
                (err) => {
                    reject(err);
                }
            );
    });
};

/**
 * 根据id 或者列表id
 * @param {number|number[]} id
 * @return {Promise<EResponseData<string>>}
 */
export const canQuxiaodingdanshangpinxinxiDelete = (id) => {
    var res = [];
    if (!isArray(id)) {
        res.push(id);
    } else {
        res = id;
    }

    return new Promise((resolve, reject) => {
        http.post("/api/quxiaodingdanshangpinxinxi/delete", res)
            .json()
            .then(
                (res) => {
                    resolve(res);
                    if (res.code == 0) {
                        event.emit("quxiaodingdanshangpinxinxi_delete", res.data);
                        event.emit("quxiaodingdanshangpinxinxi_change", res.data);
                    }
                },
                (err) => {
                    reject(err);
                }
            );
    });
};
