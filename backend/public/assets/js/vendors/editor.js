var toolbarOptions = {
    toolbar: [
        [{ header: [1, 2, !1] }],
        [{ font: [] }],
        ["bold", "italic", "underline", "strike"],
        [{ size: ["small", !1, "large", "huge"] }],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ color: [] }, { background: [] }, { align: [] }],
        ["link", "image", "code-block", "video"],
    ],
};

// 1. Pehla Editor (Short Description)
var editorElement = document.querySelector("#editor");
if (editorElement) {
    var quill1 = new Quill(editorElement, {
        modules: toolbarOptions,
        theme: "snow",
    });
}

// 2. Doosra Editor (Long Description)
var editorElement1 = document.querySelector("#editor1");
if (editorElement1) {
    var quill2 = new Quill(editorElement1, {
        modules: toolbarOptions,
        theme: "snow",
    });
}