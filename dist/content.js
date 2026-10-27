/* 在这里维护作品标题、分类和成长记录。路径均相对于 index.html。 */
window.PORTFOLIO = {
  projects: [
    { id: 'film-1', title: 'AIGC 叙事短片', category: 'camp', kind: 'SHORT FILM', label: '短片创作 / 训练营 AIGC', original: 'AIGC短片 / ai成片.mp4', description: '训练营短片作品。可在「想法」章节查看随作品提供的创作工作流。', workflow: true },
    { id: 'film-18', title: '仕女失踪记', category: 'product', kind: 'AI STORY', label: '叙事探索 / 产品 AIGC', original: '产品创意类 / AI—仕女失踪记.mp4', description: '来自「产品创意类」的 AIGC 叙事作品《仕女失踪记》。' },
    { id: 'film-19', title: '豆乳味卸妆膏 · 01', category: 'product', kind: 'PRODUCT FILM', label: '产品创意 / 豆乳味卸妆膏', original: '产品创意类 / EM测587-卸妆膏【豆乳味】-ai.mp4', description: '豆乳味卸妆膏产品创意影像，版本 587。' },
    { id: 'film-7', title: '让画面动起来 · 06', category: 'product', kind: 'LIVE VISUAL', label: '动态画面 / LIVE 图实验', original: 'live图 / 51.mp4', description: 'Live 图动态视觉作品，原始素材编号 51。' },
    { id: 'film-20', title: '豆乳味卸妆膏 · 02', category: 'product', kind: 'PRODUCT FILM', label: '产品创意 / 豆乳味卸妆膏', original: '产品创意类 / EM测588-卸妆膏【豆乳味】-ai.mp4', description: '豆乳味卸妆膏产品创意影像，版本 588。' },
    { id: 'film-16', title: '产品视觉实验 · 58', category: 'product', kind: 'VISUAL EXPERIMENT', label: '创意影像 / 产品 AIGC', original: '产品创意类 / 58.mp4', description: '产品创意系列作品，原始素材编号 58。' },
    ...[
      ['film-8','13'], ['film-9','21'], ['film-10','26'], ['film-11','03'],
      ['film-12','47'], ['film-13','48'], ['film-14','49'], ['film-15','56'], ['film-17','07']
    ].map(([id, number]) => ({ id, title: '产品视觉实验 · ' + number, category: 'product', kind: 'VISUAL EXPERIMENT', label: '创意影像 / 产品 AIGC', original: '产品创意类 / ' + Number(number) + '.mp4', description: '产品创意系列作品，原始素材编号 ' + Number(number) + '。' })),
    { id: 'film-21', title: '产品视觉实验 · 特别篇', category: 'product', kind: 'VISUAL EXPERIMENT', label: '创意影像 / 产品 AIGC', original: '产品创意类 / da48bdc9cc1687eb757397141748d4c5.mp4', description: '产品创意系列中的一支视觉实验短片。' },
    ...[['film-2','01','10'],['film-3','02','11'],['film-4','03','12'],['film-5','04','17'],['film-6','05','32']].map(([id,number,original]) => ({ id, title: '让画面动起来 · ' + number, category: 'product', kind: 'LIVE VISUAL', label: '动态画面 / LIVE 图实验', original: 'live图 / ' + original + '.mp4', description: 'Live 图动态视觉作品，原始素材编号 ' + original + '。' }))
  ],
  stages: [
    { kicker: '从一个「如果」开始', title: '让好奇心先走一步。', description: '这里将记录第一次接触 AIGC 的契机，以及最初想用它完成的创作。' },
    { kicker: '在每一次尝试里积累', title: '把想法做出来，再做一遍。', description: '这里将记录训练营中的练习、产品创意中的尝试，以及值得留下的失败与发现。' },
    { kicker: '下一步，还可以是什么', title: '新的形状，正在发生。', description: '这里将记录阶段复盘、接下来想探索的方向，以及持续更新的创作计划。' }
  ]
};
