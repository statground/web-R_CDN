function Div_article_read_file(props) {
	return (
		<section class="bg-white py-8 lg:py-16 antialiased">
			<div class="w-full mx-auto px-4 space-y-2">
				<div class="flex justify-between items-center mb-6">
					<h2 class="text-md lg:text-lg font-bold text-gray-900">첨부파일</h2>
				</div>
				<form class="mb-3">
					<div class="w-full bg-gray-50 rounded-lg border border-gray-200"></div>
				</form>
				{
					data_article.file_url != null
					?   <div class="flex flex-row justify-center items-start w-full">
							<a href={"/" + data_article.file_url} target="_blank" class="flex flex-row justify-end items-center text-md font-normal w-fit space-x-2 cursor-pointer hover:bg-gray-100">
								{data_article.file_name}
							</a>
						</div>
					:   <div class="flex flex-col justify-center items-start w-full space-y-2 text-md lg:text-lg">
							첨부파일이 없습니다.
						</div>
				}

			</div>
		</section>
	)
}