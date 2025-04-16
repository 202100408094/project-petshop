<template>
    <div class="views-reservation-updt">
        <div>
            <el-card class="box-card">
                <template #header>
                    <div class="clearfix">
                        <span class="title"> 完成服务 </span>
                    </div>
                </template>

                <el-form :model="form" ref="formModel" :label-width="labelWidth" status-icon validate-on-rule-change>
                    <el-form-item v-if="isRead" label="标题 " prop="title"> {{ form.title }} </el-form-item>

                    <el-form-item v-if="isRead" label="编号 " prop="numbers"> {{ form.numbers }} </el-form-item>

                    <el-form-item v-if="isRead" label="类型 " prop="type"> {{ form.type }} </el-form-item>

                    <el-form-item v-if="isRead" label="价格 " prop="price" :rules="[{validator:rule.checkNumber, message:'输入一个有效数字'}]"> {{ form.price }} </el-form-item>

                    <el-form-item label="预约单号 " prop="numberss" :rules="[{required:true, message:'请填写预约单号'}]">
                        <el-input type="text" placeholder="输入预约单号" style="width: 450px" v-model="form.numberss" />
                    </el-form-item>


                    <el-form-item label="预约用户 " prop="userss"> <el-input v-model="form.userss" readonly style="width: 250px"></el-input> </el-form-item>

                    <el-form-item label="状态 " prop="state">
                        <el-select v-model="form.state"
                            >

                            <el-option label="已完成" value="已完成"></el-option>
                        </el-select>
                    </el-form-item>


                    <el-form-item v-if="btnText">
                        <el-button type="primary" @click="submit">{{ btnText }}</el-button>
                    </el-form-item>
                </el-form></el-card
            >
        </div>
    </div>
</template>

<script setup>
    import http from "@/utils/ajax/http";
    import DB from "@/utils/db";
    import rule from "@/utils/rule";
    import router from "@/router";

    import { ref, reactive, computed, watch } from "vue";
    import { useRoute } from "vue-router";
    import { session } from "@/utils/utils";
    import { ElMessage, ElMessageBox } from "element-plus";
    import { useReservationFindById, canReservationFindById, canReservationUpdate, canServicesFindById } from "@/module";
    import { extend } from "@/utils/extend";

    const route = useRoute();
    const props = defineProps({
        id: [String, Number],
        btnText: {
            type: String,
            default: "保存",
        },
        isRead: {
            type: Boolean,
            default: true,
        },
        isHouxu: {
            type: Boolean,
            default: true,
        },
        labelWidth: {
            type: String,
            default: "140px",
        },
    });
    const form = useReservationFindById(props.id);
    const emit = defineEmits(["success"]);
    const formModel = ref();
    const loading = ref(false);

    const submit = () => {
        formModel.value.validate().then((res) => {
            if (loading.value) return;
            loading.value = true;
            canReservationUpdate(form).then(
                (res) => {
                    loading.value = false;
                    if (res.code == 0) {
                        emit("success", res.data);
                        if (props.isHouxu) {
                            ElMessage.success("完成成功");
                            router.go(-1);
                        }
                    } else {
                        ElMessageBox.alert(res.msg);
                    }
                },
                (err) => {
                    loading.value = false;
                    ElMessageBox.alert(err.message);
                }
            );
        });
    };

    const readMap = reactive({});
    watch(
        () => form.servicesid,
        (id) => {
            canServicesFindById(id).then((res) => {
                extend(readMap, res);
            });
        }
    );
</script>

<style scoped lang="scss">
    .views-reservation-updt {
    }
</style>
