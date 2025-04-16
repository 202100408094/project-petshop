import http from "@/utils/ajax/http";
import { useRoute } from "vue-router";
import { useUserStore } from "@/stores";
import { reactive, ref, unref } from "vue";
import rule from "@/utils/rule";
import { extend, isArray } from "@/utils/extend";
import { ElMessageBox } from "element-plus";
import router from "@/router";
import event from "@/utils/event";

import { canGoodsFindById } from "./goods";

/**
 * 响应式的对象数据
 * @return {EStores}
 */

export const StoresCreateForm = () => {
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
        numbers1: rule.getID(),
        price: "",
        quantity: "",
        notes: "",
        handler: $session.username,
    };

    return form;
};

function exportForm(form, readMap) {
    var autoText = ["goodsid", "numbers", "names", "ification"];
    for (var txt of autoText) {
        form[txt] = readMap[txt];
    }
}

/**
 * 异步模式获取数据
 * @param id
 * @param readMap
 * @return {Promise<EStoresForm>}
 */
export const canStoresCreateForm = (id, readMap) => {
    return new Promise(async (resolve, reject) => {
        var form = StoresCreateForm();
        if (!readMap || !readMap.id) {
            readMap = await canGoodsFindById(id).catch(reject);
        }
        exportForm(form, readMap);
        form.goodsid = readMap.id;
        resolve({ form, readMap });
    });
};

/**
 * 响应式获取用品入库 模块的表单字段数据
 * @return {EStoresForm}
 */
export const useStoresCreateForm = (id) => {
    const form = StoresCreateForm();
    const formReactive = reactive(form);

    const readMap = reactive({});
    canGoodsFindById(id).then(
        (map) => {
            exportForm(formReactive, map);
            extend(readMap, map);
            formReactive.goodsid = map.id;
        },
        (err) => {
            ElMessageBox.alert(err.message);
        }
    );
    return { form: formReactive, readMap };
};

export const canStoresSelect = (filter, result) => {
    http.post("/api/stores/selectPages").then((res) => {
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
export const useStoresSelect = (filter) => {
    const result = reactive({
        lists: [],
        total: {},
    });
    canStoresSelect(filter, result);
    return result;
};

/**
 * 根据
 * @param id
 * @return {Promise<EStores>}
 */
export const canStoresFindById = (id) => {
    return new Promise((resolve, reject) => {
        // 读取后台数据
        http.get("/api/stores/findById", { id }).then((res) => {
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
 * @return {EStores}
 */
export const useStoresFindById = (id) => {
    var form = reactive({});

    canStoresFindById(id).then((res) => {
        extend(form, res);
    });
    return form;
};

/**
 * 根据数据,插入到数据库中
 * @param {EStores} data
 * @return {Promise<EResponseData<EStores>>}
 */
export const canStoresInsert = (data) => {
    return new Promise((resolve, reject) => {
        http.post("/api/stores/insert", data)
            .json()
            .then(
                (res) => {
                    resolve(res);
                    if (res.code == 0) {
                        event.emit("stores_insert", res.data);
                        event.emit("stores_change", res.data);
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
 * @param {EStores} data
 * @return {Promise<EResponseData<EStores>>}
 */
export const canStoresUpdate = (data) => {
    return new Promise((resolve, reject) => {
        http.post("/api/stores/update", data)
            .json()
            .then(
                (res) => {
                    resolve(res);
                    if (res.code == 0) {
                        event.emit("stores_update", res.data);
                        event.emit("stores_change", res.data);
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
export const canStoresDelete = (id) => {
    var res = [];
    if (!isArray(id)) {
        res.push(id);
    } else {
        res = id;
    }

    return new Promise((resolve, reject) => {
        http.post("/api/stores/delete", res)
            .json()
            .then(
                (res) => {
                    resolve(res);
                    if (res.code == 0) {
                        event.emit("stores_delete", res.data);
                        event.emit("stores_change", res.data);
                    }
                },
                (err) => {
                    reject(err);
                }
            );
    });
};
