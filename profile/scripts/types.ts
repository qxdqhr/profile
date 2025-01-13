import type { ConfigEnv, UserConfig } from "vite";

// 自定义配置生成函数的类型
// 该函数作为vite.config.ts中调用createConfig时传入的第二个参数，执行后生成的结果用于和我们定义的默认配置合并）
export type Configure = (params: ConfigEnv, isBuild: boolean) => UserConfig;
