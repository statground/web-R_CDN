const GRAPH_TAB_IDS = ['graph_tab_daily', 'graph_tab_monthly', 'graph_tab_yearly'];

function draw_chart(inputData, activeTabId) {
  // 1) 탭 스타일 토글
  GRAPH_TAB_IDS.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.className = (id === activeTabId) ? class_tab_active : class_tab_inactive;
  });

  // 2) 타깃 엘리먼트/인스턴스
  const el = document.getElementById('div_statistics_graph');
  if (!el) return;
  const prev = echarts.getInstanceByDom(el);
  if (prev) prev.dispose();
  const chart = echarts.init(el, null, { renderer: 'canvas' });

  // 3) 시계열 정규화(빈 기간 0으로 채움)
  const { categories, values } = normalizeMembers(inputData);

  // 4) 옵션
  const option = {
    title: {
      text: '가입자 수 추이 그래프',
      left: 'center', top: 0,
      textStyle: { fontSize: 24, fontWeight: '700' }
    },
    legend: { data: ['가입자 수'], top: 36 },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    toolbox: { right: 10, feature: { dataZoom: { yAxisIndex: 'none' }, restore: {}, saveAsImage: {} } },
    grid: { left: 60, right: 60, top: 80, bottom: 60 },
    xAxis: { type: 'category', data: categories, axisLabel: { interval: 'auto' } },
    yAxis: [{ type: 'value', name: '가입자 수' }],
    dataZoom: [{ type: 'inside', xAxisIndex: 0 }, { type: 'slider', xAxisIndex: 0 }],
    series: [{ name: '가입자 수', type: 'bar', data: values, barMaxWidth: 24 }]
  };

  chart.setOption(option);

  // 5) 렌더/리사이즈 안전장치
  requestAnimationFrame(() => chart.resize());
  window.addEventListener('resize', () => chart.resize(), { passive: true });

  // 숨김 상태였다가 보이는 경우 대비
  if (el.offsetWidth === 0 || el.offsetHeight === 0) {
    const ro = new ResizeObserver(() => {
      if (el.offsetWidth > 0 && el.offsetHeight > 0) { ro.disconnect(); chart.resize(); }
    });
    ro.observe(el);
  }
}

/* ---------- 유틸: 가입자 시계열 정규화 ---------- */
function normalizeMembers(obj) {
  // 객체 -> 정렬 배열
  const rows = Object.values(obj || {}).slice().sort((a,b)=> new Date(a.date) - new Date(b.date));
  if (rows.length === 0) return { categories: [], values: [] };

  const granularity = (rows[0].date.length === 4) ? 'year' : (rows[0].date.length === 7 ? 'month' : 'day');
  const map = new Map(rows.map(r => [r.date, r.cnt || 0]));

  const start = parseDate(rows[0].date);
  const end   = parseDate(rows[rows.length-1].date);

  const categories = [];
  const values = [];

  for (let d = new Date(start); d <= end; inc(d, granularity)) {
    const key = formatDate(d, granularity);
    categories.push(key);
    values.push(map.has(key) ? Number(map.get(key)) || 0 : 0);
  }
  return { categories, values };
}

function inc(d, g){ if(g==='year') d.setFullYear(d.getFullYear()+1); else if(g==='month') d.setMonth(d.getMonth()+1); else d.setDate(d.getDate()+1); }
function parseDate(s){ if(s.length===4) return new Date(+s,0,1); if(s.length===7){const [y,m]=s.split('-').map(Number); return new Date(y,m-1,1);} const [y,m,d]=s.split('-').map(Number); return new Date(y,m-1,d); }
function formatDate(d,g){ const p=n=>String(n).padStart(2,'0'); if(g==='year') return String(d.getFullYear()); if(g==='month') return `${d.getFullYear()}-${p(d.getMonth()+1)}`; return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}`; }
