const GRAPH_TAB_IDS = ['graph_tab_daily', 'graph_tab_monthly', 'graph_tab_yearly'];

function draw_chart(inputData, activeTabId) {
  // 탭 스타일 토글
  GRAPH_TAB_IDS.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.className = (id === activeTabId) ? class_tab_active : class_tab_inactive;
  });

  const el = document.getElementById('div_statistics_graph');
  if (!el) return;

  // 인스턴스 정리
  const prev = echarts.getInstanceByDom(el);
  if (prev) prev.dispose();

  const chart = echarts.init(el, null, { renderer: 'canvas' });

  // 데이터 정렬
  const rows = Object.values(inputData || {}).sort((a, b) => new Date(a.date) - new Date(b.date));
  const categories = rows.map(d => d.date);
  const connects   = rows.map(d => d.cnt_connect || 0);
  const users      = rows.map(d => d.cnt_user || 0);

  const option = {
    title: { text: '이용 추이 그래프', left: 'center', top: 0, textStyle: { fontSize: 24, fontWeight: '700' } },
    legend: { data: ['접속 횟수', '이용자 수'], top: 36 },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    toolbox: { right: 10, feature: { dataZoom: { yAxisIndex: 'none' }, restore: {}, saveAsImage: {} } },
    grid: { left: 60, right: 60, top: 80, bottom: 60 },
    xAxis: { type: 'category', data: categories },
    yAxis: [{ type: 'value', name: '접속 횟수' }, { type: 'value', name: '이용자 수' }],
    dataZoom: [{ type: 'inside', xAxisIndex: 0 }, { type: 'slider', xAxisIndex: 0 }],
    series: [
      { name: '접속 횟수', type: 'bar', yAxisIndex: 0, data: connects, barMaxWidth: 20 },
      { name: '이용자 수', type: 'bar', yAxisIndex: 1, data: users, barMaxWidth: 20 }
    ]
  };

  chart.setOption(option);

  // 보였다가 그릴 수도 있으니 resize 안전 장치
  requestAnimationFrame(() => chart.resize());
  window.addEventListener('resize', () => chart.resize(), { passive: true });
}