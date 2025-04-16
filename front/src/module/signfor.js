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
 * @return {ESignfor}
 */

export const SignforCreateForm = () => {
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
        notes: "",
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
 * @return {Promise<ESignforForm>}
 */
export const canSignforCreateForm = (id, readMap) => {
    return new Promise(async (resolve, reject) => {
        var form = SignforCreateForm();
        if (!readMap || !readMap.id) {
            readMap = await canProgressFindById(id).catch(reject);
        }
        exportForm(form, readMap);
        form.progressid = readMap.id;
        resolve({ form, readMap });
    });
};

/**
 * 响应式获取订单签收 模块的表单字段数据
 * @return {ESignforForm}
 */
export const useSignforCreateForm = (id) => {
    const form = SignforCreateForm();
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

export const canSignforSelect = (filter, result) => {
    http.post("/api/signfor/selectPages").then((res) => {
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
export const useSignforSelect = (filter) => {
    const result = reactive({
        lists: [],
        total: {},
    });
    canSignforSelect(filter, result);
    return result;
};

/**
 * 根据
 * @param id
 * @return {Promise<ESignfor>}
 */
export const canSignforFindById = (id) => {
    return new Promise((resolve, reject) => {
        // 读取后台数据
        http.get("/api/signfor/findById", { id }).then((res) => {
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
 * @return {ESignfor}
 */
export const useSignforFindById = (id) => {
    var form = reactive({});

    canSignforFindById(id).then((res) => {
        extend(form, res);
    });
    return form;
};

/**
 * 根据数据,插入到数据库中
 * @param {ESignfor} data
 * @return {Promise<EResponseData<ESignfor>>}
 */
export const canSignforInsert = (data) => {
    return new Promise((resolve, reject) => {
        http.post("/api/signfor/insert", data)
            .json()
            .then(
                (res) => {
                    resolve(res);
                    if (res.code == 0) {
                        event.emit("signfor_insert", res.data);
                        event.emit("signfor_change", res.data);
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
 * @param {ESignfor} data
 * @return {Promise<EResponseData<ESignfor>>}
 */
export const canSignforUpdate = (data) => {
    return new Promise((resolve, reject) => {
        http.post("/api/signfor/update", data)
            .json()
            .then(
                (res) => {
                    resolve(res);
                    if (res.code == 0) {
                        event.emit("signfor_update", res.data);
                        event.emit("signfor_change", res.data);
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
export const canSignforDelete = (id) => {
    var res = [];
    if (!isArray(id)) {
        res.push(id);
    } else {
        res = id;
    }

    return new Promise((resolve, reject) => {
        http.post("/api/signfor/delete", res)
            .json()
            .then(
                (res) => {
                    resolve(res);
                    if (res.code == 0) {
                        event.emit("signfor_delete", res.data);
                        event.emit("signfor_change", res.data);
                    }
                },
                (err) => {
                    reject(err);
                }
            );
    });
};
