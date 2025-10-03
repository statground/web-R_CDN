async function request_order_id(product_name = "", method = "") {
	const productIds = {
		"정회원": "3fe38b90-6cf9-45de-b732-2933ef100347",
		"VIP회원": "ac3d82de-e6a5-4a48-8029-5f59d22749fa", 
		"기관회원": "356e84f3-211c-4ac7-8aee-ca6f75017134"
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