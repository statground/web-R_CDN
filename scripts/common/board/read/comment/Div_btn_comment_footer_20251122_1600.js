function Div_btn_comment_footer(props) {
  return (
    <button
      type="button"
      class="flex justify-center items-center text-sm text-gray-500 hover:underline font-medium"
      onClick={props.function}
    >
      {props.url_image && (
        <img src={props.url_image} class="w-4 h-4 mr-2" />
      )}
      {props.text}
    </button>
  );
}
