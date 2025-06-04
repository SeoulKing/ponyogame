const characterState = {
  affection: 50,
  mood: "보통",
};

function renderStatus() {
  const affectionEl = document.getElementById("affection-value");
  const moodEl = document.getElementById("mood-value");

  const clampedAffection = Math.max(0, Math.min(100, characterState.affection));
  affectionEl.textContent = clampedAffection;
  moodEl.textContent = characterState.mood;
}

function showMessage(text) {
  const messageEl = document.getElementById("result-message");
  messageEl.textContent = text;
}

function handleAction(action) {
  let msg = "";
  switch (action) {
    case "pet":
      characterState.affection += 5;
      msg = "부드럽게 쓰다듬었어요. 애정도가 조금 올랐습니다!";
      break;
    case "kiss":
      characterState.affection += 10;
      msg = "따뜻하게 뽀뽀해주었어요. 애정도가 크게 올라갔습니다!";
      break;
    case "love":
      characterState.affection += 8;
      msg = "진심으로 사랑한다고 말했어요. 애정도가 올랐습니다!";
      break;
    case "tease":
      characterState.affection -= 15;
      msg = "장난으로 괴롭혔어요… 기분이 별로 같아요.";
      break;
    default:
      msg = "알 수 없는 행동입니다.";
  }

  if (characterState.affection >= 80) {
    characterState.mood = "행복";
  } else if (characterState.affection <= 20) {
    characterState.mood = "삐짐";
  } else {
    characterState.mood = "보통";
  }

  renderStatus();
  showMessage(msg);
}

function saveStateToLocal() {
  const data = {
    affection: characterState.affection,
    mood: characterState.mood
  };
  localStorage.setItem("myGameState", JSON.stringify(data));
}

function loadStateFromLocal() {
  const saved = localStorage.getItem("myGameState");
  if (saved) {
    try {
      const data = JSON.parse(saved);
      characterState.affection = data.affection;
      characterState.mood = data.mood;
    } catch (e) {
      console.error("로컬 데이터 파싱 오류:", e);
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadStateFromLocal();
  renderStatus();

  const buttons = document.querySelectorAll(".action-btn");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const action = btn.getAttribute("data-action");
      handleAction(action);
      saveStateToLocal();
    });
  });
});
