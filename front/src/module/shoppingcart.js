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
 * @return {EShoppingcart}
 */

export const ShoppingcartCreateForm = () => {
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

function exportForm(form, readMap) {
    var autoText = ["goodsid", "numbers", "names", "ification", "picture", "price"];
    for (var txt of autoText) {
        form[txt] = readMap[txt];
    }
}

/**
 * 异步模式获取数据
 * @param id
 * @param readMap
 * @return {Promise<EShoppingcartForm>}
 */
export const canShoppingcartCreateForm = (id, readMap) => {
    return new Promise(async (resolve, reject) => {
        var form = ShoppingcartCreateForm();
        if (!readMap || !readMap.id) {
            readMap = await canGoodsFindById(id).catch(reject);
        }
        exportForm(form, readMap);
        form.goodsid = readMap.id;
        resolve({ form, readMap });
    });
};

/**
 * 响应式获取购物车 模块的表单字段数据
 * @return {EShoppingcartForm}
 */
export const useShoppingcartCreateForm = (id) => {
    const form = ShoppingcartCreateForm();
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

export const canShoppingcartSelect = (filter, result) => {
    http.post("/api/shoppingcart/selectPages").then((res) => {
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
export const useShoppingcartSelect = (filter) => {
    const result = reactive({
        lists: [],
        total: {},
    });
    canShoppingcartSelect(filter, result);
    return result;
};

/**
 * 根据
 * @param id
 * @return {Promise<EShoppingcart>}
 */
export const canShoppingcartFindById = (id) => {
    return new Promise((resolve, reject) => {
        // 读取后台数据
        http.get("/api/shoppingcart/findById", { id }).then((res) => {
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
 * @return {EShoppingcart}
 */
export const useShoppingcartFindById = (id) => {
    var form = reactive({});

    canShoppingcartFindById(id).then((res) => {
        extend(form, res);
    });
    return form;
};

/**
 * 根据数据,插入到数据库中
 * @param {EShoppingcart} data
 * @return {Promise<EResponseData<EShoppingcart>>}
 */
export const canShoppingcartInsert = (data) => {
    return new Promise((resolve, reject) => {
        http.post("/api/shoppingcart/insert", data)
            .json()
            .then(
                (res) => {
                    resolve(res);
                    if (res.code == 0) {
                        event.emit("shoppingcart_insert", res.data);
                        event.emit("shoppingcart_change", res.data);
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
 * @param {EShoppingcart} data
 * @return {Promise<EResponseData<EShoppingcart>>}
 */
export const canShoppingcartUpdate = (data) => {
    return new Promise((resolve, reject) => {
        http.post("/api/shoppingcart/update", data)
            .json()
            .then(
                (res) => {
                    resolve(res);
                    if (res.code == 0) {
                        event.emit("shoppingcart_update", res.data);
                        event.emit("shoppingcart_change", res.data);
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
export const canShoppingcartDelete = (id) => {
    var res = [];
    if (!isArray(id)) {
        res.push(id);
    } else {
        res = id;
    }

    return new Promise((resolve, reject) => {
        http.post("/api/shoppingcart/delete", res)
            .json()
            .then(
                (res) => {
                    resolve(res);
                    if (res.code == 0) {
                        event.emit("shoppingcart_delete", res.data);
                        event.emit("shoppingcart_change", res.data);
                    }
                },
                (err) => {
                    reject(err);
                }
            );
    });
};
