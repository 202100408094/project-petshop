<template>
    <div class="views-reservation-web-add">
        <div>
            <e-container>
                <el-card class="box-card">
                    <template #header>
                        <div class="clearfix">
                            <span class="title"> 添加服务预约 </span>
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

                        <el-form-item label="联系电话 " prop="phone" required :rules="[{required:true, message:'请填写联系电话'}]">
                            <el-input type="text" placeholder="输入联系电话" style="width: 450px" v-model="form.phone" />
                        </el-form-item>

                        <el-form-item label="预约备注 " prop="notes"> <el-input type="textarea" v-model="form.notes"></el-input> </el-form-item>

                        <el-form-item label="预约用户 " prop="userss"> <el-input v-model="form.userss" readonly style="width: 250px"></el-input> </el-form-item>

                        <el-form-item v-if="btnText">
                            <el-button type="primary" @click="submit">{{ btnText }}</el-button>
                        </el-form-item>
                    </el-form></el-card
                >
            </e-container>
        </div>
    </div>
</template>

<script setup>
    import http from "@/utils/ajax/http";
    import DB from "@/utils/db";
    import rule from "@/utils/rule";
    import router from "@/router";

    import { ref, reactive, computed } from "vue";
    import { useRoute } from "vue-router";
    import { session } from "@/utils/utils";
    import { ElMessage, ElMessageBox } from "element-plus";
    import { useReservationCreateForm, canReservationInsert } from "@/module";

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
    const { form, readMap } = useReservationCreateForm(props.id);
    const emit = defineEmits(["success"]);
    const formModel = ref();
    const loading = ref(false);
    var submit = () => {
        return new Promise((resolve, reject) => {
            formModel.value
                .validate()
                .then((res) => {
                    if (loading.value) return;
                    loading.value = true;
                    canReservationInsert(form).then(
                        (res) => {
                            loading.value = false;
                            if (res.code == 0) {
                                emit("success", res.data);
                                if (props.isHouxu) {
                                    ElMessage.success("添加成功");
                                    router.go(-1);
                                }
                            } else {
                                ElMessageBox.alert(res.msg);
                            }
                            resolve(res);
                        },
                        (err) => {
                            loading.value = false;
                            ElMessageBox.alert(err.message);
                            reject(err);
                        }
                    );
                })
                .catch((err) => {
                    reject(err);
                });
        });
    };
</script>

<style scoped lang="scss">
    .views-reservation-web-add {
    }
</style>
