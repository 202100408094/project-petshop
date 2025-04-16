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
 * @return {EProgressmerchbill}
 */

export const ProgressmerchbillCreateForm = () => {
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
 * @return {Promise<EProgressmerchbillForm>}
 */
export const canProgressmerchbillCreateForm = () => {
    return new Promise(async (resolve, reject) => {
        var form = ProgressmerchbillCreateForm();
        resolve({ form });
    });
};

/**
 * 响应式获取订单商品信息 模块的表单字段数据
 * @return {EProgressmerchbillForm}
 */
export const useProgressmerchbillCreateForm = () => {
    const form = ProgressmerchbillCreateForm();
    const formReactive = reactive(form);

    return { form: formReactive };
};

export const canProgressmerchbillSelect = (filter, result) => {
    http.post("/api/progressmerchbill/selectPages").then((res) => {
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
export const useProgressmerchbillSelect = (filter) => {
    const result = reactive({
        lists: [],
        total: {},
    });
    canProgressmerchbillSelect(filter, result);
    return result;
};

/**
 * 根据
 * @param id
 * @return {Promise<EProgressmerchbill>}
 */
export const canProgressmerchbillFindById = (id) => {
    return new Promise((resolve, reject) => {
        // 读取后台数据
        http.get("/api/progressmerchbill/findById", { id }).then((res) => {
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
 * @return {EProgressmerchbill}
 */
export const useProgressmerchbillFindById = (id) => {
    var form = reactive({});

    canProgressmerchbillFindById(id).then((res) => {
        extend(form, res);
    });
    return form;
};

/**
 * 根据数据,插入到数据库中
 * @param {EProgressmerchbill} data
 * @return {Promise<EResponseData<EProgressmerchbill>>}
 */
export const canProgressmerchbillInsert = (data) => {
    return new Promise((resolve, reject) => {
        http.post("/api/progressmerchbill/insert", data)
            .json()
            .then(
                (res) => {
                    resolve(res);
                    if (res.code == 0) {
                        event.emit("progressmerchbill_insert", res.data);
                        event.emit("progressmerchbill_change", res.data);
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
 * @param {EProgressmerchbill} data
 * @return {Promise<EResponseData<EProgressmerchbill>>}
 */
export const canProgressmerchbillUpdate = (data) => {
    return new Promise((resolve, reject) => {
        http.post("/api/progressmerchbill/update", data)
            .json()
            .then(
                (res) => {
                    resolve(res);
                    if (res.code == 0) {
                        event.emit("progressmerchbill_update", res.data);
                        event.emit("progressmerchbill_change", res.data);
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
export const canProgressmerchbillDelete = (id) => {
    var res = [];
    if (!isArray(id)) {
        res.push(id);
    } else {
        res = id;
    }

    return new Promise((resolve, reject) => {
        http.post("/api/progressmerchbill/delete", res)
            .json()
            .then(
                (res) => {
                    resolve(res);
                    if (res.code == 0) {
                        event.emit("progressmerchbill_delete", res.data);
                        event.emit("progressmerchbill_change", res.data);
                    }
                },
                (err) => {
                    reject(err);
                }
            );
    });
};
