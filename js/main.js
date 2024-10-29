// main.js
import { autoReplies } from './autoReplies.js'; // autoReplies.jsをインポート

// Firebaseの初期化
const firebaseConfig = {
  apiKey: "***************",
  authDomain: "***************",
  projectId: "***************",
  storageBucket: "***************",
  messagingSenderId: "***************",
  appId: "***************",
};

// Firebaseの初期化処理
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  set,
  onChildAdded,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const dbRef = ref(db, "chat");

// 送信処理
$("#sendBtn").on("click", function () {
  const msg = {
    text: $("#input").val(),
  };
  const newPostRef = push(dbRef); // ユニークKEYを生成
  set(newPostRef, msg) // "chat"にユニークKEYをつけてオブジェクトデータを登録
    .then(() => {
      $("#input").val(""); // インプットを空にする

      // ランダムな定型文を選んで自動返信を追加
      const randomReply = autoReplies[Math.floor(Math.random() * autoReplies.length)];
      const replyMsg = {
        text: randomReply,
      };
      const replyPostRef = push(dbRef); // 自動返信用にユニークKEYを生成
      set(replyPostRef, replyMsg); // 自動返信をデータベースに登録
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
  
  // 自動返信かどうかを判別する条件を追加
  if (msg.text.startsWith("そうなんですね。")) {
    li.addClass("auto-reply"); // 自動返信にクラスを追加
  } else {
    li.addClass("user-message"); // ユーザーのメッセージにクラスを追加
  }

  $("#messages").append(li); // <ul>に追加
  const messagesContainer = $("#messages");
  messagesContainer.scrollTop(messagesContainer[0].scrollHeight);
});
