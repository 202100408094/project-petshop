import { session } from "@/utils/utils";

export default [
    {
        path: "admins",
        name: "AdminadminsList",
        component: () => import("@/views/admins/list.vue"),
        meta: { title: "管理员列表", authLogin: true },
    },

    {
        path: "admins/add",
        name: "AdminadminsAdd",
        component: () => import("@/views/admins/add.vue"),
        meta: { title: "添加管理员", authLogin: true },
    },
    {
        path: "admins/updt",
        name: "AdminadminsUpdt",
        props: (route) => ({ id: route.query.id }),
        component: () => import("@/views/admins/updt.vue"),
        meta: { title: "编辑管理员", authLogin: true },
    },
    {
        path: "admins/updtself",
        name: "AdminadminsUpdtSelf",
        props: (route) => ({ id: session("id") }),
        component: () => import("@/views/admins/updtself.vue"),
        meta: { title: "更新个人资料", authLogin: true },
    },
    {
        path: "user1",
        name: "Adminuser1List",
        component: () => import("@/views/user1/list.vue"),
        meta: { title: "用户列表", authLogin: true },
    },

    {
        path: "user1/add",
        name: "Adminuser1Add",
        component: () => import("@/views/user1/add.vue"),
        meta: { title: "添加用户", authLogin: true },
    },
    {
        path: "user1/updt",
        name: "Adminuser1Updt",
        props: (route) => ({ id: route.query.id }),
        component: () => import("@/views/user1/updt.vue"),
        meta: { title: "编辑用户", authLogin: true },
    },
    {
        path: "user1/updtself",
        name: "Adminuser1UpdtSelf",
        props: (route) => ({ id: session("id") }),
        component: () => import("@/views/user1/updtself.vue"),
        meta: { title: "更新个人资料", authLogin: true },
    },
    {
        path: "user1/detail",
        props: (route) => ({ id: route.query.id }),
        name: "Adminuser1Detail",
        component: () => import("@/views/user1/detail.vue"),
        meta: { title: "用户详情", authLogin: true },
    },
    {
        path: "staff",
        name: "AdminstaffList",
        component: () => import("@/views/staff/list.vue"),
        meta: { title: "员工列表", authLogin: true },
    },

    {
        path: "staff/add",
        name: "AdminstaffAdd",
        component: () => import("@/views/staff/add.vue"),
        meta: { title: "添加员工", authLogin: true },
    },
    {
        path: "staff/updt",
        name: "AdminstaffUpdt",
        props: (route) => ({ id: route.query.id }),
        component: () => import("@/views/staff/updt.vue"),
        meta: { title: "编辑员工", authLogin: true },
    },
    {
        path: "staff/updtself",
        name: "AdminstaffUpdtSelf",
        props: (route) => ({ id: session("id") }),
        component: () => import("@/views/staff/updtself.vue"),
        meta: { title: "更新个人资料", authLogin: true },
    },
    {
        path: "staff/detail",
        props: (route) => ({ id: route.query.id }),
        name: "AdminstaffDetail",
        component: () => import("@/views/staff/detail.vue"),
        meta: { title: "员工详情", authLogin: true },
    },
];
