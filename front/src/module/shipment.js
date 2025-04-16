import http from "@/utils/ajax/http";
import { useRoute } from "vue-router";
import { useUserStore } from "@/stores";
import { reactive, ref, unref } from "vue";
import rule from "@/utils/rule";
import { extend, isArray } from "@/utils/extend";
import { ElMessageBox } from "element-plus";
import router from "@/router";
import event from "@/utils/event";

import { canProgressFindById } from "./progress";

/**
 * 响应式的对象数据
 * @return {EShipment}
 */

export const ShipmentCreateForm = () => {
    var route = unref(router.currentRoute);
    const userStore = useUserStore();
    const $session = userStore.session;
    if (!route.query) {
        route = useRoute();
    }
    const form = {
        orders: "",
        merchbill: "",
        money: route.query?.sum_xiaoji,
        address: "",
        phone: "",
        fullname: "",
        userss: $session.username,
        company: "",
        numbers: "",
    };

    return form;
};

function exportForm(form, readMap) {
    var autoText = ["progressid", "orders", "merchbill", "money", "address", "phone", "fullname", "userss"];
    for (var txt of autoText) {
        form[txt] = readMap[txt];
    }
}

/**
 * 异步模式获取数据
 * @param id
 * @param readMap
 * @return {Promise<EShipmentForm>}
 */
export const canShipmentCreateForm = (id, readMap) => {
    return new Promise(async (resolve, reject) => {
        var form = ShipmentCreateForm();
        if (!readMap || !readMap.id) {
            readMap = await canProgressFindById(id).catch(reject);
        }
        exportForm(form, readMap);
        form.progressid = readMap.id;
        resolve({ form, readMap });
    });
};

/**
 * 响应式获取订单发货 模块的表单字段数据
 * @return {EShipmentForm}
 */
export const useShipmentCreateForm = (id) => {
    const form = ShipmentCreateForm();
    const formReactive = reactive(form);

    const readMap = reactive({});
    canProgressFindById(id).then(
        (map) => {
            exportForm(formReactive, map);
            extend(readMap, map);
            formReactive.progressid = map.id;
        },
        (err) => {
            ElMessageBox.alert(err.message);
        }
    );
    return { form: formReactive, readMap };
};

export const canShipmentSelect = (filter, result) => {
    http.post("/api/shipment/selectPages").then((res) => {
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
export const useShipmentSelect = (filter) => {
    const result = reactive({
        lists: [],
        total: {},
    });
    canShipmentSelect(filter, result);
    return result;
};

/**
 * 根据
 * @param id
 * @return {Promise<EShipment>}
 */
export const canShipmentFindById = (id) => {
    return new Promise((resolve, reject) => {
        // 读取后台数据
        http.get("/api/shipment/findById", { id }).then((res) => {
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
 * @return {EShipment}
 */
export const useShipmentFindById = (id) => {
    var form = reactive({});

    canShipmentFindById(id).then((res) => {
        extend(form, res);
    });
    return form;
};

/**
 * 根据数据,插入到数据库中
 * @param {EShipment} data
 * @return {Promise<EResponseData<EShipment>>}
 */
export const canShipmentInsert = (data) => {
    return new Promise((resolve, reject) => {
        http.post("/api/shipment/insert", data)
            .json()
            .then(
                (res) => {
                    resolve(res);
                    if (res.code == 0) {
                        event.emit("shipment_insert", res.data);
                        event.emit("shipment_change", res.data);
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
 * @param {EShipment} data
 * @return {Promise<EResponseData<EShipment>>}
 */
export const canShipmentUpdate = (data) => {
    return new Promise((resolve, reject) => {
        http.post("/api/shipment/update", data)
            .json()
            .then(
                (res) => {
                    resolve(res);
                    if (res.code == 0) {
                        event.emit("shipment_update", res.data);
                        event.emit("shipment_change", res.data);
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
export const canShipmentDelete = (id) => {
    var res = [];
    if (!isArray(id)) {
        res.push(id);
    } else {
        res = id;
    }

    return new Promise((resolve, reject) => {
        http.post("/api/shipment/delete", res)
            .json()
            .then(
                (res) => {
                    resolve(res);
                    if (res.code == 0) {
                        event.emit("shipment_delete", res.data);
                        event.emit("shipment_change", res.data);
                    }
                },
                (err) => {
                    reject(err);
                }
            );
    });
};
