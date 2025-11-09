const GRAPH_TAB_IDS = ['graph_tab_daily', 'graph_tab_monthly', 'graph_tab_yearly'];

function draw_chart(inputData, activeTabId) {
  // 탭 스타일 토글
  GRAPH_TAB_IDS.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.className = (id === activeTabId) ? class_tab_active : class_tab_inactive;
  });

  // 타겟 엘리먼트
  const el = document.getElementById('div_statistics_graph');
  if (!el) return;

  // 기존 인스턴스 제거 후 재생성
  const prev = echarts.getInstanceByDom(el);
  if (prev) prev.dispose();
  const chart = echarts.init(el, null, { renderer: 'canvas' });

  // 입력 데이터 -> 정렬된 배열
  const rows = Object.values(inputData || {}).sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  const categories = rows.map(d => d.date);
  const visitors   = rows.map(d => d.avg_visitor || 0);     // 방문자 수
  const pageviews  = rows.map(d => d.cnt_pageview || 0);    // 페이지 뷰

  const option = {
    title: {
      text: '방문 추이 그래프',
      left: 'center',
      top: 0,
      textStyle: { fontSize: 24, fontWeight: '700' }
    },
    legend: { data: ['방문자 수', '페이지 뷰'], top: 36 },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    toolbox: {
      right: 10,
      feature: { dataZoom: { yAxisIndex: 'none' }, restore: {}, saveAsImage: {} }
    },
    grid: { left: 60, right: 60, top: 80, bottom: 60 },
    xAxis: { type: 'category', data: categories, axisLabel: { interval: 'auto' } },
    yAxis: [
      { type: 'value', name: '방문자 수' },
      { type: 'value', name: '페이지 뷰' }
    ],
    dataZoom: [
      { type: 'inside', xAxisIndex: 0, zoomOnMouseWheel: true, moveOnMouseMove: true },
      { type: 'slider', xAxisIndex: 0 }
    ],
    series: [
      { name: '방문자 수', type: 'bar', yAxisIndex: 0, data: visitors, barMaxWidth: 28 },
      { name: '페이지 뷰', type: 'bar', yAxisIndex: 1, data: pageviews, barMaxWidth: 28 }
    ]
  };

  chart.setOption(option);

  // 보이는 순간/리사이즈 안전장치
  requestAnimationFrame(() => chart.resize());
  window.addEventListener('resize', () => chart.resize(), { passive: true });

  // 컨테이너가 숨김 상태였다가 보일 수도 있는 UI 대비
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
