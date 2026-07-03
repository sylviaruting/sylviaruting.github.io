from pathlib import Path

labels = {
    "calligraphy": "书法",
    "flower-bird": "花鸟",
    "landscape": "山水",
    "figure": "人物",
    "sketch": "素描",
    "oil": "油画",
    "print": "版画",
    "sculpture": "雕塑",
    "watercolor": "水彩",
    "design": "设计",
    "cover": "其他",
}

entries = [
    ("image1.jpeg", "landscape", "雪景寒林图", "2023", "793.5 × 160.3 cm", "山水画", "山水作品，以寒林雪景展现传统山水意境与空间层次。"),
    ("image2.png", "cover", "作品集封面", "2025", "—", "设计", "张汝婷绘画作品选集封面。"),
    ("image3.jpg", "cover", "个人简介", "2025", "—", "—", "深圳大学本科｜美术学国画｜张汝婷。"),
    ("image4.jpeg", "cover", "作品目录（一）", "2025", "—", "—", "书法作品、花鸟作品目录页。"),
    ("image5.jpeg", "cover", "作品目录（二）", "2025", "—", "—", "山水作品、人物作品目录页。"),
    ("image6.png", "cover", "作品目录（三）", "2025", "—", "—", "其他作品目录页。"),
    ("image7.png", "cover", "作品目录（四）", "2025", "—", "—", "作品目录总览。"),
    ("image8.jpeg", "cover", "作品目录（五）", "2025", "—", "—", "作品目录总览。"),
    (["image9.jpeg", "image10.png"], "calligraphy", "唐诗词选", "2024", "46 × 217 cm", "米芾行书", "《唐诗选录》节选自唐朝诗词，以米芾行书创作，采用横幅拼接形式展现「八面出锋」的艺术特色。指导老师：赵辉老师"),
    ("image12.png", "calligraphy", "东坡题跋", "2024", "75 × 139 cm", "褚遂良楷体", "作品内容选自《东坡题跋》，学习褚遂良楷体，以中楷形式展示；采用方块拼贴，仿古洒金纸做底，展现褚遂良艺术特色。指导老师：赵辉老师"),
    ("image13.jpeg", "calligraphy", "蜀素帖（临·局部一）", "2022", "29.7 × 240 cm", "行书", "临《蜀素帖》局部。初时只仿其欹侧之形，近来渐悟米芾「刷字」不独是快，更在随势调锋。"),
    ("image14.jpeg", "calligraphy", "蜀素帖（临·局部二）", "2022", "29.7 × 240 cm", "行书", "临《蜀素帖》局部。每遇转折处刻意放缓，学他笔锋暗换，墨痕里藏着真性情。"),
    ("image15.png", "calligraphy", "毛主席词选", "2023", "69 × 138 cm", "米芾行书", "以米芾行书笔意临创《毛主席词选》。八面出锋、沉着痛快，力求以经典之法写时代语。"),
    ("image16.png", "calligraphy", "习近平主席语录节选", "2023", "69 × 138 cm", "米芾行书", "以米芾行书笔意临创《习近平主席语录节选》。获深圳大学艺术学部「学习二十大，我想说」入围奖。"),
    ("image17.jpeg", "calligraphy", "临书谱节选（草书）", "2023", "四尺四裁", "草书", "《书谱》节选草书局部。细究笔锋往来，才懂孙过庭「草以点画为情性，使转为形质」。"),
    ("image18.jpeg", "calligraphy", "集吴昌硕石鼓文（隶书）", "2023", "四尺三裁", "隶书", "集对联：置酒张灯促华馔，天麀鸣囿乐康平。"),
    ("image19.jpeg", "calligraphy", "石州引", "2023", "四尺斗方", "草书", "集贺铸《石州引》，笔随词情起伏，笔墨间尽抒离愁婉转之韵。"),
    ("image20.png", "flower-bird", "错落珊瑚珠", "2023", "30 × 40 cm", "写意", "临吴昌硕《错落珊瑚珠》画幅中央画两株天竹，右株墨色浓，叶繁，左株赭色浅，叶稀，相映成趣，错落有致。"),
    ("image21.jpeg", "flower-bird", "没骨花鸟习作", "2023", "30 × 40 cm", "没骨画", "花鸟没骨画练习，以晕染代替勾勒，传达生命意趣。"),
    ("image22.png", "flower-bird", "红梅图", "2023", "30 × 40 cm", "写意", "临吴昌硕《红梅图》。"),
    ("image23.png", "flower-bird", "吴昌硕花卉条屏", "2023", "30 × 40 cm", "写意", "临吴昌硕花卉四条屏之一，从菊石里练习用笔轻重徐疾。"),
    ("image24.jpeg", "flower-bird", "红花春趣", "2023", "30 × 40 cm", "没骨画", "创作小品（2023）没骨画系列。师法自然，在临摹古画中体悟前人笔墨韵致。"),
    ("image25.png", "flower-bird", "花风蝶", "2023", "30 × 40 cm", "没骨画", "没骨画系列创作小品，作品以没骨绘菊，蝶舞繁花，意在表达春日悠然景致。"),
    ("image26.png", "flower-bird", "荔枝", "2023", "30 × 40 cm", "没骨画", "临摹荔枝小品，悟没骨设色，品硕果温润意趣。"),
    ("image27.jpeg", "flower-bird", "玉兰黄鹂", "2025", "50 × 60 cm", "没骨画", "花鸟小品（2025）。研习花鸟国画，以「师法自然」为核心。"),
    ("image28.jpeg", "flower-bird", "墨虾", "2025", "30 × 40 cm", "写意", "画齐白石的虾不只是对物象的简单再现，更要传达生命的意趣。"),
    ("image29.png", "flower-bird", "花期有约", "2023", "66 × 133 cm", "没骨画", "没骨画《花期有约》，以烂漫姿态铺展，鲜活又朦胧，尽显花木热烈蓬勃。"),
    ("image30.jpg", "flower-bird", "岭南风格", "2024", "33.5 × 133 cm", "没骨画", "三角梅以烂漫姿态铺展，没骨技法让花瓣粉紫如晕染开的梦；喜鹊振翅于粉调天际，传递对生活满含希望与喜悦的期许。"),
    ("image32.jpg", "landscape", "沈周《仿大痴山水图》（临·全幅）", "2025", "115.5 × 48.5 cm", "山水画", "沈周《仿大痴山水图》临摹全幅。画面气韵安宁，尽显「以山水寄心」的境界，学古学典终究是为找到自己的笔墨。"),
    ("image33.jpeg", "figure", "高原女孩", "2023", "69 × 138 cm", "中国画", "人物作品《高原女孩》。2023年参展「艺术的维度——深圳大学艺术作品交流展」。"),
    ("image34.png", "figure", "油画同学", "2023", "69 × 138 cm", "白描", "人物写生作品《油画同学》，用白描捕捉同学肖像与神态。"),
    ("image35.png", "figure", "永乐宫壁画人物（白描）", "2023", "69 × 138 cm", "白描", "白描作品《永乐宫壁画人物》，以线条表现壁画人物神韵与衣纹结构。"),
    (["image36.jpeg", "image37.jpeg"], "figure", "神骏图（临）", "2023", "87 × 37 cm", "人物绢本", "临摹（五代十国）佚名《神骏图》。人物线条流畅，衣袂飘飘似有动感；设色古朴雅致，将人物神态与画面氛围精准传达。指导老师：孔蓓"),
    ("image38.jpeg", "figure", "写意人物（一）", "2023", "69 × 138 cm", "写意人物", "写意人物临摹，以笔墨表现人物神韵与动态。"),
    ("image39.jpeg", "figure", "写意人物（二）", "2023", "—", "写意人物", "写意人物系列，注重神态捕捉与笔墨节奏。"),
    ("image40.jpeg", "figure", "写意人物（三）", "2023", "—", "写意人物", "写意人物系列，以简练笔墨传达人物性格与情境。"),
    ("image41.png", "figure", "写意人物（四）", "2023", "—", "写意人物", "写意人物系列，探索人物与留白的互动关系。"),
    ("image42.jpeg", "sketch", "写生的一角", "2021", "106 × 76 cm", "素描", "素描作品《写生的一角》，观察光影、结构与空间关系的练习。"),
    ("image43.jpeg", "oil", "油画作品（一）", "2021", "30 × 40 cm", "油画", "油画创作系列，探索色彩、造型与光影的表达。"),
    ("image44.jpeg", "oil", "油画作品（二）", "2021", "30 × 40 cm", "油画", "油画创作系列，练习色调归纳与画面构成。"),
    ("image45.jpeg", "oil", "油画作品（三）", "2021", "30 × 40 cm", "油画", "油画创作系列，表现物体质感与空间深度。"),
    ("image46.jpeg", "oil", "油画作品（四）", "2021", "30 × 40 cm", "油画", "油画创作系列，探索笔触与色彩的结合。"),
    ("image47.jpeg", "oil", "油画作品（五）", "2021", "30 × 40 cm", "油画", "油画创作系列。"),
    ("image48.jpeg", "oil", "油画作品（六）", "2021", "30 × 40 cm", "油画", "油画创作系列。"),
    ("image49.jpeg", "oil", "油画作品（七）", "2021", "30 × 40 cm", "油画", "油画创作系列。"),
    ("image50.png", "print", "版画作品（一）", "2022", "A4", "版画", "版画创作系列，以刀味与印痕传递艺术语言。"),
    ("image51.png", "print", "版画作品（二）", "2022", "A4", "版画", "版画创作系列，探索黑白对比与线条韵律。"),
    ("image52.jpeg", "print", "版画作品（三）", "2022", "A4", "版画", "版画创作系列，练习刻刀语言与画面构成。"),
    ("image53.png", "print", "版画作品（四）", "2022", "A4", "版画", "版画创作系列。"),
    ("image54.png", "print", "版画作品（五）", "2022", "A4", "版画", "版画创作系列。"),
    ("image55.png", "print", "版画作品（六）", "2022", "A4", "版画", "版画创作系列。"),
    (["image56.jpeg", "image57.jpeg", "image58.jpeg"], "sculpture", "雕塑作品（一）", "2022", "—", "雕塑", "雕塑创作系列，从立体空间理解形态、体量与结构；练习体积感与空间关系；探索材料与造型的表达。"),
    (["image59.jpeg", "image60.jpeg", "image61.jpeg", "image62.jpeg"], "sculpture", "雕塑作品（二）", "2022", "—", "雕塑", "雕塑创作系列。"),
    ("image63.jpeg", "watercolor", "奶奶家的柿子", "2020", "39 × 54 cm", "水彩", "水彩作品《奶奶家的柿子》，以透明水彩捕捉生活中温暖细腻的瞬间。"),
    ("image64.jpeg", "watercolor", "东山岛上的房子", "2021", "19 × 27 cm", "水彩", "水彩作品《东山岛上的房子》，记录东山岛的建筑与地域氛围。"),
    ("image65.jpeg", "watercolor", "大学课堂的写生静物", "2021", "39 × 45 cm", "水彩", "水彩作品《大学课堂的写生静物》，练习观察、构图与色彩控制。"),
    ("image66.jpeg", "design", "敦煌壁画书籍排版", "2021", "", "版式设计 · CDR", "以敦煌壁画为历史背景，制作关于敦煌壁画的书籍排版效果图。"),
    ("image67.jpeg", "design", "书籍版式设计", "2021", "", "版式设计 · CDR", "版式设计练习，CDR 软件制作。"),
    (["image68.jpeg", "image69.jpeg"], "design", "日落计划 · 音乐会海报", "2024", "—", "海报设计 · CDR", "以「日落计划」为名的音乐会海报设计，寓意青春应去追寻梦想。"),
    (["image70.jpeg", "image71.jpeg"], "design", "LOGO 设计", "2021", "—", "LOGO · CDR", "LOGO 设计作品，探索图形语言与视觉识别。"),
    ("image72.png", "design", "IP 形象设计（一）", "2023", "—", "IP · LOGO · 排版", "互联网+项目 IP 形象设计、LOGO 及排版设计。"),
    ("image76.png", "design", "IP 形象设计（二）", "2023", "—", "IP · LOGO · 排版", "互联网+项目团队相关视觉设计。"),
    ("image73.png", "design", "华商律所文创设计", "2023", "—", "IP · LOGO · 排版", "IP 形象与品牌视觉设计。"),
    (["image74.png", "image75.png"], "design", "华商律所logo", "2023", "—", "LOGO · procreate", "华商律所 LOGO 设计方案。"),
    ("image77.jpeg", "design", "互联网+项目团队合照", "2023", "—", "摄影 · 设计", "互联网+项目团队合照，记录项目合作与创作过程。"),
]

AWARDS = [
    "2026年入展「笔底清风.汕头市青年扇面书法小品网络展」",
    "第二届「艺蕴中国」艺术教育创新成果展暨新时代学校美育浸润行动成果展 · 金奖",
    "2023年「国青杯」全国高校艺术设计作品展 · 二等奖",
    "第九届中国国际「互联网+」大学生创新创业大赛 · 省级铜奖",
    "「筑梦扬帆正青春」深圳、珠海、香港、澳门四地大学生优秀书法联展 · 三等奖",
    "深圳大学艺术学部「学习二十大，我想说」书法作品 · 入围奖",
    "深圳大学校庆40周年「与古为徒」百幅教学临摹作品展 · 入选",
    "2021年第二届「艺术之星」全国书画大赛《我是党员》· 银奖",
    "2023年《高原女孩》参展「艺术的维度」深圳大学艺术作品交流展",
]


def js_string(value: str) -> str:
    return "'" + value.replace("\\", "\\\\").replace("'", "\\'") + "'"


def normalize_images(img: str | list[str]) -> list[str]:
    if isinstance(img, str):
        return [img]
    return list(img)


def main() -> None:
    assert len(entries) == 65

    lines = ["const AWARDS = ["]
    for award in AWARDS:
        lines.append(f"  {js_string(award)},")
    lines.append("];")
    lines.append("")
    lines.append("const WORKS = [")

    for index, (img, cat, title, year, size, medium, desc) in enumerate(entries):
        imgs = normalize_images(img)
        work_id = Path(imgs[0]).stem.replace(".", "-")
        if len(imgs) > 1:
            work_id = f"{cat}-{index}"
        paths = [f"assets/images/{name}" for name in imgs]
        comma = "," if index < len(entries) - 1 else ""
        block = [
            "  {",
            f"    id: {js_string(work_id)},",
            f"    title: {js_string(title)},",
            f"    category: {js_string(cat)},",
            f"    categoryLabel: {js_string(labels[cat])},",
            f"    year: {js_string(year)},",
            f"    size: {js_string(size)},",
            f"    medium: {js_string(medium)},",
            f"    image: {js_string(paths[0])},",
        ]
        if len(paths) > 1:
            images_js = ", ".join(js_string(path) for path in paths)
            block.append(f"    images: [{images_js}],")
        block.extend(
            [
                f"    description: {js_string(desc)},",
                f"  }}{comma}",
            ]
        )
        lines.extend(block)

    lines.append("];")
    lines.append("")

    out = Path(__file__).resolve().parents[1] / "js" / "works.js"
    out.write_text("\n".join(lines), encoding="utf-8")
    print(f"Wrote {len(entries)} works to {out}")


if __name__ == "__main__":
    main()
