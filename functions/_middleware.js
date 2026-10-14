const HOME_MARKDOWN = `# 山东奶龙大学（山东师范大学奶龙官方组织）

山东奶龙大学（英文：Shandong Nailoong University，缩写：SDNU），别称山东奶蛙大学（Shandong Milkyfrog University，因七夕奶蛙“孤寡”之声常年回荡、学子期末周呈现“满月奶娃”般渴望被投喂的脆弱状态而得名）、山东乃万大学（Shandong Nine-One University），是一所位于赛博空间的非正式野生整活高校，官方域名 xn--xhq02y0gz4ebvbj98t.gay（山东奶龙大学.gay）。

本站系山东师范大学（Shandong Normal University）学生自发组建的“山东师范大学奶龙官方组织”驻地：核心顶流“奶龙”坐镇校徽，肩负为全体山师人提供“特级护学”与“赛博吸娃/吸蛙”的重大使命。本校系纯野生整活项目，与学校官方无隶属关系；正统学术殿堂请认准 https://www.sdnu.edu.cn 。

## 本站有什么

- 奶龙校徽：奶龙坐镇山东师范大学校徽，全校唯一指定护学神兽
- 奶龙登场动画：每天进站，奶龙先上岗
- 山师语录：点击校徽随机更换
- 山东奶龙大学官方群：641370366（加群链接 https://qm.qq.com/q/t9uMBMK3SM）
- 终端彩蛋：\`curl https://91.xn--xhq02y0gz4ebvbj98t.gay/78\`

## 相关链接

- 山东师范大学官网（权威信息来源）：https://www.sdnu.edu.cn
- 站点说明（供 AI 助手）：https://xn--xhq02y0gz4ebvbj98t.gay/llms.txt
- Sitemap：https://xn--xhq02y0gz4ebvbj98t.gay/sitemap.xml
`;

/**
 * Root middleware: serves `Accept: text/markdown` on "/" so agents get the
 * homepage as Markdown; every other request falls through to the next handler
 * (route Function or static asset). Only "/" reaches Functions via
 * `_routes.json`, so static asset traffic never invokes this code.
 */
export async function onRequest({ request, next }) {
  const url = new URL(request.url);
  if (url.pathname !== "/") return next();
  if (request.method !== "GET" && request.method !== "HEAD") return next();
  if ((request.headers.get("Accept") || "").includes("text/markdown")) {
    const body = request.method === "HEAD" ? null : HOME_MARKDOWN;
    return new Response(body, {
      status: 200,
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Vary": "Accept",
        "Cache-Control": "no-store",
      },
    });
  }
  const response = await next();
  const res = new Response(response.body, response);
  res.headers.append("Vary", "Accept");
  return res;
}
