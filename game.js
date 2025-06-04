const characterState = {
  affection: 50,
  fullness: 100,
  mood: "보통",
  lastActiveTime: Date.now(),
  coins: 10,
  inventory: {
    snacks: 0
  }
};

// 시간에 따른 수치 변화 설정
const TIME_SETTINGS = {
  decreaseInterval: 10000, // 10초마다 감소
  affectionDecreaseAmount: 1,       // 애정도 한 번에 1씩 감소
  fullnessDecreaseAmount: 2,        // 배부름 한 번에 2씩 감소
  maxOfflineHours: 24,     // 최대 24시간까지 오프라인 시간 계산
};

function updateStatusMessage() {
  const statusMessageEl = document.getElementById("status-message");
  let message = "";

  // 배고픔이 심한 경우
  if (characterState.fullness <= 20) {
    const hungerMessages = [
      "배고파요... 뭔가 주세요...",
      "꼬르륵... 배가 너무 고파요!",
      "과자... 과자는 없나요...?",
      "먹을 것이 그리워요 ㅠㅠ"
    ];
    message = hungerMessages[Math.floor(Math.random() * hungerMessages.length)];
  }
  // 애정도가 낮은 경우
  else if (characterState.affection <= 20) {
    const sadMessages = [
      "외로워요... 관심을 주세요",
      "왜 저를 돌봐주지 않나요?",
      "삐짐... 더 이상 말 안 할 거예요",
      "슬퍼요... 혼자는 싫어요"
    ];
    message = sadMessages[Math.floor(Math.random() * sadMessages.length)];
  }
  // 행복한 경우
  else if (characterState.affection >= 80 && characterState.fullness >= 80) {
    const happyMessages = [
      "정말 행복해요! 감사해요~",
      "최고예요! 더 놀아요!",
      "사랑해요! 💕",
      "이런 기분 처음이에요!",
      "오늘 정말 좋은 날이네요!"
    ];
    message = happyMessages[Math.floor(Math.random() * happyMessages.length)];
  }
  // 배부른 경우
  else if (characterState.fullness >= 90) {
    const fullMessages = [
      "아, 배불러요~ 맛있었어요!",
      "더 이상 못 먹겠어요...",
      "과자가 정말 달콤했어요!",
      "포만감이 느껴져요~"
    ];
    message = fullMessages[Math.floor(Math.random() * fullMessages.length)];
  }
  // 애정도가 높은 경우
  else if (characterState.affection >= 60) {
    const contentMessages = [
      "오늘도 함께해서 즐거워요!",
      "당신과 있으면 편안해요",
      "좋은 시간을 보내고 있어요",
      "앞으로도 잘 부탁드려요~",
      "평온한 하루네요"
    ];
    message = contentMessages[Math.floor(Math.random() * contentMessages.length)];
  }
  // 일반적인 경우
  else {
    const normalMessages = [
      "오늘은 어떤 일이 일어날까요?",
      "평범한 하루를 보내고 있어요",
      "무엇을 하며 놀까요?",
      "시간이 천천히 흘러가네요",
      "잠깐, 뭔가 하고 싶은데..."
    ];
    message = normalMessages[Math.floor(Math.random() * normalMessages.length)];
  }

  statusMessageEl.textContent = message;
}

function renderStatus() {
  const affectionEl = document.getElementById("affection-value");
  const fullnessEl = document.getElementById("fullness-value");
  const moodEl = document.getElementById("mood-value");
  const coinEl = document.getElementById("coin-value");
  const snackCountEl = document.getElementById("snack-count");

  const clampedAffection = Math.max(0, Math.min(100, characterState.affection));
  const clampedFullness = Math.max(0, Math.min(100, characterState.fullness));
  
  affectionEl.textContent = clampedAffection;
  fullnessEl.textContent = clampedFullness;
  moodEl.textContent = characterState.mood;
  coinEl.textContent = characterState.coins;
  snackCountEl.textContent = characterState.inventory.snacks;
  
  // 상점 버튼 상태 업데이트
  updateShopButtons();
  
  // 상태 메시지 업데이트 (30% 확률로만 변경)
  if (Math.random() < 0.3) {
    updateStatusMessage();
  }
}

function showMessage(text) {
  const messageEl = document.getElementById("result-message");
  messageEl.textContent = text;
}

function updateMood() {
  // 배고픔과 애정도를 종합해서 기분 결정
  if (characterState.fullness <= 20) {
    characterState.mood = "😵 매우 배고픔";
  } else if (characterState.fullness <= 40) {
    characterState.mood = "😋 배고픔";
  } else if (characterState.affection >= 80 && characterState.fullness >= 80) {
    characterState.mood = "😊 행복";
  } else if (characterState.affection <= 20) {
    characterState.mood = "😤 삐짐";
  } else if (characterState.fullness <= 60) {
    characterState.mood = "🍪 조금 배고픔";
  } else {
    characterState.mood = "😐 보통";
  }
}

function decreaseAffectionOverTime() {
  // 애정도 감소
  if (characterState.affection > 0) {
    characterState.affection -= TIME_SETTINGS.affectionDecreaseAmount;
    characterState.affection = Math.max(0, characterState.affection);
  }
  
  // 배부름 감소 (시간이 지나면 배가 고파짐)
  if (characterState.fullness > 0) {
    characterState.fullness -= TIME_SETTINGS.fullnessDecreaseAmount;
    characterState.fullness = Math.max(0, characterState.fullness);
  }
  
  updateMood();
  renderStatus();
  saveStateToLocal();
  
  // 상태에 따른 메시지 표시 (가끔씩)
  if (Math.random() < 0.3) { // 30% 확률로 메시지 표시
    if (characterState.fullness <= 20) {
      showMessage("😵 너무 배고파해요! 빨리 먹을 것을 주세요!");
    } else if (characterState.fullness <= 40) {
      showMessage("🍪 배가 고픈 것 같아요...");
    } else if (characterState.affection <= 10) {
      showMessage("😢 너무 오랫동안 관심을 주지 않아서 슬퍼하고 있어요...");
    } else if (characterState.affection <= 30) {
      showMessage("😔 조금 외로워하는 것 같아요.");
    } else {
      showMessage("🕐 시간이 지나고 있어요...");
    }
  }
}

function calculateOfflineAffectionLoss(offlineTime) {
  const hoursOffline = offlineTime / (1000 * 60 * 60); // 밀리초를 시간으로 변환
  const maxHours = TIME_SETTINGS.maxOfflineHours;
  const actualHours = Math.min(hoursOffline, maxHours);
  
  // 1시간마다 애정도 2씩 감소, 배부름 5씩 감소
  const affectionLoss = Math.floor(actualHours * 2);
  const fullnessDecrease = Math.floor(actualHours * 5);
  
  return { affectionLoss, fullnessDecrease };
}

function handleOfflineTime() {
  const currentTime = Date.now();
  const offlineTime = currentTime - characterState.lastActiveTime;
  
  // 1분 이상 오프라인이었다면 수치 변화
  if (offlineTime > 60000) {
    const { affectionLoss, fullnessDecrease } = calculateOfflineAffectionLoss(offlineTime);
    
    if (affectionLoss > 0 || fullnessDecrease > 0) {
      characterState.affection -= affectionLoss;
      characterState.affection = Math.max(0, characterState.affection);
      
      characterState.fullness -= fullnessDecrease;
      characterState.fullness = Math.max(0, characterState.fullness);
      
      updateMood();
      
      const hoursOffline = Math.floor(offlineTime / (1000 * 60 * 60));
      const minutesOffline = Math.floor((offlineTime % (1000 * 60 * 60)) / (1000 * 60));
      
      let message = "";
      if (hoursOffline > 0) {
        message = `😔 ${hoursOffline}시간 ${minutesOffline}분 동안 혼자 있어서`;
      } else {
        message = `😔 ${minutesOffline}분 동안 혼자 있어서`;
      }
      
      if (affectionLoss > 0 && fullnessDecrease > 0) {
        message += ` 애정도가 ${affectionLoss} 감소하고 배부름이 ${fullnessDecrease} 감소했어요.`;
      } else if (affectionLoss > 0) {
        message += ` 애정도가 ${affectionLoss} 감소했어요.`;
      } else if (fullnessDecrease > 0) {
        message += ` 배부름이 ${fullnessDecrease} 감소했어요.`;
      }
      
      showMessage(message);
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
    case "use-snack":
      useItem("snack");
      return; // useItem에서 이미 상태 업데이트와 메시지 처리를 하므로 return
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
  saveStateToLocal();
}

function saveStateToLocal() {
  const data = {
    affection: characterState.affection,
    fullness: characterState.fullness,
    mood: characterState.mood,
    lastActiveTime: characterState.lastActiveTime,
    coins: characterState.coins,
    inventory: characterState.inventory
  };
  localStorage.setItem("myGameState", JSON.stringify(data));
}

function loadStateFromLocal() {
  const saved = localStorage.getItem("myGameState");
  if (saved) {
    try {
      const data = JSON.parse(saved);
      characterState.affection = data.affection || 50;
      characterState.fullness = data.fullness || 100;
      characterState.mood = data.mood || "보통";
      characterState.lastActiveTime = data.lastActiveTime || Date.now();
      characterState.coins = data.coins || 10;
      characterState.inventory = data.inventory || { snacks: 0 };
    } catch (e) {
      console.error("로컬 데이터 파싱 오류:", e);
    }
  }
}

function updateShopButtons() {
  const shopButtons = document.querySelectorAll(".shop-btn");
  shopButtons.forEach((btn) => {
    const price = parseInt(btn.getAttribute("data-price"));
    if (characterState.coins < price) {
      btn.disabled = true;
      btn.textContent = "코인 부족";
    } else {
      btn.disabled = false;
      btn.textContent = "구매";
    }
  });
}

function buyItem(itemType, price) {
  if (characterState.coins < price) {
    showMessage("💰 코인이 부족합니다!");
    return false;
  }
  
  characterState.coins -= price;
  
  switch (itemType) {
    case "snack":
      characterState.inventory.snacks += 1;
      showMessage("🍪 과자를 구매했습니다! 인벤토리에서 확인하세요.");
      break;
    default:
      showMessage("알 수 없는 아이템입니다.");
      return false;
  }
  
  renderStatus();
  saveStateToLocal();
  return true;
}

function useItem(itemType) {
  switch (itemType) {
    case "snack":
      if (characterState.inventory.snacks <= 0) {
        showMessage("🍪 과자가 없습니다! 상점에서 구매하세요.");
        return false;
      }
      
      characterState.inventory.snacks -= 1;
      characterState.fullness += 25;
      characterState.fullness = Math.min(100, characterState.fullness);
      characterState.affection += 3;
      showMessage("🍪 인벤토리에서 과자를 주었어요! 배가 불러지고 애정도도 올랐습니다!");
      
      renderStatus();
      saveStateToLocal();
      return true;
      
    default:
      showMessage("사용할 수 없는 아이템입니다.");
      return false;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadStateFromLocal();
  handleOfflineTime(); // 오프라인 시간 처리
  renderStatus();
  startAffectionTimer(); // 애정도 감소 타이머 시작

  // 액션 버튼 이벤트
  const buttons = document.querySelectorAll(".action-btn");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const action = btn.getAttribute("data-action");
      handleAction(action);
    });
  });
  
  // 상점 버튼 이벤트
  const shopButtons = document.querySelectorAll(".shop-btn");
  shopButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.getAttribute("data-item");
      const price = parseInt(btn.getAttribute("data-price"));
      buyItem(item, price);
    });
  });
});
