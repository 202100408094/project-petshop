<template>
    <div class="views-reservation-list">
        <div>
            <el-card class="box-card">
                <template #header>
                    <div class="clearfix">
                        <span class="title"> 服务预约查询 </span>
                    </div>
                </template>

                <div class="form-search">
                    <el-form @submit.prevent.stop :inline="true" size="small">
                        <el-form-item label="标题">
                            <el-input v-model="search.title"></el-input>
                        </el-form-item>
                        <el-form-item label="编号">
                            <el-input v-model="search.numbers"></el-input>
                        </el-form-item>
                        <el-form-item label="类型">
                            <el-select v-model="search.type"
                                ><el-option label="请选择" value=""></el-option><el-option label="美容" value="美容"></el-option>
                                <el-option label="洗澡" value="洗澡"></el-option>
                                <el-option label="驱虫" value="驱虫"></el-option>
                                <el-option label="其他" value="其他"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="预约单号">
                            <el-input v-model="search.numberss"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="searchSubmit" icon="el-icon-search">查询</el-button>
                        </el-form-item>
                    </el-form>
                </div>

                <el-table border :data="lists" style="width: 100%" @sort-change="sortChange" highlight-current-row>
                    <el-table-column type="index" label="#"></el-table-column>
                    <!-- 序号 -->

                    <el-table-column prop="title" label="标题"width="180">
                        <template #default="{row}"> {{ row.title }} </template>
                    </el-table-column>
                    <el-table-column prop="numbers" label="编号" width="130">
                        <template #default="{row}"> {{ row.numbers }} </template>
                    </el-table-column>
                    <el-table-column prop="type" label="类型" width="120">
                        <template #default="{row}"> {{ row.type }} </template>
                    </el-table-column>
                    <el-table-column sortable="custom" prop="price" label="价格" width="120">
                        <template #default="{row}"> {{ row.price }} </template>
                    </el-table-column>
                    <el-table-column prop="numberss" label="预约单号" width="130">
                        <template #default="{row}"> {{ row.numberss }} </template>
                    </el-table-column>
                    <el-table-column prop="phone" label="联系电话" width="130">
                        <template #default="{row}"> {{ row.phone }} </template>
                    </el-table-column>
                    <el-table-column prop="notes" label="预约备注">
                        <template #default="{row}"> {{ row.notes }} </template>
                    </el-table-column>
                    <el-table-column prop="userss" label="预约用户" width="180">
                        <template #default="{row}"> {{ row.userss }} </template>
                    </el-table-column>
                    <el-table-column prop="addtime" label="预约时间"width="180">
                        <template #default="{row}"> {{ row.addtime.substring(0,19) }} </template>
                    </el-table-column>
                    <el-table-column prop="state" label="状态" width="120">
                        <template #default="{row}"> {{ row.state }} </template>
                    </el-table-column>
                    <el-table-column prop="number1" label="工号" width="130">
                        <template #default="{row}"> {{ row.number1 }} </template>
                    </el-table-column>
                    <el-table-column prop="names" label="姓名" width="130">
                        <template #default="{row}"> {{ row.names }} </template>
                    </el-table-column>
                    <el-table-column prop="date" label="安排日期" width="130">
                        <template #default="{row}"> {{ row.date }} </template>
                    </el-table-column>

                    <el-table-column label="是否支付" width="120">
                        <template #default="{row}"> {{ row.iszf }} </template>
                    </el-table-column>

                    <el-table-column label="操作" fixed="right" width="220">
                        <template #default="{row}">
                            <el-button-group>
                                <template v-if="$session.cx == '管理员'">
                                    <el-button v-if="row.state == '待安排'" type="primary" :icon="Plus" size="small" @click="$router.push('/admin/arrange/add?id='+row.id)">服务安排</el-button>

                                </template>


                                <el-tooltip effect="dark" content="详情" placement="top-start"
                                    ><el-button type="info" :icon="InfoFilled" size="small" @click="$router.push('/admin/reservation/detail?id='+row.id)">详情</el-button>
                                </el-tooltip>
                                <template v-if="$session.cx == '员工'">
                                    <el-tooltip effect="dark" content="编辑" placement="top-start"
                                    ><el-button v-if="row.state == '待服务'" type="success" :icon="Edit" size="small" @click="$router.push('/admin/reservation/updt?id='+row.id)">完成服务</el-button>
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

<script setup>
    import http from "@/utils/ajax/http";
    import DB from "@/utils/db";
    import router from "@/router";

    import { ref, reactive, watch, unref, onBeforeMount } from "vue";
    import { useRoute } from "vue-router";
    import { session } from "@/utils/utils";
    import { canReservationSelect, useReservationSelect, canReservationDelete } from "@/module";
    import { extend } from "@/utils/extend";
    import { ElMessageBox, ElMessage } from "element-plus";
    import { Plus, Search, InfoFilled, Edit, Delete } from "@element-plus/icons-vue";

    const route = useRoute();
    const search = reactive({
        servicesid: "",
        title: "",
        numbers: "",
        type: "",
        numberss: "",
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
     * @type {EReservation[]}
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
                    canReservationDelete(ids).then((res) => {
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

    // 加载服务预约列表方法
    const loadList = (page) => {
        // 加载
        if (unref(loading)) return;
        loading.value = true;
        search.page = page;

        http.post("/api/reservation/selectPages", search).then(
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
    .views-reservation-list {
    }
</style>
