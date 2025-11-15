async function get_myinfo_payment_content() {

	function formatAmount(amt) {
		if (amt === null || amt === undefined) return '';
		const n = Number(amt) || 0;
		return n.toLocaleString('ko-KR') + '원';
	}

	function StatusBadge(props) {
		const status = props.status || '';
		let label = status;
		let cls = "inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ";

		if (status === "DONE") {
			label = "결제 완료";
			cls += "bg-emerald-50 text-emerald-700";
		} else if (status === "ABORTED") {
			label = "결제 취소";
			cls += "bg-red-50 text-red-600";
		} else {
			cls += "bg-gray-100 text-gray-500";
		}

		return <span class={cls}>{label}</span>;
	}

	function PaymentItem(props) {
		const d = props.data;

		const title = d.product_name || "기타 결제";
		const method = d.method || "";
		const created = d.created_at || "";
		const amountStr = formatAmount(d.amount);

		// 상세 페이지 링크 (없으면 '#')
		let href = "#";
		if (d.status === "DONE") {
			href = "/intro/membership/result/?orderId=" +
				   encodeURIComponent(d.order_id || "") +
				   "&amount=" + encodeURIComponent(d.amount || 0);
		}

		return (
			<a href={href}
			   target={href === "#" ? "_self" : "_blank"}
			   class="group flex flex-col w-full border-b border-gray-100 last:border-b-0 py-3">
				<div class="flex items-center justify-between mb-1">
					<div class="flex flex-col">
						<p class="text-sm font-medium text-gray-900 group-hover:text-blue-600">
							{title}
						</p>
						<p class="text-xs text-gray-400 mt-0.5">
							{created} · {method}
						</p>
					</div>
					<div class="flex flex-col items-end gap-1">
						<p class="text-sm font-semibold text-gray-900">{amountStr}</p>
						<StatusBadge status={d.status} />
					</div>
				</div>
			</a>
		);
	}

	function PaymentList(props) {
		const listAll = Object.values(props.data || {});
		if (!listAll.length) {
			return <Col_nothing />;
		}

		return (
			<div class="flex flex-col w-full">
				{listAll.map(function (row, idx) {
					return <PaymentItem key={idx} data={row} />;
				})}
			</div>
		);
	}

	function Col_nothing() {
		return (
			<div class="flex flex-col justify-center items-start w-full py-4 text-sm text-gray-500">
				<p>결제 내역이 없습니다.</p>
			</div>
		);
	}

	function Col_error() {
		return (
			<div class="flex flex-col justify-center items-start w-full py-4 text-sm text-red-500">
				<p>결제 내역을 불러오는 중 오류가 발생했습니다.</p>
			</div>
		);
	}

	let tempdata = null;
	try {
		const res = await fetch("/account/ajax_get_myinfo_payment/");
		if (!res.ok) {
			ReactDOM.render(<Col_error />, document.getElementById("div_tab_payment_content"));
			return;
		}
		tempdata = await res.json();
	} catch (e) {
		ReactDOM.render(<Col_error />, document.getElementById("div_tab_payment_content"));
		return;
	}

	if (!tempdata || !tempdata.count || tempdata.count["0"].cnt === 0) {
		ReactDOM.render(<Col_nothing />, document.getElementById("div_tab_payment_content"));
	} else {
		ReactDOM.render(
			<PaymentList data={tempdata.list} />,
			document.getElementById("div_tab_payment_content")
		);
	}
}
