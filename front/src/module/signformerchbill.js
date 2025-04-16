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
 * @return {ESignformerchbill}
 */

export const SignformerchbillCreateForm = () => {
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
 * @return {Promise<ESignformerchbillForm>}
 */
export const canSignformerchbillCreateForm = () => {
    return new Promise(async (resolve, reject) => {
        var form = SignformerchbillCreateForm();
        resolve({ form });
    });
};

/**
 * 响应式获取订单签收商品信息 模块的表单字段数据
 * @return {ESignformerchbillForm}
 */
export const useSignformerchbillCreateForm = () => {
    const form = SignformerchbillCreateForm();
    const formReactive = reactive(form);

    return { form: formReactive };
};

export const canSignformerchbillSelect = (filter, result) => {
    http.post("/api/signformerchbill/selectPages").then((res) => {
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
export const useSignformerchbillSelect = (filter) => {
    const result = reactive({
        lists: [],
        total: {},
    });
    canSignformerchbillSelect(filter, result);
    return result;
};

/**
 * 根据
 * @param id
 * @return {Promise<ESignformerchbill>}
 */
export const canSignformerchbillFindById = (id) => {
    return new Promise((resolve, reject) => {
        // 读取后台数据
        http.get("/api/signformerchbill/findById", { id }).then((res) => {
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
 * @return {ESignformerchbill}
 */
export const useSignformerchbillFindById = (id) => {
    var form = reactive({});

    canSignformerchbillFindById(id).then((res) => {
        extend(form, res);
    });
    return form;
};

/**
 * 根据数据,插入到数据库中
 * @param {ESignformerchbill} data
 * @return {Promise<EResponseData<ESignformerchbill>>}
 */
export const canSignformerchbillInsert = (data) => {
    return new Promise((resolve, reject) => {
        http.post("/api/signformerchbill/insert", data)
            .json()
            .then(
                (res) => {
                    resolve(res);
                    if (res.code == 0) {
                        event.emit("signformerchbill_insert", res.data);
                        event.emit("signformerchbill_change", res.data);
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
 * @param {ESignformerchbill} data
 * @return {Promise<EResponseData<ESignformerchbill>>}
 */
export const canSignformerchbillUpdate = (data) => {
    return new Promise((resolve, reject) => {
        http.post("/api/signformerchbill/update", data)
            .json()
            .then(
                (res) => {
                    resolve(res);
                    if (res.code == 0) {
                        event.emit("signformerchbill_update", res.data);
                        event.emit("signformerchbill_change", res.data);
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
export const canSignformerchbillDelete = (id) => {
    var res = [];
    if (!isArray(id)) {
        res.push(id);
    } else {
        res = id;
    }

    return new Promise((resolve, reject) => {
        http.post("/api/signformerchbill/delete", res)
            .json()
            .then(
                (res) => {
                    resolve(res);
                    if (res.code == 0) {
                        event.emit("signformerchbill_delete", res.data);
                        event.emit("signformerchbill_change", res.data);
                    }
                },
                (err) => {
                    reject(err);
                }
            );
    });
};
