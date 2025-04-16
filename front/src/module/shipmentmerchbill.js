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
 * @return {EShipmentmerchbill}
 */

export const ShipmentmerchbillCreateForm = () => {
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
 * @return {Promise<EShipmentmerchbillForm>}
 */
export const canShipmentmerchbillCreateForm = () => {
    return new Promise(async (resolve, reject) => {
        var form = ShipmentmerchbillCreateForm();
        resolve({ form });
    });
};

/**
 * 响应式获取订单发货商品信息 模块的表单字段数据
 * @return {EShipmentmerchbillForm}
 */
export const useShipmentmerchbillCreateForm = () => {
    const form = ShipmentmerchbillCreateForm();
    const formReactive = reactive(form);

    return { form: formReactive };
};

export const canShipmentmerchbillSelect = (filter, result) => {
    http.post("/api/shipmentmerchbill/selectPages").then((res) => {
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
export const useShipmentmerchbillSelect = (filter) => {
    const result = reactive({
        lists: [],
        total: {},
    });
    canShipmentmerchbillSelect(filter, result);
    return result;
};

/**
 * 根据
 * @param id
 * @return {Promise<EShipmentmerchbill>}
 */
export const canShipmentmerchbillFindById = (id) => {
    return new Promise((resolve, reject) => {
        // 读取后台数据
        http.get("/api/shipmentmerchbill/findById", { id }).then((res) => {
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
 * @return {EShipmentmerchbill}
 */
export const useShipmentmerchbillFindById = (id) => {
    var form = reactive({});

    canShipmentmerchbillFindById(id).then((res) => {
        extend(form, res);
    });
    return form;
};

/**
 * 根据数据,插入到数据库中
 * @param {EShipmentmerchbill} data
 * @return {Promise<EResponseData<EShipmentmerchbill>>}
 */
export const canShipmentmerchbillInsert = (data) => {
    return new Promise((resolve, reject) => {
        http.post("/api/shipmentmerchbill/insert", data)
            .json()
            .then(
                (res) => {
                    resolve(res);
                    if (res.code == 0) {
                        event.emit("shipmentmerchbill_insert", res.data);
                        event.emit("shipmentmerchbill_change", res.data);
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
 * @param {EShipmentmerchbill} data
 * @return {Promise<EResponseData<EShipmentmerchbill>>}
 */
export const canShipmentmerchbillUpdate = (data) => {
    return new Promise((resolve, reject) => {
        http.post("/api/shipmentmerchbill/update", data)
            .json()
            .then(
                (res) => {
                    resolve(res);
                    if (res.code == 0) {
                        event.emit("shipmentmerchbill_update", res.data);
                        event.emit("shipmentmerchbill_change", res.data);
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
export const canShipmentmerchbillDelete = (id) => {
    var res = [];
    if (!isArray(id)) {
        res.push(id);
    } else {
        res = id;
    }

    return new Promise((resolve, reject) => {
        http.post("/api/shipmentmerchbill/delete", res)
            .json()
            .then(
                (res) => {
                    resolve(res);
                    if (res.code == 0) {
                        event.emit("shipmentmerchbill_delete", res.data);
                        event.emit("shipmentmerchbill_change", res.data);
                    }
                },
                (err) => {
                    reject(err);
                }
            );
    });
};
