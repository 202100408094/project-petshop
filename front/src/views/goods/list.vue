<template>
    <div class="views-goods-list">
        <div>
            <el-card class="box-card">
                <template #header>
                    <div class="clearfix">
                        <span class="title"> 商品信息查询 </span>
                    </div>
                </template>

                <div class="form-search">
                    <el-form @submit.prevent.stop :inline="true" size="small">
                        <el-form-item label="商品编号">
                            <el-input v-model="search.numbers"></el-input>
                        </el-form-item>
                        <el-form-item label="商品名称">
                            <el-input v-model="search.names"></el-input>
                        </el-form-item>
                        <el-form-item label="分类">
                            <el-select v-model="search.ification"
                                ><el-option label="请选择" value=""></el-option><e-select-option type="option" module="classifications" value="id" label="names"></e-select-option
                            ></el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="searchSubmit" icon="el-icon-search">查询</el-button>
                        </el-form-item>
                    </el-form>
                </div>

                <el-table border :data="lists" style="width: 100%" @sort-change="sortChange" highlight-current-row>
                    <el-table-column type="index" label="#"></el-table-column>
                    <!-- 序号 -->

                    <el-table-column prop="numbers" label="商品编号" width="130">
                        <template #default="{row}"> {{ row.numbers }} </template>
                    </el-table-column>
                    <el-table-column prop="names" label="商品名称">
                        <template #default="{row}"> {{ row.names }} </template>
                    </el-table-column>
                    <el-table-column prop="ification" label="分类" width="120">
                        <template #default="{row}"> <e-select-view module="classifications" :value="row.ification" select="id" show="names"></e-select-view> </template>
                    </el-table-column>
                    <el-table-column prop="picture" label="商品图片" width="100">
                        <template #default="{row}">
                            <div style="width: 100%; max-width: 120px">
                                <e-img :src="row.picture" type="list"></e-img>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column sortable="custom" prop="price" label="商品价格" width="120">
                        <template #default="{row}"> {{ row.price }} </template>
                    </el-table-column>
                    <el-table-column sortable="custom" prop="inventory" label="商品库存" width="180">
                        <template #default="{row}">
                            <span :class="{red : row.inventory<10}">
                            {{ row.inventory }}
                            </span>
                            <span v-if="row.inventory<10" :class="{red : row.inventory<10}">
                            库存即将不足!
                        </span>
                        </template>
                    </el-table-column>
                    <el-table-column sortable="custom" prop="volume" label="商品销量" width="120">
                        <template #default="{row}"> {{ row.volume }} </template>
                    </el-table-column>

                    <el-table-column label="操作" fixed="right" width="220">
                        <template #default="{row}">
                            <el-button-group>
                                <el-button type="primary" :icon="Plus" size="small" @click="$router.push('/admin/stores/add?id='+row.id)">用品入库</el-button>

                                <el-button type="primary" :icon="Plus" size="small" @click="$router.push('/admin/outbound/add?id='+row.id)">用品出库</el-button>

                                <el-tooltip effect="dark" content="详情" placement="top-start"
                                    ><el-button type="info" :icon="InfoFilled" size="small" @click="$router.push('/admin/goods/detail?id='+row.id)">详情</el-button>
                                </el-tooltip>
                                <template v-if="$session.cx == '管理员'">
                                    <el-tooltip effect="dark" content="编辑" placement="top-start"
                                        ><el-button type="success" :icon="Edit" size="small" @click="$router.push('/admin/goods/updt?id='+row.id)">编辑</el-button>
                                    </el-tooltip>
                                </template>

                                <template v-if="$session.cx == '管理员'">
                                    <el-tooltip effect="dark" content="删除" placement="top-start"
                                        ><el-button type="danger" :icon="Delete" size="small" @click="deleteItems(row.id)">删除</el-button>
                                    </el-tooltip>
                                </template>
                            </el-button-group>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="e-pages" style="margin-top: 10px; text-align: center">
                    <el-pagination
                        @current-change="loadList"
                        :page-sizes="[12, 24, 36, 48,60]"
                        v-model:current-page="search.page"
                        v-model:page-size="search.pagesize"
                        @size-change="sizeChange"
                        layout="total, sizes, prev, pager, next"
                        :total="totalCount"
                    >
                    </el-pagination>
                </div>
            </el-card>
        </div>
    </div>
</template>
<style type="text/scss" scoped lang="scss">
.red {
    color: red;
}
</style>

<script setup>
    import http from "@/utils/ajax/http";
    import DB from "@/utils/db";
    import router from "@/router";

    import { ref, reactive, watch, unref, onBeforeMount } from "vue";
    import { useRoute } from "vue-router";
    import { session } from "@/utils/utils";
    import { canGoodsSelect, useGoodsSelect, canGoodsDelete } from "@/module";
    import { extend } from "@/utils/extend";
    import { ElMessageBox, ElMessage } from "element-plus";
    import { Plus, InfoFilled, Edit, Delete } from "@element-plus/icons-vue";

    const route = useRoute();
    const search = reactive({
        numbers: "",
        names: "",
        ification: "",
        page: 1, // 当前页
        pagesize: 12, // 每页行数
        orderby: "id", // 排序字段
        sort: "desc", // 排序类型
    });
    extend(search, route.query);
    // 链接参数变化时更新这些内容
    watch(
        () => route.query,
        () => {
            extend(search, route.query);
            loadList(1);
        },
        { deep: true }
    );

    // 总行数
    const totalCount = ref(0);
    /**
     * 列表数据
     * @type {EGoods[]}
     */
    const lists = ref([]);
    // 加载状态
    const loading = ref(false);

    // 排序操作
    const sortChange = (e) => {
        console.log(e);
        if (e.order == null) {
            search.orderby = "id";
            search.sort = "desc";
        } else {
            search.orderby = e.prop;
            search.sort = e.order == "ascending" ? "asc" : "desc";
        }
        loadList(1);
    };
    // 设置页数多少
    const sizeChange = (e) => {
        search.pagesize = e;
        loadList(1);
    };

    const deleteItems = (ids) => {
        return new Promise((resolve, reject) => {
            ElMessageBox.confirm("确定删除？")
                .then((res) => {
                    canGoodsDelete(ids).then((res) => {
                        if (res.code == 0) {
                            ElMessage.success("删除成功");
                            loadList(search.page);
                            resolve(res.data);
                        } else {
                            ElMessage.error(res.msg);
                        }
                    });
                })
                .catch((err) => {
                    reject(err);
                });
        });
    };

    // 加载商品信息列表方法
    const loadList = (page) => {
        // 加载
        if (unref(loading)) return;
        loading.value = true;
        search.page = page;

        http.post("/api/goods/selectPages", search).then(
            (res) => {
                loading.value = false;
                if (res.code == 0) {
                    var data = res.data;
                    lists.value = data.lists.records;
                    totalCount.value = data.lists.total;
                }
            },
            (err) => {
                loading.value = false;
                ElMessage.error(err.message);
            }
        );
    };

    onBeforeMount(() => {
        loadList(1);
    });
    const searchSubmit = () => {
        loadList(1);
    };
</script>

<style scoped lang="scss">
    .views-goods-list {
    }
</style>
