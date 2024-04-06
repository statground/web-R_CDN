function set_main() {
	function Div_main() {
		let class_div_ol = "text-md text-gray-500 space-y-4"
		let class_ol = "space-y-2 text-gray-500 list-decimal list-inside"
		let class_ul = "pl-5 space-y-1 list-disc list-inside"
		

		function Div_title(props) {
			return (
				<h3 class="text-lg font-medium text-gray-900">
					{props.title}
				</h3>                    
			)
		}

		return (
			<section class="bg-white">
				<div class="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
					<div class="mx-auto max-w-screen-lg text-center">
						<h2 class="mb-2 text-4xl tracking-tight font-extrabold text-gray-900">서비스 이용약관</h2>
					</div>
					
					<div class="flex flex-col pt-8 text-left border-t border-gray-200 space-y-8">
						<div class="px-4">
							<Div_title title={"제1조. 목적"} />
							<div class={class_div_ol}>
								<ol class={class_ol}>
									<li>
										이 약관은 주식회사 통계마당(전자상거래 사업자)가 운영하는 통계마당(이하 Web-R이라 한다)에서 제공하는 인터넷 관련 서비스(이하 “서비스”라 한다)를 이용함에 있어 Web-R과 이용자의 권리, 의무 및 책임 사항을 규정함을 목적으로 합니다.<br/>
										※「PC통신, 무선 등을 이용하는 전자상거래에 대해서도 그 성질에 반하지 않는 한 이 약관을 준용합니다.」
									</li>
								 </ol>
							</div>
						</div>


						<div class="px-4">
							<Div_title title={"제2조. 정의"} />
							<div class={class_div_ol}>
								<ol class={class_ol}>
									<li>
										Web-R이란 주식회사 통계마당이 재화 또는 용역(이하 “재화 등”이라 함)을 이용자에게 제공하기 위하여 컴퓨터 등 정보통신 설비를 이용하여 재화 등을 거래할 수 있도록 설정한 가상의 영업장을 말하며, 아울러 Web-R을 운영하는 사업자의 의미로도 사용합니다.
									</li>
									<li>
										“이용자”란 Web-R에 접속하여 이 약관에 따라 Web-R이 제공하는 서비스를 받는 회원 및 비회원을 말합니다.
									</li>
									<li>
										‘회원’이라 함은 Web-R에 회원 등록을 한 자로서, 계속적으로 Web-R이 제공하는 서비스를 이용할 수 있는 자를 말합니다.
									</li>
									<li>
										‘비회원’이라 함은 회원에 가입하지 않고 Web-R이 제공하는 서비스를 이용하는 자를 말합니다.
									</li>
								 </ol>
							</div>
						</div>


						<div class="px-4">
							<Div_title title={"제3조. 약관 등의 명시와 설명 및 개정"} />
							<div class={class_div_ol}>
								<ol class={class_ol}>
									<li>
										Web-R은 이 약관의 내용과 상호 및 대표자 성명, 영업소 소재지 주소(소비자의 불만을 처리할 수 있는 곳의 주소를 포함), 전화번호, 모사전송번호, 전자우편주소, 사업자등록번호, 통신판매업 신고번호, 개인정보관리책임자등을 이용자가 쉽게 알 수 있도록 Web-R의 초기 서비스 화면(전면)에 게시합니다. 다만, 약관의 내용은 이용자가 연결 화면을 통하여 볼 수 있도록 할 수 있습니다.
									</li>
									<li>
										Web-R은 이용자가 약관에 동의하기에 앞서 약관에 정하여져 있는 내용 중 청약 철회․ 배송 책임․ 환불 조건 등과 같은 중요한 내용을 이용자가 이해할 수 있도록 별도의 연결 화면 또는 팝업 화면 등을 제공하여 이용자의 확인을 구하여야 합니다.
									</li>
									<li>
										Web-R은 「전자상거래 등에서의 소비자보호에 관한 법률」, 「약관의 규제에 관한 법률」, 「전자문서 및 전자거래기본법」, 「전자금융거래법」, 「전자서명법」, 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」, 「방문판매 등에 관한 법률」, 「소비자기본법」 등 관련 법을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다.
									</li>
									<li>
										Web-R이 약관을 개정할 경우에는 적용 일자 및 개정 사유를 명시하여 현행 약관과 함께 Web-R의 초기 화면에 그 적용 일자 7일 이전부터 적용 일자 전 일까지 공지합니다. 다만, 이용자에게 불리하게 약관 내용을 변경하는 경우에는 최소한 30일 이상의 사전 유예 기간을 두고 공지합니다. 이 경우 Web-R은 개정 전 내용과 개정 후 내용을 명확하게 비교하여 이용자가 알기 쉽도록 표시합니다. 
									</li>
									<li>
										Web-R이 약관을 개정할 경우에는 그 개정 약관은 그 적용 일자 이후에 체결되는 계약에만 적용되고 그 이전에 이미 체결된 계약에 대해서는 개정 전의 약관 조항이 그대로 적용됩니다. 다만 이미 계약을 체결한 이용자가 개정 약관 조항의 적용을 받기를 원하는 뜻을 제 3항에 의한 개정 약관의 공지 기간 내에 Web-R에 송신하여 Web-R의 동의를 받은 경우에는 개정 약관 조항이 적용됩니다.
									</li>
									<li>
										이 약관에서 정하지 아니한 사항과 이 약관의 해석에 관하여는 전자상거래 등에서의 소비자보호에 관한 법률, 약관의 규제 등에 관한 법률, 공정거래위원회가 정하는 전자상거래 등에서의 소비자 보호 지침 및 관계 법령 또는 관례에 따릅니다.
									</li>
								 </ol>
							</div>
						</div>


						<div class="px-4">
							<Div_title title={"제4조. 서비스의 제공 및 변경"} />
							<div class={class_div_ol}>
								<ol class={class_ol}>
									<li>
										Web-R은 다음과 같은 업무를 수행합니다.
										<ul class={class_ul}>
											<li>
												재화 또는 용역에 대한 정보 제공 및 구매 계약의 체결
											</li>
											<li>
												구매 계약이 체결된 재화 또는 용역의 배송
											</li>
											<li>
												기타 Web-R이 정하는 업무
											</li>
										</ul>
									</li>
									<li>
										Web-R은 재화 또는 용역의 품절 또는 기술적 사양의 변경 등의 경우에는 장차 체결되는 계약에 의해 제공할 재화 또는 용역의 내용을 변경할 수 있습니다. 이 경우에는 변경된 재화 또는 용역의 내용 및 제공 일자를 명시하여 현재의 재화 또는 용역의 내용을 게시한 곳에 즉시 공지합니다.
									</li>
									<li>
										Web-R이 제공하기로 이용자와 계약을 체결한 서비스의 내용을 재화 등의 품절 또는 기술적 사양의 변경 등의 사유로 변경할 경우에는 그 사유를 이용자에게 통지 가능한 주소로 즉시 통지합니다.
									</li>
									<li>
										전 항의 경우 Web-R은 이로 인하여 이용자가 입은 손해를 배상합니다. 다만, Web-R이 고의 또는 과실이 없음을 입증하는 경우에는 그러하지 아니합니다.
									</li>
								 </ol>
							</div>
						</div>


						<div class="px-4">
							<Div_title title={"제5조. 서비스의 중단"} />
							<div class={class_div_ol}>
								<ol class={class_ol}>
									<li>
										Web-R은 컴퓨터 등 정보통신 설비의 보수 점검․ 교체 및 고장, 통신의 두절 등의 사유가 발생한 경우에는 서비스의 제공을 일시적으로 중단할 수 있습니다.
									</li>
									<li>
										Web-R은 제 1항의 사유로 서비스의 제공이 일시적으로 중단됨으로 인하여 이용자 또는 제 3자가 입은 손해에 대하여 배상합니다. 단, Web-R이 고의 또는 과실이 없음을 입증하는 경우에는 그러하지 아니합니다.
									</li>
									<li>
										사업 종목의 전환, 사업의 포기, 업체 간의 통합 등의 이유로 서비스를 제공할 수 없게 되는 경우에는 Web-R은 제 8조에 정한 방법으로 이용자에게 통지하고 당초 Web-R에서 제시한 조건에 따라 소비자에게 보상합니다. 다만, Web-R이 보상 기준 등을 고지하지 아니한 경우에는 이용자들의 마일리지 또는 적립금 등을 Web-R에서 통용되는 통화 가치에 상응하는 현물 또는 현금으로 이용자에게 지급합니다.
									</li>
								 </ol>
							</div>
						</div>


						<div class="px-4">
							<Div_title title={"제6조. 회원 가입"} />
							<div class={class_div_ol}>
								<ol class={class_ol}>
									<li>
										이용자는 Web-R이 정한 가입 양식에 따라 회원 정보를 기입한 후 이 약관에 동의한다는 의사표시를 함으로서 회원 가입을 신청합니다.
									</li>
									<li>
										Web-R은 제 1항과 같이 회원으로 가입할 것을 신청한 이용자 중 다음 각 호에 해당하지 않는 한 회원으로 등록합니다.
										<ul class={class_ul}>
											<li>
												가입 신청자가 이 약관 제 7조 제 3항에 의하여 이전에 회원 자격을 상실한 적이 있는 경우, 다만 제 7조 제 3항에 의한 회원 자격 상실 후 3년이 경과한 자로서 Web-R의 회원 재 가입 승낙을 얻은 경우에는 예외로 한다.
											</li>
											<li>
												등록 내용에 허위, 기재 누락, 오기가 있는 경우
											</li>
											<li>
												기타 회원으로 등록하는 것이 Web-R의 기술 상 현저히 지장이 있다고 판단되는 경우
											</li>
										</ul>
									</li>
									<li>
										회원 가입 계약의 성립 시기는 Web-R의 승낙이 회원에게 도달한 시점으로 합니다.
									</li>
									<li>
										회원은 회원 가입 시 등록한 사항에 변경이 있는 경우, 상당한 기간 이내에 Web-R에 대하여 회원 정보 수정 등의 방법으로 그 변경 사항을 알려야 합니다.
									</li>
								 </ol>
							</div>
						</div>


						<div class="px-4">
							<Div_title title={"제7조. 회원 탈퇴 및 자격 상실 등"} />
							<div class={class_div_ol}>
								<ol class={class_ol}>
									<li>
										회원은 Web-R에 언제든지 탈퇴를 요청할 수 있으며 Web-R은 즉시 회원 탈퇴를 처리합니다.
									</li>
									<li>
										회원이 다음 각 호의 사유에 해당하는 경우, Web-R은 회원 자격을 제한 및 정지 시킬 수 있습니다.
										<ul class={class_ul}>
											<li>
												가입 신청 시에 허위 내용을 등록한 경우
											</li>
											<li>
												Web-R을 이용하여 구입한 재화 등의 대금, 기타 Web-R이용에 관련하여 회원이 부담하는 채무를 기일에 지급하지 않는 경우
											</li>
											<li>
												다른 사람의 Web-R 이용을 방해하거나 그 정보를 도용하는 등 전자상거래 질서를 위협하는 경우
											</li>
											<li>
												Web-R을 이용하여 법령 또는 이 약관이 금지하거나 공서 양속에 반하는 행위를 하는 경우
											</li>
										</ul>
									</li>
									<li>
										Web-R이 회원 자격을 제한․정지 시킨 후, 동일한 행위가 2회 이상 반복되거나 30일 이내에 그 사유가 시정 되지 아니하는 경우 Web-R은 회원 자격을 상실 시킬 수 있습니다.
									</li>
									<li>
										Web-R이 회원 자격을 상실 시키는 경우에는 회원 등록을 말소합니다. 이 경우 회원에게 이를 통지하고, 회원 등록 말소 전에 최소한 30일 이상의 기간을 정하여 소명 할 기회를 부여합니다.
									</li>
								 </ol>
							</div>
						</div>




						<div class="px-4">
							<Div_title title={"제8조. 회원에 대한 통지"} />
							<div class={class_div_ol}>
								<ol class={class_ol}>
									<li>
										Web-R이 회원에 대한 통지를 하는 경우, 회원이 Web-R과 미리 약정 하여 지정한 전자우편 주소로 할 수 있습니다.
									</li>
									<li>
										Web-R은 불특정 다수 회원에 대한 통지의 경우 1주일 이상 Web-R 게시판에 게시함으로서 개별 통지에 갈음할 수 있습니다. 다만, 회원 본인의 거래와 관련하여 중대한 영향을 미치는 사항에 대하여는 개별 통지를 합니다.
									</li>
								 </ol>
							</div>
						</div>
	

						<div class="px-4">
							<Div_title title={"제9조. 구매 신청 및 개인정보 제공 동의 등"} />
							<div class={class_div_ol}>
								<ol class={class_ol}>
									<li>
										Web-R 이용자는 Web-R상에서 다음 또는 이와 유사한 방법에 의하여 구매를 신청하며, Web-R은 이용자가 구매 신청을 함에 있어서 다음의 각 내용을 알기 쉽게 제공하여야 합니다.
										<ul class={class_ul}>
											<li>
												재화 등의 검색 및 선택
											</li>
											<li>
												받는 사람의 성명, 주소, 전화번호, 전자우편 주소(또는 이동 전화 번호) 등의 입력
											</li>
											<li>
												약관 내용, 청약 철회권이 제한되는 서비스, 배송료․ 설치비 등의 비용 부담과 관련한 내용에 대한 확인
											</li>
											<li>
												이 약관에 동의하고 위 3.호의 사항을 확인하거나 거부하는 표시 (예, 마우스 클릭)
											</li>
											<li>
												재화 등의 구매 신청 및 이에 관한 확인 또는 Web-R의 확인에 대한 동의
											</li>
											<li>
												결제 방법의 선택
											</li>
										</ul>
									</li>
									<li>
										Web-R이 제 3자에게 구매자 개인정보를 제공할 필요가 있는 경우, 아래 사항을 구매자에게 알리고 동의를 받아야 합니다. (동의를 받은 사항이 변경되는 경우에도 같습니다.)
										<ul class={class_ul}>
											<li>
												개인정보를 제공 받는 자
											</li>
											<li>
												개인정보를 제공 받는 자의 개인정보 이용 목적
											</li>
											<li>
												제공하는 개인정보의 항목
											</li>
											<li>
												개인정보를 제공 받는 자의 개인정보 보유 및 이용 기간
											</li>
										</ul>
									</li>
									<li>
										Web-R이 제 3자에게 구매자의 개인정보를 취급할 수 있도록 업무를 위탁하는 경우에는, 아래 사항을 구매자에게 알리고 동의를 받아야 합니다. (동의를 받은 사항이 변경되는 경우에도 같습니다.) 다만, 서비스 제공에 관한 계약 이행을 위해 필요하고 구매자의 편의 증진과 관련된 경우에는 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」에서 정하고 있는 방법으로 개인정보 취급 방침을 통해 알림으로써 고지 절차와 동의 절차를 거치지 않아도 됩니다.
										<ul class={class_ul}>
											<li>
												개인정보 취급 위탁을 받는 자
											</li>
											<li>
												개인정보 취급 위탁을 하는 업무의 내용
											</li>
										</ul>
									</li>
								 </ol>
							</div>
						</div>


						<div class="px-4">
							<Div_title title={"제 10조. 계약의 성립"} />
							<div class={class_div_ol}>
								<ol class={class_ol}>
									<li>
										Web-R은 제 9조와 같은 구매 신청에 대하여 다음 각 호에 해당하면 승낙하지 않을 수 있습니다. 다만, 미성년자와 계약을 체결하는 경우에는 법정 대리인의 동의를 얻지 못하면 미성년자 본인 또는 법정 대리인이 계약을 취소할 수 있다는 내용을 고지하여야 합니다.
										<ul class={class_ul}>
											<li>
												신청 내용에 허위, 기재 누락, 오기가 있는 경우
											</li>
											<li>
												미성년자가 담배, 주류 등 청소년보호법에서 금지하는 재화 및 용역을 구매하는 경우
											</li>
											<li>
												기타 구매 신청에 승낙하는 것이 Web-R 기술 상 현저히 지장이 있다고 판단하는 경우
											</li>
										</ul>
									</li>
									<li>
										Web-R의 승낙이 제 12조 제 1항의 수신확인통지형태로 이용자에게 도달한 시점에 계약이 성립한 것으로 봅니다.
									</li>
									<li>
										Web-R의 승낙의 의사표시에는 이용자의 구매 신청에 대한 확인 및 판매 가능 여부, 구매 신청의 정정 취소 등에 관한 정보 등을 포함하여야 합니다.
									</li>
								 </ol>
							</div>
						</div>


						<div class="px-4">
							<Div_title title={"제11조. 지급방법"} />
							<div class={class_div_ol}>
								<ol class={class_ol}>
									<li>
										Web-R에서 구매한 재화 또는 용역에 대한 대금 지급 방법은 다음 각 호의 방법 중 가용한 방법으로 할 수 있습니다. 단, Web-R은 이용자의 지급 방법에 대하여 재화 등의 대금에 어떠한 명목의 수수료도 추가하여 징수할 수 없습니다.
										<ul class={class_ul}>
											<li>
												폰 뱅킹, 인터넷 뱅킹, 메일 뱅킹 등의 각종 계좌 이체
											</li>
											<li>
												선불 카드, 직불 카드, 신용카드 등의 각종 카드 결제
											</li>
											<li>
												온라인무통장입금
											</li>
											<li>
												전자 화폐에 의한 결제
											</li>
											<li>
												수령 시 대금 지급
											</li>
											<li>
												마일리지 등 Web-R이 지급한 포인트에 의한 결제
											</li>
											<li>
												Web-R과 계약을 맺었거나 Web-R이 인정한 상품권에 의한 결제
											</li>
											<li>
												기타 전자적 지급 방법에 의한 대금 지급 등
											</li>
										</ul>
									</li>
								 </ol>
							</div>
						</div>

						<div class="px-4">
							<Div_title title={"제12조. 수신확인통지․구매신청 변경 및 취소"} />
							<div class={class_div_ol}>
								<ol class={class_ol}>
									<li>
										Web-R은 이용자의 구매 신청이 있는 경우 이용자에게 수신 확인 통지를 합니다.
									</li>
									<li>
										수신 확인 통지를 받은 이용자는 의사표시의 불일치 등이 있는 경우에는 수신 확인 통지를 받은 후 즉시 구매 신청 변경 및 취소를 요청할 수 있고 Web-R은 배송 전에 이용자의 요청이 있는 경우에는 지체 없이 그 요청에 따라 처리하여야 합니다. 다만 이미 대금을 지불한 경우에는 제 15조의 청약 철회 등에 관한 규정에 따릅니다.
									</li>
								 </ol>
							</div>
						</div>

						<div class="px-4">
							<Div_title title={"제13조. 재화 등의 공급"} />
							<div class={class_div_ol}>
								<ol class={class_ol}>
									<li>
										Web-R은 이용자와 재화 등의 공급 시기에 관하여 별도의 약정이 없는 이상, 이용자가 청약을 한 날부터 7일 이내에 재화 등을 배송할 수 있도록 주문 제작, 포장 등 기타의 필요한 조치를 취합니다. 다만, Web-R이 이미 재화 등의 대금의 전부 또는 일부를 받은 경우에는 대금의 전부 또는 일부를 받은 날부터 3영업일 이내에 조치를 취합니다.  이때 Web-R은 이용자가 재화 등의 공급 절차 및 진행 사항을 확인할 수 있도록 적절한 조치를 합니다.
									</li>
									<li>
										Web-R은 이용자가 구매한 재화에 대해 배송 수단, 수단 별 배송 비용 부담자, 수단 별 배송 기간 등을 명시합니다. 만약 Web-R이 약정 배송 기간을 초과한 경우에는 그로 인한 이용자의 손해를 배상하여야 합니다. 다만 Web-R이 고의․과실이 없음을 입증한 경우에는 그러하지 아니합니다.
									</li>
								 </ol>
							</div>
						</div>


						<div class="px-4">
							<Div_title title={"제14조. 환급"} />
							<div class={class_div_ol}>
								<ol class={class_ol}>
									<li>
										Web-R은 이용자가 구매 신청한 재화 등이 품절 등의 사유로 인도 또는 제공을 할 수 없을 때에는 지체 없이 그 사유를 이용자에게 통지하고 사전에 재화 등의 대금을 받은 경우에는 대금을 받은 날부터 3영업일 이내에 환급 하거나 환급에 필요한 조치를 취합니다.
									</li>
								 </ol>
							</div>
						</div>


						<div class="px-4">
							<Div_title title={"제15조. 청약 철회 등"} />
							<div class={class_div_ol}>
								<ol class={class_ol}>
									<li>
										Web-R과 재화 등의 구매에 관한 계약을 체결한 이용자는 「전자상거래 등에서의 소비자보호에 관한 법률」 제 13조 제 2항에 따른 계약 내용에 관한 서면을 받은 날(그 서면을 받은 때보다 재화 등의 공급이 늦게 이루어진 경우에는 재화 등을 공급 받거나 재화 등의 공급이 시작된 날을 말합니다)부터 7일 이내에는 청약의 철회를 할 수 있습니다. 다만, 청약 철회에 관하여 「전자상거래 등에서의 소비자보호에 관한 법률」에 달리 정함이 있는 경우에는 동 법 규정에 따릅니다.
									</li>
									<li>
										이용자는 재화 등을 배송 받은 경우 다음 각 호의 1에 해당하는 경우에는 반품 및 교환을 할 수 없습니다.
										<ul class={class_ul}>
											<li>
												이용자에게 책임 있는 사유로 재화 등이 멸실 또는 훼손된 경우(다만, 재화 등의 내용을 확인하기 위하여 포장 등을 훼손한 경우에는 청약 철회를 할 수 있습니다)
											</li>
											<li>
												이용자의 사용 또는 일부 소비에 의하여 재화 등의 가치가 현저히 감소한 경우
											</li>
											<li>
												시간의 경과에 의하여 재 판매가 곤란할 정도로 재화 등의 가치가 현저히 감소한 경우
											</li>
											<li>
												같은 성능을 지닌 재화 등으로 복제가 가능한 경우 그 원본인 재화 등의 포장을 훼손한 경우
											</li>
										</ul>
									</li>
									<li>
										제 2항 제 2호 내지 제 4호의 경우에 Web-R이 사전에 청약 철회 등이 제한되는 사실을 소비자가 쉽게 알 수 있는 곳에 명기하거나 시용 상품을 제공하는 등의 조치를 하지 않았다면 이용자의 청약 철회 등이 제한되지 않습니다.
									</li>
									<li>
										이용자는 제 1항 및 제 2항의 규정에 불구하고 재화 등의 내용이 표시·광고 내용과 다르거나 계약 내용과 다르게 이행된 때에는 당해 재화 등을 공급 받은 날부터 3월 이내, 그 사실을 안 날 또는 알 수 있었던 날부터 30일 이내에 청약 철회 등을 할 수 있습니다.
									</li>
								 </ol>
							</div>
						</div>


						<div class="px-4">
							<Div_title title={"제16조. 청약 철회 등의 효과"} />
							<div class={class_div_ol}>
								<ol class={class_ol}>
									<li>
										Web-R은 이용자로부터 재화 등을 반환 받은 경우 3영업일 이내에 이미 지급 받은 재화 등의 대금을 환급 합니다. 이 경우 Web-R이 이용자에게 재화 등의 환급을 지연한 때에는 그 지연 기간에 대하여 「전자상거래 등에서의 소비자보호에 관한 법률 시행령」제 21조의 2에서 정하는 지연 이자율을 곱하여 산정한 지연 이자를 지급합니다.
									</li>
									<li>
										Web-R은 위 대금을 환급함에 있어서 이용자가 신용카드 또는 전자 화폐 등의 결제 수단으로 재화 등의 대금을 지급한 때에는 지체 없이 당해 결제 수단을 제공한 사업자로 하여금 재화 등의 대금의 청구를 정지 또는 취소하도록 요청합니다.
									</li>
									<li>
										청약 철회 등의 경우 공급 받은 재화 등의 반환에 필요한 비용은 이용자가 부담합니다. Web-R은 이용자에게 청약 철회 등을 이유로 위약금 또는 손해배상을 청구하지 않습니다. 다만 재화 등의 내용이 표시·광고 내용과 다르거나 계약 내용과 다르게 이행되어 청약 철회 등을 하는 경우 재화 등의 반환에 필요한 비용은 Web-R이 부담합니다.
									</li>
									<li>
										이용자가 재화 등을 제공 받을 때 발송비를 부담한 경우에 Web-R은 청약 철회 시 그 비용을  누가 부담하는지를 이용자가 알기 쉽도록 명확하게 표시합니다.
									</li>
								 </ol>
							</div>
						</div>


						<div class="px-4">
							<Div_title title={"제17조. 개인 정보 보호"} />
							<div class={class_div_ol}>
								<ol class={class_ol}>
									<li>
										Web-R은 이용자의 개인정보 수집 시 서비스 제공을 위하여 필요한 범위에서 최소한의 개인정보를 수집합니다. 
									</li>
									<li>
										Web-R은 회원 가입 시 구매 계약 이행에 필요한 정보를 미리 수집하지 않습니다. 다만, 관련 법령 상 의무 이행을 위하여 구매 계약 이전에 본인 확인이 필요한 경우로서 최소한의 특정 개인정보를 수집하는 경우에는 그러하지 아니합니다.
									</li>
									<li>
										Web-R은 이용자의 개인정보를 수집·이용하는 때에는 당해 이용자에게 그 목적을 고지하고 동의를 받습니다. 
									</li>
									<li>
										Web-R은 수집된 개인정보를 목적 외의 용도로 이용할 수 없으며, 새로운 이용 목적이 발생한 경우 또는 제 3자에게 제공하는 경우에는 이용 · 제공 단계에서 당해 이용자에게 그 목적을 고지하고 동의를 받습니다. 다만, 관련 법령에 달리 정함이 있는 경우에는 예외로 합니다.
									</li>
									<li>
										Web-R이 제 2항과 제 3항에 의해 이용자의 동의를 받아야 하는 경우에는 개인 정보 관리 책임자의 신원(소속, 성명 및 전화번호, 기타 연락처), 정보의 수집 목적 및 이용 목적, 제 3자에 대한 정보 제공 관련 사항(제공 받은 자, 제공 목적 및 제공할 정보의 내용) 등 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」 제 22조 제 2항이 규정한 사항을 미리 명시하거나 고지해야 하며 이용자는 언제든지 이 동의를 철회할 수 있습니다.
									</li>
									<li>
										이용자는 언제든지 Web-R이 가지고 있는 자신의 개인정보에 대해 열람 및 오류 정정을 요구할 수 있으며 Web-R은 이에 대해 지체 없이 필요한 조치를 취할 의무를 집니다. 이용자가 오류의 정정을 요구한 경우에는 Web-R은 그 오류를 정정할 때까지 당해 개인정보를 이용하지 않습니다.
									</li>
									<li>
										Web-R은 개인정보 보호를 위하여 이용자의 개인정보를 취급하는 자를  최소한으로 제한하여야 하며 신용카드, 은행 계좌 등을 포함한 이용자의 개인정보의 분실, 도난, 유출, 동의 없는 제 3자 제공, 변조 등으로 인한 이용자의 손해에 대하여 모든 책임을 집니다.
									</li>
									<li>
										Web-R 또는 그로부터 개인정보를 제공 받은 제 3자는 개인정보의 수집 목적 또는 제공 받은 목적을 달성한 때에는 당해 개인정보를 지체 없이 파기합니다.
									</li>
									<li>
										Web-R은 개인정보의 수집·이용·제공에 관한 동의 란을 미리 선택한 것으로 설정해두지 않습니다. 또한 개인정보의 수집·이용·제공에 관한 이용자의 동의 거절 시 제한되는 서비스를 구체적으로 명시하고, 필수 수집 항목이 아닌 개인정보의 수집·이용·제공에 관한 이용자의 동의 거절을 이유로 회원 가입 등 서비스 제공을 제한하거나 거절하지 않습니다.
									</li>
								 </ol>
							</div>
						</div>


						<div class="px-4">
							<Div_title title={"제18조. Web-R의 의무"} />
							<div class={class_div_ol}>
								<ol class={class_ol}>
									<li>
										Web-R은 법령과 이 약관이 금지하거나 공서양속에 반하는 행위를 하지 않으며 이 약관이 정하는 바에 따라 지속적이고, 안정적으로 재화․용역을 제공하는데 최선을 다하여야 합니다.
									</li>
									<li>
										Web-R은 이용자가 안전하게 인터넷 서비스를 이용할 수 있도록 이용자의 개인정보(신용 정보 포함)보호를 위한 보안 시스템을 갖추어야 합니다.
									</li>
									<li>
										Web-R이 상품이나 용역에 대하여 「표시․광고의 공정화에 관한 법률」 제 3조 소정의 부당한 표시․ 광고 행위를 함으로써 이용자가 손해를 입은 때에는 이를 배상할 책임을 집니다.
									</li>
									<li>
										Web-R은 이용자가 원하지 않는 영리 목적의 광고성 전자우편을 발송하지 않습니다.
									</li>
								 </ol>
							</div>
						</div>


						<div class="px-4">
							<Div_title title={"제19조. 회원의 ID 및 비밀번호에 대한 의무"} />
							<div class={class_div_ol}>
								<ol class={class_ol}>
									<li>
										제 17조의 경우를 제외한 ID와 비밀번호에 관한 관리 책임은 회원에게 있습니다.
									</li>
									<li>
										회원은 자신의 ID 및 비밀번호를 제 3자에게 이용하게 해서는 안됩니다.
									</li>
									<li>
										회원이 자신의 ID 및 비밀번호를 도난 당하거나 제 3자가 사용하고 있음을 인지한 경우에는 바로 Web-R에 통보하고 Web-R의 안내가 있는 경우에는 그에 따라야 합니다.
									</li>
								 </ol>
							</div>
						</div>


						<div class="px-4">
							<Div_title title={"제20조. 이용자의 의무"} />
							<div class={class_div_ol}>
								<ol class={class_ol}>
									<li>
										이용자는 다음 행위를 하여서는 안 됩니다.
										<ul class={class_ul}>
											<li>
												신청 또는 변경 시 허위 내용의 등록
											</li>
											<li>
												타인의 정보 도용
											</li>
											<li>
												Web-R에 게시된 정보의 변경
											</li>
											<li>
												Web-R이 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는 게시
											</li>
											<li>
												Web-R 기타 제 3자의 저작권 등 지적재산권에 대한 침해
											</li>
											<li>
												Web-R 기타 제 3자의 명예를 손상 시키거나 업무를 방해하는 행위
											</li>
											<li>
												외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에 반하는 정보를 Web-R에 공개 또는 게시하는 행위
											</li>
										</ul>
									</li>
								 </ol>
							</div>
						</div>

						<div class="px-4">
							<Div_title title={"제21조. 연결 Web-R과 피연결 Web-R 간의 관계"} />
							<div class={class_div_ol}>
								<ol class={class_ol}>
									<li>
										상위 Web-R과 하위 Web-R이 하이퍼링크(예: 하이퍼링크의 대상에는 문자, 그림 및 동영상 등이 포함됨)방식 등으로 연결된 경우, 전자를 연결 Web-R(웹 사이트)이라고 하고 후자를 피연결 Web-R(웹사이트)이라고 합니다.
									</li>
									<li>
										연결Web-R은 피연결Web-R이 독자적으로 제공하는 재화 등에 의하여 이용자와 행하는 거래에 대해서 보증 책임을 지지 않는다는 뜻을 연결Web-R의 초기화면 또는 연결되는 시점의 팝업 화면으로 명시한 경우에는 그 거래에 대한 보증 책임을 지지 않습니다.
									</li>
								 </ol>
							</div>
						</div>

						<div class="px-4">
							<Div_title title={"제22조. 저작권의 귀속 및 이용 제한"} />
							<div class={class_div_ol}>
								<ol class={class_ol}>
									<li>
										Web-R이 작성한 저작물에 대한 저작권 기타 지적재산권은 Web-R에 귀속합니다.
									</li>
									<li>
										이용자는 Web-R을 이용함으로써 얻은 정보 중 Web-R에게 지적재산권이 귀속된 정보를 Web-R의 사전 승낙 없이 복제, 송신, 출판, 배포, 방송 기타 방법에 의하여 영리 목적으로 이용하거나 제 3자에게 이용하게 하여서는 안됩니다.
									</li>
									<li>
										Web-R은 약정에 따라 이용자에게 귀속된 저작권을 사용하는 경우 당해 이용자에게 통보하여야 합니다.
									</li>
								 </ol>
							</div>
						</div>

						<div class="px-4">
							<Div_title title={"제23조. 분쟁 해결"} />
							<div class={class_div_ol}>
								<ol class={class_ol}>
									<li>
										Web-R은 이용자가 제기하는 정당한 의견이나 불만을 반영하고 그 피해를 보상 처리하기 위하여 피해 보상 처리 기구를 설치․운영합니다.
									</li>
									<li>
										Web-R은 이용자로부터 제출되는 불만 사항 및 의견은 우선적으로 그 사항을 처리합니다. 다만, 신속한 처리가 곤란한 경우에는 이용자에게 그 사유와 처리 일정을 즉시 통보해 드립니다.
									</li>
									<li>
										Web-R과 이용자 간에 발생한 전자상거래 분쟁과 관련하여 이용자의 피해 구제 신청이 있는 경우에는 공정거래위원회 또는 시·도지사가 의뢰하는 분쟁 조정 기관의 조정에 따를 수 있습니다.
									</li>
								 </ol>
							</div>
						</div>

						<div class="px-4">
							<Div_title title={"제24조. 재판권 및 준거법"} />
							<div class={class_div_ol}>
								<ol class={class_ol}>
									<li>
										Web-R과 이용자 간에 발생한 전자상거래 분쟁에 관한 소송은 제소 당시의 이용자의 주소에 의하고, 주소가 없는 경우에는 거소를 관할하는 지방법원의 전속 관할로 합니다. 다만, 제소 당시 이용자의 주소 또는 거소가 분명하지 않거나 외국 거주자의 경우에는 민사 소송법 상의 관할 법원에 제기합니다.
									</li>
									<li>
										Web-R과 이용자 간에 제기된 전자상거래 소송에는 한국 법을 적용합니다.
									</li>
								 </ol>
							</div>
						</div>

					</div>
				</div>
			</section>
		)
	}
	
	ReactDOM.render(<Div_main />, document.getElementById("div_main"))
}