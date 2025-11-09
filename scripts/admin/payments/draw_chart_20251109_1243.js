const GRAPH_TAB_IDS = ['graph_tab_daily', 'graph_tab_monthly', 'graph_tab_yearly'];

function draw_chart(inputData, activeTabId) {
  // 탭 스타일 토글
  GRAPH_TAB_IDS.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.className = (id === activeTabId) ? class_tab_active : class_tab_inactive;
  });

  // 대상 엘리먼트
  const el = document.getElementById('div_statistics_graph');
  if (!el) return;

  // 기존 인스턴스 정리 후 재생성
  const prev = echarts.getInstanceByDom(el);
  if (prev) prev.dispose();
  const chart = echarts.init(el, null, { renderer: 'canvas' });

  // 입력 -> 배열 정렬
  const rows = Object.values(inputData || {}).sort((a, b) => new Date(a.date) - new Date(b.date));
  const categories = rows.map(d => d.date);
  const amounts    = rows.map(d => d.amt || 0); // 결제액
  const counts     = rows.map(d => d.cnt || 0); // 결제 건 수

  const option = {
    title: { text: '결제 추이 그래프', left: 'center', top: 0, textStyle: { fontSize: 24, fontWeight: '700' } },
    legend: { data: ['결제액', '결제 건 수'], top: 36 },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    toolbox: { right: 10, feature: { dataZoom: { yAxisIndex: 'none' }, restore: {}, saveAsImage: {} } },
    grid: { left: 60, right: 60, top: 80, bottom: 60 },
    xAxis: { type: 'category', data: categories, axisLabel: { interval: 'auto' } },
    yAxis: [
      { type: 'value', name: '결제액' },
      { type: 'value', name: '결제 건 수' }
    ],
    dataZoom: [
      { type: 'inside', xAxisIndex: 0, zoomOnMouseWheel: true, moveOnMouseMove: true },
      { type: 'slider', xAxisIndex: 0 }
    ],
    series: [
      { name: '결제액',   type: 'bar', yAxisIndex: 0, data: amounts, barMaxWidth: 28 },
      { name: '결제 건 수', type: 'bar', yAxisIndex: 1, data: counts,  barMaxWidth: 28 }
    ]
  };

  chart.setOption(option);

  // 보이면 즉시/창 리사이즈 대응
  requestAnimationFrame(() => chart.resize());
  window.addEventListener('resize', () => chart.resize(), { passive: true });

  // 숨김 상태 초기화 대비
  if (el.offsetWidth === 0 || el.offsetHeight === 0) {
    const ro = new ResizeObserver(() => {
      if (el.offsetWidth > 0 && el.offsetHeight > 0) {
        ro.disconnect();
        chart.resize();
      }
    });
    ro.observe(el);
  }
}