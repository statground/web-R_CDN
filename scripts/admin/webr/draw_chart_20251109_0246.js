function draw_chart(inputData, tab_id_active, tab_id_inactive) {
	// 탭 상태 반영 (전역에 class_tab_active / class_tab_inactive 존재 가정)
	if (tab_id_active && document.getElementById(tab_id_active)) {
		document.getElementById(tab_id_active).className = class_tab_active;
	}
	if (tab_id_inactive && document.getElementById(tab_id_inactive)) {
		document.getElementById(tab_id_inactive).className = class_tab_inactive;
	}

	// 대상 DOM
	var el = document.getElementById('div_statistics_graph');
	if (!el) { console.warn('div_statistics_graph element not found'); return; }

	// 기존 인스턴스 정리 후 재생성
	var prev = echarts.getInstanceByDom(el);
	if (prev) prev.dispose();
	var chart = echarts.init(el, null, { renderer: 'canvas' });

	// 입력 객체 -> 정렬된 배열
	// (키 "0","1",... 형태이므로 values 후 날짜 오름차순 정렬)
	var rows = Object.values(inputData || {});
	rows.sort(function(a, b){ return new Date(a.date) - new Date(b.date); });

	// 카테고리/시리즈 데이터 구성
	var categories = rows.map(function(d){ return d.date; });
	var connects    = rows.map(function(d){ return d.cnt_connect || 0; });
	var users       = rows.map(function(d){ return d.cnt_user || 0; });

	// 옵션
	var option = {
		title: {
		  text: '이용 추이 그래프',
		  left: 'center',
		  top: 0,
		  textStyle: { fontSize: 24, fontWeight: '700' }
		},
		legend: {
		  data: ['접속 횟수', '이용자 수'],
		  top: 36
		},
		tooltip: {
		  trigger: 'axis',
		  axisPointer: { type: 'shadow' }
		},
		toolbox: {
		  right: 10,
		  feature: {
			dataZoom: { yAxisIndex: 'none' },
			restore: {},
			saveAsImage: {}
		  }
		},
		grid: { left: 60, right: 60, top: 80, bottom: 60 },
		xAxis: {
		  type: 'category',
		  data: categories,
		  axisLabel: {
			// 날짜 문자열 그대로 표시 (길면 자동 간격)
			interval: 'auto'
		  }
		},
		yAxis: [
		  { type: 'value', name: '접속 횟수' },
		  { type: 'value', name: '이용자 수' }
		],
		dataZoom: [
		  { type: 'inside', xAxisIndex: 0, zoomOnMouseWheel: true, moveOnMouseMove: true },
		  { type: 'slider', xAxisIndex: 0 }
		],
		series: [
		  {
			name: '접속 횟수',
			type: 'bar',
			yAxisIndex: 0,
			data: connects,
			barMaxWidth: 20
		  },
		  {
			name: '이용자 수',
			type: 'bar',
			yAxisIndex: 1,
			data: users,
			barMaxWidth: 20
		  }
		]
	};

	chart.setOption(option);

	// 반응형
	window.addEventListener('resize', function() { chart.resize(); }, { passive: true });
}