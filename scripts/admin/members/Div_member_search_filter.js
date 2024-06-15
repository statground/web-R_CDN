function Div_member_search_filter() {
	return (
		<div class="w-full">
			<div class="flex flex-col w-full justify-end items-center space-x-4 px-8 py-4 bg-blue-100 border border-blue-300 shadow space-y-4 rounded-lg md:px-2">
				<div class="flex-row justify-start items-start text-start w-full">
					<p class="font-bold">회원 검색</p>
				</div>
	
				<div class="flex flex-col justify-start items-center w-full space-y-1">
					<p class="text-sm w-full text-start underline">검색어(닉네임, 이름, 이메일)</p>
					<input type="text" id="txt_search"
							class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
									focus:ring-blue-500 focus:border-blue-500 block w-full" />
				</div>

				<div class="flex flex-col justify-center items-center w-full space-y-1">
					<p class="text-sm w-full text-start underline">회원 등급</p>

					<ul class="grid grid-cols-3 items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg">
						<div class="flex items-center ps-3">
							<input id="check_member_admin" type="checkbox" value=""
								class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" />
							<label for="check_member_admin" class="w-full py-3 ms-2 text-sm font-medium text-gray-900">관리자</label>
						</div>
						<div class="flex items-center ps-3">
							<input id="check_member_corp" type="checkbox" value=""
								class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" />
							<label for="check_member_corp" class="w-full py-3 ms-2 text-sm font-medium text-gray-900">기관회원</label>
						</div>
						<div class="flex items-center ps-3">
							<input id="check_member_vip" type="checkbox" value="" 
								class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" />
							<label for="check_member_vip" class="w-full py-3 ms-2 text-sm font-medium text-gray-900">VIP회원</label>
						</div>
						<div class="flex items-center ps-3">
							<input id="check_member_regular" type="checkbox" value="" 
								class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" />
							<label for="check_member_regular" class="w-full py-3 ms-2 text-sm font-medium text-gray-900">정회원</label>
						</div>
						<div class="flex items-center ps-3">
							<input id="check_member_member" type="checkbox" value=""
								class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" />
							<label for="check_member_member" class="w-full py-3 ms-2 text-sm font-medium text-gray-900">준회원</label>
						</div>
					</ul>
				</div>

				<div class="flex flex-col justify-center items-center w-full space-y-1">
					<p class="text-sm w-full text-start underline">Membership Add-On</p>

					<ul class="grid grid-cols-3 items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg">
						<div class="flex items-center ps-3">
							<input id="check_member_addon_none" type="checkbox" value=""
								class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" />
							<label for="check_member_addon_none" class="w-full py-3 ms-2 text-sm font-medium text-gray-900">None</label>
						</div>
						<div class="flex items-center ps-3">
							<input id="check_member_addon_blocked" type="checkbox" value=""
								class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" />
							<label for="check_member_addon_blocked" class="w-full py-3 ms-2 text-sm font-medium text-gray-900">차단된 회원</label>
						</div>
					</ul>
				</div>

				<div class="flex flex-row justify-end items-center w-full">
					<div class="flex flex-row justify-end items-center" id="div_btn_search">
						<button type="button" 
								onClick={() => click_btn_search()}
								class="py-1.5 px-5 text-white bg-blue-700 font-medium rounded-lg text-sm w-full md:w-auto text-center
									hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300">
							Search
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}