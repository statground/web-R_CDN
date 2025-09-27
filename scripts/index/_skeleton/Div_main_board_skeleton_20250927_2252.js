function Div_main_board_skeleton() {
	function Div_table_skeleton({ title, id, rows = 5 }) {
	  const Row = () => (
		<tr class="bg-white border-b">
		  <td class="px-6 py-4">
			<div class="h-2.5 bg-gray-300 rounded-full w-3/4 mb-2.5 animate-pulse"></div>
			<div class="h-2 bg-gray-200 rounded-full w-1/3 animate-pulse"></div>
		  </td>
		</tr>
	  );
	  return (
		<div class="w-full" id={id}>
		  <h5 class="mb-2 text-xl pb-4 font-bold tracking-tight text-gray-900">{title}</h5>
		  <div class="rounded-lg border bg-white">
			<table class="w-full text-sm text-left text-gray-500">
			  <thead class="text-xs text-gray-700 uppercase bg-gray-50">
				<tr><th class="px-6 py-3">{/* header space */}</th></tr>
			  </thead>
			  <tbody>
				{Array.from({ length: rows }).map((_, i) => <Row key={i} />)}
			  </tbody>
			</table>
		  </div>
		</div>
	  );
	}

	function Div_card({ title, id, children }) {
		return (
		  <div class="w-full rounded-lg border bg-white p-4" id={id}>
			<h6 class="mb-3 text-base font-semibold text-gray-900">{title}</h6>
			{children}
		  </div>
		);
	  }

	// 공지/멤버용 리스트 아이템 스켈레톤
	const Bullet = () => (
		<div class="flex items-center gap-3 py-2">
		  <div class="h-2.5 w-2.5 rounded-full bg-gray-300 animate-pulse"></div>
		  <div class="h-2.5 bg-gray-300 rounded-full w-3/4 animate-pulse"></div>
		</div>
	);

	const AvatarRow = () => (
		<div class="flex items-center gap-3 py-2">
		  <div class="h-10 w-10 rounded-full bg-gray-300 animate-pulse"></div>
		  <div class="flex-1">
			<div class="h-2.5 bg-gray-300 rounded-full w-1/2 mb-2 animate-pulse"></div>
			<div class="h-2 bg-gray-200 rounded-full w-1/3 animate-pulse"></div>
		  </div>
		</div>
	);
	
	return (
		<div class="flex flex-row pt-12 pb-12 justify-center" id="div_board">
		  <div class="container mx-auto px-4">
			<div class="grid grid-cols-4 gap-6 md:grid-cols-1">
			  {/* 왼쪽: 자유게시판 (3/4) */}
			  <div class="col-span-3">
				<Div_table_skeleton title={"커뮤니티"} id={"div_main_board_free"} rows={6} />
			  </div>

			  {/* 오른쪽: 유튜브 / 공지사항 / 최근 활동 (1/4, 세로 스택) */}
			  <div class="col-span-1 flex flex-col gap-6">
				{/* 공지사항 최근 3개 */}
				<Div_card title={"공지사항"} id={"div_main_board_notice"}>
					<Bullet /><Bullet /><Bullet />
				  </Div_card>

				{/* 유튜브 */}
				<Div_card title={"유튜브"} id={"div_main_youtube"}>
				  <div class="w-full aspect-video rounded-md bg-gray-300 animate-pulse"></div>
				</Div_card>

				{/* 최근 활동 랜덤 3명 */}
				<Div_card title={"최근 활동"} id={"div_main_new_members"}>
				  <AvatarRow /><AvatarRow /><AvatarRow />
				</Div_card>
			  </div>
			</div>
		  </div>
		</div>
	);
}