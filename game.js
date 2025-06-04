const characterState = {
  affection: 50,
  mood: "보통",
  lastActiveTime: Date.now(),
};

// 시간에 따른 애정도 감소 설정
const TIME_SETTINGS = {
  decreaseInterval: 30000, // 30초마다 감소
  decreaseAmount: 1,       // 한 번에 1씩 감소
  maxOfflineHours: 24,     // 최대 24시간까지 오프라인 시간 계산
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

function updateMood() {
  if (characterState.affection >= 80) {
    characterState.mood = "행복";
  } else if (characterState.affection <= 20) {
    characterState.mood = "삐짐";
  } else {
    characterState.mood = "보통";
  }
}

function decreaseAffectionOverTime() {
  if (characterState.affection > 0) {
    characterState.affection -= TIME_SETTINGS.decreaseAmount;
    characterState.affection = Math.max(0, characterState.affection);
    
    updateMood();
    renderStatus();
    saveStateToLocal();
    
    // 애정도가 떨어졌다는 메시지 표시 (가끔씩)
    if (Math.random() < 0.3) { // 30% 확률로 메시지 표시
      if (characterState.affection <= 10) {
        showMessage("😢 너무 오랫동안 관심을 주지 않아서 슬퍼하고 있어요...");
      } else if (characterState.affection <= 30) {
        showMessage("😔 조금 외로워하는 것 같아요.");
      } else {
        showMessage("🕐 시간이 지나고 있어요...");
      }
    }
  }
}

function calculateOfflineAffectionLoss(offlineTime) {
  const hoursOffline = offlineTime / (1000 * 60 * 60); // 밀리초를 시간으로 변환
  const maxHours = TIME_SETTINGS.maxOfflineHours;
  const actualHours = Math.min(hoursOffline, maxHours);
  
  // 1시간마다 2씩 감소
  const lossAmount = Math.floor(actualHours * 2);
  return lossAmount;
}

function handleOfflineTime() {
  const currentTime = Date.now();
  const offlineTime = currentTime - characterState.lastActiveTime;
  
  // 1분 이상 오프라인이었다면 애정도 감소
  if (offlineTime > 60000) {
    const lossAmount = calculateOfflineAffectionLoss(offlineTime);
    
    if (lossAmount > 0) {
      characterState.affection -= lossAmount;
      characterState.affection = Math.max(0, characterState.affection);
      
      updateMood();
      
      const hoursOffline = Math.floor(offlineTime / (1000 * 60 * 60));
      const minutesOffline = Math.floor((offlineTime % (1000 * 60 * 60)) / (1000 * 60));
      
      if (hoursOffline > 0) {
        showMessage(`😔 ${hoursOffline}시간 ${minutesOffline}분 동안 혼자 있어서 애정도가 ${lossAmount} 감소했어요.`);
      } else {
        showMessage(`😔 ${minutesOffline}분 동안 혼자 있어서 애정도가 ${lossAmount} 감소했어요.`);
      }
    }
  }
  
  characterState.lastActiveTime = currentTime;
}

function startAffectionTimer() {
  setInterval(decreaseAffectionOverTime, TIME_SETTINGS.decreaseInterval);
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

  updateMood();
  renderStatus();
  showMessage(msg);
  
  // 마지막 활동 시간 업데이트
  characterState.lastActiveTime = Date.now();
}

function saveStateToLocal() {
  const data = {
    affection: characterState.affection,
    mood: characterState.mood,
    lastActiveTime: characterState.lastActiveTime
  };
  localStorage.setItem("myGameState", JSON.stringify(data));
}

function loadStateFromLocal() {
  const saved = localStorage.getItem("myGameState");
  if (saved) {
    try {
      const data = JSON.parse(saved);
      characterState.affection = data.affection || 50;
      characterState.mood = data.mood || "보통";
      characterState.lastActiveTime = data.lastActiveTime || Date.now();
    } catch (e) {
      console.error("로컬 데이터 파싱 오류:", e);
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadStateFromLocal();
  handleOfflineTime(); // 오프라인 시간 처리
  renderStatus();
  startAffectionTimer(); // 애정도 감소 타이머 시작

  const buttons = document.querySelectorAll(".action-btn");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const action = btn.getAttribute("data-action");
      handleAction(action);
      saveStateToLocal();
    });
  });
});
