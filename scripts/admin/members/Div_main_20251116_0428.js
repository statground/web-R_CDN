function Div_main(props) {
  const data = props.data;

  // ---------- 회원 목록 관련 상태 ----------
  const membersRaw = React.useMemo(
    () => Object.values(data.list_members || {}),
    [data.list_members]
  );

  const [search, setSearch] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState("all");
  const [blockedFilter, setBlockedFilter] = React.useState("all");
  const [page, setPage] = React.useState(1);
  const pageSize = 20;

  // 필터 옵션 (role 목록)
  const roleOptions = React.useMemo(() => {
    const roles = new Set();
    membersRaw.forEach((m) => {
      if (m.role) roles.add(m.role);
    });
    return ["all", ...Array.from(roles)];
  }, [membersRaw]);

  // 검색/필터 적용
  const filteredMembers = React.useMemo(() => {
    const q = search.trim().toLowerCase();

    return membersRaw.filter((m) => {
      // 검색어: 이메일 / 닉네임 / 실명
      if (q) {
        const email = (m.email || "").toLowerCase();
        const nick = (m.nickname || "").toLowerCase();
        const real = (m.realname || "").toLowerCase();
        if (
          !email.includes(q) &&
          !nick.includes(q) &&
          !real.includes(q)
        ) {
          return false;
        }
      }

      // 등급 필터
      if (roleFilter !== "all" && m.role !== roleFilter) {
        return false;
      }

      // 차단 여부 필터
      const blockedVal = Number(m.blocked || 0);
      if (blockedFilter === "blocked" && blockedVal !== 1) return false;
      if (blockedFilter === "active" && blockedVal === 1) return false;

      return true;
    });
  }, [membersRaw, search, roleFilter, blockedFilter]);

  // 필터가 바뀌면 1페이지로
  React.useEffect(() => {
    setPage(1);
  }, [search, roleFilter, blockedFilter]);

  // 페이지네이션 계산
  const totalPages = Math.max(
    1,
    Math.ceil(filteredMembers.length / pageSize)
  );
  const currentPage = Math.min(page, totalPages);
  const startIdx = (currentPage - 1) * pageSize;
  const pagedMembers = filteredMembers.slice(
    startIdx,
    startIdx + pageSize
  );

  const handlePrev = () => {
    setPage((p) => Math.max(1, p - 1));
  };
  const handleNext = () => {
    setPage((p) => Math.min(totalPages, p + 1));
  };

  return (
    <div className="grid grid-cols-12 md:grid-cols-1 justify-center item-center w-full px-[100px] py-[20px] md:px-[10px] md:grid-cols-1">
      <Div_operation_menu />

      <div className="col-span-10 md:grid-cols-1 justify-center item-center">

        {/* 가입자 수 카드 */}
        <div className="w-full bg-white border border-gray-200 rounded-lg shadow mb-4">
          <div className="p-4 bg-white rounded-lg md:p-8 text-center">
            <Div_sub_title title={"가입자 수"} />
            <dl className="grid grid-cols-4 w-full md:grid-cols-2 gap-8 p-4 mx-auto text-gray-900 md:p-8">
              <Div_sub_card title={"총 가입자 수"} value={data.count_joined.val_member_total['0']} unit={"명"} />
              <Div_sub_card title={"올해 가입자 수"} value={data.count_joined.val_member_yearly['0']} unit={"명"}
                            subtitle={"작년"} subvalue={data.count_joined.val_member_yearly_last['0']} />
              <Div_sub_card title={"이번 달 가입자 수"} value={data.count_joined.val_member_monthly['0']} unit={"명"}
                            subtitle={"지난 달"} subvalue={data.count_joined.val_member_monthly_last['0']} />
              <Div_sub_card title={"오늘 가입자 수"} value={data.count_joined.val_member_daily['0']} unit={"명"}
                            subtitle={"어제"} subvalue={data.count_joined.val_member_daily_last['0']} />
            </dl>
          </div>
        </div>

        {/* 등급별 멤버 수 */}
        <div className="w-full bg-white border border-gray-200 rounded-lg shadow mb-4">
          <div className="p-4 bg-white rounded-lg md:p-8 text-center">
            <Div_sub_title title={"등급별 멤버 수"} />
            <dl className="grid grid-cols-5 w-full md:grid-cols-2 gap-8 p-4 mx-auto text-gray-900 md:p-8">
              <Div_sub_card title={data.count_role['0'].name} value={data.count_role['0'].cnt} unit={"명"}/>
              <Div_sub_card title={data.count_role['1'].name} value={data.count_role['1'].cnt} unit={"명"}/>
              <Div_sub_card title={data.count_role['2'].name} value={data.count_role['2'].cnt} unit={"명"}/>
              <Div_sub_card title={data.count_role['3'].name} value={data.count_role['3'].cnt} unit={"명"}/>
              <Div_sub_card title={data.count_role['4'].name} value={data.count_role['4'].cnt} unit={"명"}/>
            </dl>
          </div>
        </div>

        {/* 가입자 수 추이 그래프 */}
        <div className="w-full bg-white border border-gray-200 rounded-lg shadow mb-4">
          <div className="p-4 bg-white rounded-lg md:p-8 text-center">
            <dl className="flex flex-col justify-center items-start w-full p-4 mx-auto text-gray-900">
              <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 w-full">
                <li className="me-2" onClick={() => draw_chart(data.list_daily, "graph_tab_daily")}>
                  <div className={class_tab_inactive} id="graph_tab_daily">일</div>
                </li>
                <li className="me-2" onClick={() => draw_chart(data.list_monthly, "graph_tab_monthly")}>
                  <div className={class_tab_active} id="graph_tab_monthly">월</div>
                </li>
                <li className="me-2" onClick={() => draw_chart(data.list_yearly, "graph_tab_yearly")}>
                  <div className={class_tab_inactive} id="graph_tab_yearly">년</div>
                </li>
              </ul>
              <div id="div_statistics_graph" name="div_statistics_graph" className="w-full h-[500px] p-8"></div>
            </dl>
          </div>
        </div>

        {/* ---------- 회원 목록 (검색 + 필터 + 페이지네이션) ---------- */}
        <div className="w-full bg-white border border-gray-200 rounded-lg shadow">
          <div className="p-4 bg-white rounded-lg md:p-6">
            <Div_sub_title title={"회원 목록"} />

            {/* 검색/필터 영역 */}
            <div className="flex flex-wrap gap-2 items-center justify-between mb-4">
              <div className="flex flex-wrap gap-2">
                <input
                  type="text"
                  className="border border-gray-300 rounded px-3 py-1 text-sm"
                  placeholder="이메일 / 닉네임 / 이름 검색"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <select
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  {roleOptions.map((r) => (
                    <option key={r} value={r}>
                      {r === "all" ? "등급 전체" : r}
                    </option>
                  ))}
                </select>
                <select
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                  value={blockedFilter}
                  onChange={(e) => setBlockedFilter(e.target.value)}
                >
                  <option value="all">전체(차단 포함)</option>
                  <option value="active">정상 회원만</option>
                  <option value="blocked">차단 회원만</option>
                </select>
              </div>

              <div className="text-xs text-gray-500">
                총 {filteredMembers.length}명 중{" "}
                {pagedMembers.length > 0 ? `${startIdx + 1}–${startIdx + pagedMembers.length}` : 0}명 표시
              </div>
            </div>

            {/* 테이블 */}
            <div className="w-full overflow-x-auto">
              <table className="min-w-full text-xs md:text-sm text-left text-gray-600">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-3 py-2">No</th>
                    <th className="px-3 py-2 whitespace-nowrap">가입일</th>
                    <th className="px-3 py-2 whitespace-nowrap">이메일</th>
                    <th className="px-3 py-2 whitespace-nowrap">닉네임</th>
                    <th className="px-3 py-2 whitespace-nowrap">이름</th>
                    <th className="px-3 py-2 whitespace-nowrap">등급</th>
                    <th className="px-3 py-2 whitespace-nowrap">성별</th>
                    <th className="px-3 py-2 whitespace-nowrap">만료일</th>
                    <th className="px-3 py-2 whitespace-nowrap">메일수신</th>
                    <th className="px-3 py-2 whitespace-nowrap">차단</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedMembers.length === 0 && (
                    <tr>
                      <td colSpan="10" className="px-3 py-4 text-center text-gray-400">
                        조건에 해당하는 회원이 없습니다.
                      </td>
                    </tr>
                  )}

                  {pagedMembers.map((m, idx) => (
                    <tr key={m.uuid} className="border-b hover:bg-gray-50">
                      <td className="px-3 py-2">
                        {startIdx + idx + 1}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        {m.date_joined}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        {m.email}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        {m.nickname}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        {m.realname}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        {m.role}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        {m.gender}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        {m.expired_at}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        {Number(m.email_subscription) === 1 ? "Y" : "N"}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        {Number(m.blocked) === 1 ? "차단" : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 페이지네이션 */}
            <div className="flex items-center justify-between mt-4 text-xs md:text-sm">
              <div>
                페이지 {currentPage} / {totalPages}
              </div>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 border rounded disabled:opacity-50"
                  onClick={handlePrev}
                  disabled={currentPage <= 1}
                >
                  이전
                </button>
                <button
                  className="px-3 py-1 border rounded disabled:opacity-50"
                  onClick={handleNext}
                  disabled={currentPage >= totalPages}
                >
                  다음
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
