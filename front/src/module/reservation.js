import http from "@/utils/ajax/http";
import { useRoute } from "vue-router";
import { useUserStore } from "@/stores";
import { reactive, ref, unref } from "vue";
import rule from "@/utils/rule";
import { extend, isArray } from "@/utils/extend";
import { ElMessageBox } from "element-plus";
import router from "@/router";
import event from "@/utils/event";

import { canServicesFindById } from "./services";

/**
 * 响应式的对象数据
 * @return {EReservation}
 */

export const ReservationCreateForm = () => {
    var route = unref(router.currentRoute);
    const userStore = useUserStore();
    const $session = userStore.session;
    if (!route.query) {
        route = useRoute();
    }
    const form = {
        title: "",
        numbers: "",
        type: "",
        price: "",
        numberss: rule.getID(),
        phone: $session.gender,
        notes: "",
        userss: $session.username,
        state: "待付款",
        number1: "暂无",
        names: "暂无",
        date: "暂无",

        iszf: "否",
    };

    return form;
};

function exportForm(form, readMap) {
    var autoText = ["servicesid", "title", "numbers", "type", "price"];
    for (var txt of autoText) {
        form[txt] = readMap[txt];
    }
}

/**
 * 异步模式获取数据
 * @param id
 * @param readMap
 * @return {Promise<EReservationForm>}
 */
export const canReservationCreateForm = (id, readMap) => {
    return new Promise(async (resolve, reject) => {
        var form = ReservationCreateForm();
        if (!readMap || !readMap.id) {
            readMap = await canServicesFindById(id).catch(reject);
        }
        exportForm(form, readMap);
        form.servicesid = readMap.id;
        resolve({ form, readMap });
    });
};

/**
 * 响应式获取服务预约 模块的表单字段数据
 * @return {EReservationForm}
 */
export const useReservationCreateForm = (id) => {
    const form = ReservationCreateForm();
    const formReactive = reactive(form);

    const readMap = reactive({});
    canServicesFindById(id).then(
        (map) => {
            exportForm(formReactive, map);
            extend(readMap, map);
            formReactive.servicesid = map.id;
        },
        (err) => {
            ElMessageBox.alert(err.message);
        }
    );
    return { form: formReactive, readMap };
};

export const canReservationSelect = (filter, result) => {
    http.post("/api/reservation/selectPages").then((res) => {
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
export const useReservationSelect = (filter) => {
    const result = reactive({
        lists: [],
        total: {},
    });
    canReservationSelect(filter, result);
    return result;
};

/**
 * 根据
 * @param id
 * @return {Promise<EReservation>}
 */
export const canReservationFindById = (id) => {
    return new Promise((resolve, reject) => {
        // 读取后台数据
        http.get("/api/reservation/findById", { id }).then((res) => {
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
 * @return {EReservation}
 */
export const useReservationFindById = (id) => {
    var form = reactive({});

    canReservationFindById(id).then((res) => {
        extend(form, res);
    });
    return form;
};

/**
 * 根据数据,插入到数据库中
 * @param {EReservation} data
 * @return {Promise<EResponseData<EReservation>>}
 */
export const canReservationInsert = (data) => {
    return new Promise((resolve, reject) => {
        http.post("/api/reservation/insert", data)
            .json()
            .then(
                (res) => {
                    resolve(res);
                    if (res.code == 0) {
                        event.emit("reservation_insert", res.data);
                        event.emit("reservation_change", res.data);
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
 * @param {EReservation} data
 * @return {Promise<EResponseData<EReservation>>}
 */
export const canReservationUpdate = (data) => {
    return new Promise((resolve, reject) => {
        http.post("/api/reservation/update", data)
            .json()
            .then(
                (res) => {
                    resolve(res);
                    if (res.code == 0) {
                        event.emit("reservation_update", res.data);
                        event.emit("reservation_change", res.data);
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
export const canReservationDelete = (id) => {
    var res = [];
    if (!isArray(id)) {
        res.push(id);
    } else {
        res = id;
    }

    return new Promise((resolve, reject) => {
        http.post("/api/reservation/delete", res)
            .json()
            .then(
                (res) => {
                    resolve(res);
                    if (res.code == 0) {
                        event.emit("reservation_delete", res.data);
                        event.emit("reservation_change", res.data);
                    }
                },
                (err) => {
                    reject(err);
                }
            );
    });
};
