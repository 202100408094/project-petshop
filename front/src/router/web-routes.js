import { session } from "@/utils/utils";
export default [
    {
        path: "user1/add",
        name: "Indexuser1Add",
        component: () => import("@/views/user1/add-web.vue"),
        meta: { title: "用户添加" },
    },
];
