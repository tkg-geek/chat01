const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
};
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  set,
  onChildAdded,
  remove,
  onChildRemoved,
  update,
  onChildChanged,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const dbRef = ref(db, "chat");

// 送信処理
$("#sendBtn").on("click", function () {
  const msg = {
    text: $("#input").val(),
  };
  const newPostRef = push(dbRef); //ユニークKEYを生成
  set(newPostRef, msg) // "chat"にユニークKEYをつけてオブジェクトデータを登録
    .then(() => {
      $("#input").val(""); // インプットを空にする
    })
    .catch((error) => {
      console.error("Error writing to database: ", error);
    });
});

// 受信処理
onChildAdded(dbRef, function (data) {
  const msg = data.val();
  const key = data.key;
  let li = $("<li></li>"); // <li>要素を作成
  li.text(msg.text); // メッセージテキストを設定
  $("#messages").append(li); // <ul>に追加
  // 新しいメッセージが追加されたらスクロールを一番下に移動
  const messagesContainer = $("#messages");
  messagesContainer.scrollTop(messagesContainer[0].scrollHeight);
});

