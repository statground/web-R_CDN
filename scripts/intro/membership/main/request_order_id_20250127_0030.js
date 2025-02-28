async function request_order_id(product_name = "", method = "") {
	const productIds = {
		"정회원": "e2a47288-7384-11ed-a1eb-0242ac120002",
		"VIP회원": "f24deb88-7384-11ed-a1eb-0242ac120002", 
		"기관회원": "247d7ba0-7385-11ed-a1eb-0242ac120002"
	};

	const result_url = "https://" + window.location.host + "/intro/membership/result/";
	const product_id = productIds[product_name];

	const paymentMethods = {
		'카드': {
			options: {
				amount: null, orderId: null, orderName: null, customerName: data.realname, successUrl: result_url, failUrl: result_url
			}
		},
		'가상계좌': {
			options: {
				amount: null, orderId: null, orderName: null, customerName: data.realname, successUrl: result_url, failUrl: result_url, validHours: 24, cashReceipt: {type: '소득공제'}
			}
		},
		'계좌이체': {
			options: {
				amount: null, orderId: null, orderName: null, customerName: data.realname, successUrl: result_url, failUrl: result_url
			}
		}
	};

	const tempdata = await fetch("/ajax_request_order_id/?product_id=" + product_id + "&type=membership")
						   .then(res => res.json());

	if (method in paymentMethods) {
		const tossPayments = TossPayments(tempdata.client_key);
		const options = paymentMethods[method].options;
		options.amount = tempdata.amount;
		options.orderId = tempdata.orderID;
		options.orderName = tempdata.product_name;
		
		tossPayments.requestPayment(method, options);
	}
}