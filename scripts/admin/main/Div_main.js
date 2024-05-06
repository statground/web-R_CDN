function Div_main(props) {    
	return (
		<div class="grid grid-cols-12 md:grid-cols-1 justify-center item-center w-full px-[100px] py-[20px] md:px-[10px] md:grid-cols-1">
			<Div_operation_menu />

			<div class="col-span-10 md:grid-cols-1 justify-center item-center">
				<div id="div_statistics_usage" name="div_statistics_usage"
					class="w-full bg-white border border-gray-200 rounded-lg shadow">
					<div class="p-4 bg-white rounded-lg md:p-8 text-center animate-pulse">
						<Div_sub_title title={"이용 현황"} />
						<dl class="grid grid-cols-3 w-full md:grid-cols-1 gap-8 p-4 mx-auto text-gray-900 md:p-8">
							<Div_sub_card_skeleton title={"일 평균 페이지 뷰"} />
							<Div_sub_card_skeleton title={"일 평균 접속자 수"} />
							<Div_sub_card_skeleton title={"이번 달 가입자 수"} />
						</dl>
					</div>
				</div>
			
				<div id="div_statistics_payments" name="div_statistics_payments"
					class="w-full bg-white border border-gray-200 rounded-lg shadow">
					<div class="p-4 bg-white rounded-lg md:p-8 text-center animate-pulse">
						<Div_sub_title title={"결제 현황"} />
						<dl class="grid grid-cols-3 w-full md:grid-cols-1 gap-8 pt-8 mx-auto text-gray-900 md:pt-4">
							<Div_sub_card_skeleton title={"총 결제"} />
							<Div_sub_card_skeleton title={"회원 업그레이드 결제"} />
							<Div_sub_card_skeleton title={"세미나 결제"} />
						</dl>
						<dl class="grid grid-cols-5 w-full md:grid-cols-1 gap-8 pt-8 mx-auto text-gray-900 md:pt-4">
							<Div_sub_card_skeleton title={"부가세 (10%)"} />
							<Div_sub_card_skeleton title={"토스페이먼츠 수수료 (3.63%)"} />
							<Div_sub_card_skeleton title={"통계마당 수수료 (10%)"} />
							<Div_sub_card_skeleton title={"기타소득 세금 (8.8%)"} />
							<Div_sub_card_skeleton title={"정산액"} />
						</dl>
					</div>
				</div>
			</div>
		</div>
	)
}