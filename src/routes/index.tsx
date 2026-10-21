import { createFileRoute } from "@tanstack/react-router"

import { Home } from "@/components/home"

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "山东奶龙大学 · SDNU" },
      {
        name: "description",
        content:
          "山东奶龙大学（Shandong Nailoong University，简称 SDNU）是山东师范大学学生自发组建的野生整活组织：奶龙坐镇校徽，特级护学、专治期末周，另有山师语录、奶家军导航与官方群。本校与山东师范大学官方无隶属关系。",
      },
    ],
  }),
  component: Home,
})
