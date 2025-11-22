function Div_btn_comment_editor_footer_button(props) {
  return (
    <button
      type="button"
      onClick={props.function}
      class="flex flex-row justify-center items-center
             text-white bg-gradient-to-r from-cyan-500 to-blue-500
             font-medium rounded-lg text-sm px-5 py-1 text-center
             hover:bg-gradient-to-bl hover:bg-gray-300
             focus:ring-4 focus:outline-none focus:ring-cyan-300"
    >
      등록
    </button>
  );
}
