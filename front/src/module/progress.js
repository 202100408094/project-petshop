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
 * @return {EProgress}
 */

export const ProgressCreateForm = () => {
    var route = unref(router.currentRoute);
    const userStore = useUserStore();
    const $session = userStore.session;
    if (!route.query) {
        route = useRoute();
    }
    const form = {
        orders: rule.getID(),
        merchbill: "",
        money: route.query?.sum_xiaoji,
        address: "",
        phone: "",
        fullname: "",
        notes: "",
        userss: $session.username,
        state: "待支付",

        iszf: "否",
    };

    return form;
};

/**
 * 异步模式获取数据
 * @param id
 * @param readMap
 * @return {Promise<EProgressForm>}
 */
export const canProgressCreateForm = () => {
    return new Promise(async (resolve, reject) => {
        var form = ProgressCreateForm();
        resolve({ form });
    });
};

/**
 * 响应式获取订单 模块的表单字段数据
 * @return {EProgressForm}
 */
export const useProgressCreateForm = () => {
    const form = ProgressCreateForm();
    const formReactive = reactive(form);

    return { form: formReactive };
};

export const canProgressSelect = (filter, result) => {
    http.post("/api/progress/selectPages").then((res) => {
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
export const useProgressSelect = (filter) => {
    const result = reactive({
        lists: [],
        total: {},
    });
    canProgressSelect(filter, result);
    return result;
};

/**
 * 根据
 * @param id
 * @return {Promise<EProgress>}
 */
export const canProgressFindById = (id) => {
    return new Promise((resolve, reject) => {
        // 读取后台数据
        http.get("/api/progress/findById", { id }).then((res) => {
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
 * @return {EProgress}
 */
export const useProgressFindById = (id) => {
    var form = reactive({});

    canProgressFindById(id).then((res) => {
        extend(form, res);
    });
    return form;
};

/**
 * 根据数据,插入到数据库中
 * @param {EProgress} data
 * @return {Promise<EResponseData<EProgress>>}
 */
export const canProgressInsert = (data) => {
    return new Promise((resolve, reject) => {
        http.post("/api/progress/insert", data)
            .json()
            .then(
                (res) => {
                    resolve(res);
                    if (res.code == 0) {
                        event.emit("progress_insert", res.data);
                        event.emit("progress_change", res.data);
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
 * @param {EProgress} data
 * @return {Promise<EResponseData<EProgress>>}
 */
export const canProgressUpdate = (data) => {
    return new Promise((resolve, reject) => {
        http.post("/api/progress/update", data)
            .json()
            .then(
                (res) => {
                    resolve(res);
                    if (res.code == 0) {
                        event.emit("progress_update", res.data);
                        event.emit("progress_change", res.data);
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
export const canProgressDelete = (id) => {
    var res = [];
    if (!isArray(id)) {
        res.push(id);
    } else {
        res = id;
    }

    return new Promise((resolve, reject) => {
        http.post("/api/progress/delete", res)
            .json()
            .then(
                (res) => {
                    resolve(res);
                    if (res.code == 0) {
                        event.emit("progress_delete", res.data);
                        event.emit("progress_change", res.data);
                    }
                },
                (err) => {
                    reject(err);
                }
            );
    });
};
