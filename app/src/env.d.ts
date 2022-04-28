declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
declare module "@/service"{
  import {AxiosInstance} from "axios";
  const component:AxiosInstance
  export default component
}
declare module "nprogress"