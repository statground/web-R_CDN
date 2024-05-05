async function request_order_id(product_name = "", method = "") {
	let product_id = null
	if (product_name == "정회원") {
		product_id = "e2a47288-7384-11ed-a1eb-0242ac120002"
	} else if (product_name == "VIP회원") {
		product_id = "f24deb88-7384-11ed-a1eb-0242ac120002"
	} else if (product_name == "기관회원") {
		product_id = "247d7ba0-7385-11ed-a1eb-0242ac120002"
	}

	let result_url = "https://" + window.location.host + "/intro/membership/result/"

	function func_billing_card(clientk_key, orderID, orderName, amount) {
		var tossPayments = TossPayments(clientk_key)
		
		tossPayments.requestPayment('카드', {
			amount: amount, orderId: orderID, orderName: orderName, customerName: data.realname,
			successUrl: result_url, failUrl: result_url,
		})
	}
	
	function func_billing_va(clientk_key, orderID, orderName, amount) {
		var tossPayments = TossPayments(clientk_key)
		
		tossPayments.requestPayment('가상계좌', {
			amount: amount, orderId: orderID, orderName: orderName, customerName: data.realname,
			successUrl: result_url, failUrl: result_url,
			validHours: 24, cashReceipt: {type: '소득공제',},
		})
	}
	
	function func_billing_account(clientk_key, orderID, orderName, amount) {
		var tossPayments = TossPayments(clientk_key)
		
		tossPayments.requestPayment('계좌이체', {
			amount: amount, orderId: orderID, orderName: orderName, customerName: data.realname,
			successUrl: result_url, failUrl: result_url,
		})
	}
	
	function func_billing_mobile(clientk_key, orderID, orderName, amount) {
		var tossPayments = TossPayments(clientk_key)
		
		tossPayments.requestPayment('휴대폰', {
			amount: amount, orderId: orderID, orderName: orderName, customerName: data.realname,
			successUrl: result_url, failUrl: result_url,
		})
	}
	
	function func_billing_voucher(clientk_key, orderID, orderName, amount) {
		var tossPayments = TossPayments(clientk_key)
		
		tossPayments.requestPayment('도서문화상품권', {
			amount: amount, orderId: orderID, orderName: orderName, customerName: data.realname,
			successUrl: result_url, failUrl: result_url,
		})
	}

	const tempdata = await fetch("/ajax_request_order_id/?product_id=" + product_id + "&type=membership")
						.then(res=> { return res.json(); })
						.then(res=> { return res; });

	// 신용카드
	if (method == "카드") {
		func_billing_card(tempdata.client_key, tempdata.orderID, tempdata.product_name, tempdata.amount)
	} else if (method == "가상계좌") {
		func_billing_va(tempdata.client_key, tempdata.orderID, tempdata.product_name, tempdata.amount)
	} else if (method == "계좌이체") {
		func_billing_account(tempdata.client_key, tempdata.orderID, tempdata.product_name, tempdata.amount)
	}
}