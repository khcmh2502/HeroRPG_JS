const enterBtn = document.querySelector('#enter-btn');
const entranceSection = document.querySelector('#entrance');
const createHeroSection = document.querySelector('#create-hero');
const heroGenerator = document.querySelector('#hero-generator');
const gameScreen = document.querySelector('#game-screen');
const frameBox = document.querySelector(".frame-box");
const heroImg = document.querySelector("#hero-img");

const subdueBtn = document.querySelector('#subdue-btn');
const shopBtn = document.querySelector('#shop-btn');

const heroProfile = document.querySelector('.hero-profile');
const hpValue = document.querySelector('#hp');
const mpValue = document.querySelector('#mp');
const moneyValue = document.querySelector('#money');

// 토벌 진행 유무
let isSuppression = false;

// 영웅 정보를 객체로 관리
let myHero = {
  name: "",
  img: "",
  job: "전사",
  gender: "남자",
  hp: 0,
  mp: 0,
  money: 100
};

// hero 상태 업데이트 함수
function updateHeroStats() {
  hpValue.innerText = myHero.hp;
  mpValue.innerText = myHero.mp;
  moneyValue.innerText = "Gold : " + myHero.money;
}

// 게임 입장 버튼 클릭 시
enterBtn.addEventListener('click', () => {

  // entrance 섹션 숨기기
  entranceSection.style.display = 'none';

  // create-hero 섹션 보이기
  createHeroSection.style.display = 'block';

});

// createHeroSection가 화면에 존재하는 상태라면
if (createHeroSection) {

  // input태그 중 name값이 job인 요소 모두와 gender인 요소 모두 얻어오기
  const jobRadios = document.querySelectorAll('input[name="job"]');
  const genderRadios = document.querySelectorAll('input[name="gender"]');

  // 닉네임 input 요소
  const nicknameInput = document.querySelector('input[name="nickname"]');

  // 생성하기 버튼
  const generatorBtn = document.querySelector('#generator-btn');

  // 선택 직업과 성별 초기값 세팅(변할 수 있으므로 let으로 선언)
  let selectJob = "전사";
  let selectGender = "남자";

  // 얻어온 job input요소들을 반복하여 각 input에 변화가 일어날때마다 선택한 
  // input 태그 value 값으로 변경 및 이미지 변경 함수(changeHeroImg)에 전달
  jobRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      selectJob = radio.value;
      changeHeroImg(selectJob, selectGender);
    })
  })

  // 얻어온 gender input요소들을 반복하여 각 input에 변화가 일어날때마다 선택한 
  // input 태그 value 값으로 변경 및 이미지 변경 함수(changeHeroImg)에 전달
  genderRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      selectGender = radio.value;
      changeHeroImg(selectJob, selectGender);
    })
  })

  // 캐릭터 생성하기 버튼 클릭 시
  generatorBtn.addEventListener('click', () => {
    if (nicknameInput.value.length == 0) {
      alert('닉네임을 설정해주세요.');
      return;
    }

    myHero.name = nicknameInput.value;
    myHero.img = `${selectJob}_${selectGender}.png`;

    switch (selectJob) {
      case '전사': myHero.hp = 500; myHero.mp = 100; break;
      case '마법사': myHero.hp = 200; myHero.mp = 500; break;
      case '궁수': myHero.hp = 400; myHero.mp = 300; break;
    }

    createHeroSection.style.display = 'none';
    gameScreen.style.display = 'flex';

    heroProfile.children[0].src = `../../images/${myHero.img}`;
    heroProfile.children[1].innerText = `영웅 [ ${myHero.name} ] 님`;

    updateHeroStats(); // 캐릭터 업데이트

  });

}

// 매개변수로 전달받은 job, gender로 이미지명 조합하여 heroImg의 src값 변경하기
function changeHeroImg(job, gender) {
  // 페이드아웃
  heroImg.style.opacity = "0";

  setTimeout(() => {
    // 이미지 변경
    heroImg.src = `../../images/${job}_${gender}.png`;

    // 페이드인
    heroImg.style.opacity = "1";
  }, 500); // 0.5초 후 변경 (transition-duration보다 작아야 부드러움)
}

// 토벌시작 버튼 클릭 시
if (subdueBtn) {
  subdueBtn.addEventListener("click", () => {

    if (isOpenShop) {
      alert("상점을 나가셔야 합니다");
      return;
    }

    if (isSuppression && subdueBtn.classList.contains('disabled-btn')) {
      alert('이미 토벌 중 입니다');
      return;
    }

    isSuppression = true; // 토벌중으로 변경
    subdueBtn.classList.add('disabled-btn');

    const battleLog = document.querySelector('.log');
    const li = document.createElement('li');
    li.innerText = '💂‍♂️ [토벌을 위해 당신의 군대가 출정합니다.]';
    battleLog.append(li);

    startGame(battleLog);
  });
}

// 게임 오버 처리 함수
function handleGameOver(message, battleLog, li) {
  li.innerText += message;
  battleLog.append(li);

  // "토벌 완료" 버튼 동적으로 생성
  const finishBtn = document.createElement("button");
  finishBtn.innerText = "토벌 완료";
  finishBtn.classList.add("finish-btn");
  battleLog.append(finishBtn);

  // 로그가 추가되어도 스크롤이 계속 아래에 고정되게 설정
  const logBox = document.querySelector(".log-box");
  logBox.scrollTop = logBox.scrollHeight;

  clearInterval(gameInterval); // 게임 루프 종료
  subdueBtn.classList.remove('disabled-btn'); // 토벌 시작 버튼 활성화

  // "토벌 완료" 버튼 클릭 시 battleLog 비우기
  finishBtn.addEventListener("click", () => {
    isSuppression = false; // 토벌 완료
    battleLog.innerHTML = ""; // battleLog 내용 비우기
  });
}


let gameInterval; // 게임 인터벌 함수 저장 변수

// 게임 시작
function startGame(battleLog) {

  gameInterval = setInterval(() => {

    const li = document.createElement('li');

    // HP가 0 이하이면 게임 오버
    if (myHero.hp <= 0) {
      handleGameOver("\n☠️ 체력이 다해 쓰러졌습니다. 마을로 귀환합니다...", battleLog, li);
      return;
    }

    // mp 부족하면 게임 오버
    if (myHero.mp <= 0) {
      handleGameOver("\n💦 마력이 모두 떨어져 마을로 귀환합니다...", battleLog, li);
      return;
    }


    let randomEvent = Math.floor(Math.random() * 3); // 0~2 난수 생성

    if (randomEvent == 0) {
      li.innerText = "🚶‍♂️ 평화로운 곳이다. 계속 이동...";
      battleLog.append(li);

    } else if (randomEvent == 1) {
      li.innerText = "👹 고블린이 나타났다!";
      battleLog.append(li);

      clearInterval(gameInterval); // 일시 정지
      handleGoblinEvent(battleLog); // 플레이어의 선택을 기다림
    } else if (randomEvent == 2) {
      li.innerText = "💎 보물을 발견했다! (+ 300Gold)";
      myHero.money += 300;
      updateHeroStats();

      battleLog.append(li);
    }

    // 로그가 추가되어도 스크롤이 계속 아래에 고정되어있게 설정
    const logBox = document.querySelector(".log-box");
    logBox.scrollTop = logBox.scrollHeight;

  }, 500); // 1.5초마다 실행


}

// 고블린 나타났을 때 이벤트 (사용자 선택 버튼 노출)
function handleGoblinEvent(battleLog) {

  const btnLi = document.createElement('li');

  const fightBtn = document.createElement('button');
  fightBtn.classList.add('choice-btn');
  fightBtn.innerHTML = "싸운다"
  fightBtn.onclick = () => handleGoblinEventResult(2, battleLog); // 클릭될 때 실행

  const runBtn = document.createElement('button');
  runBtn.classList.add('choice-btn');
  runBtn.innerHTML = "도망간다"
  runBtn.onclick = () => handleGoblinEventResult(1, battleLog); // 클릭될 때 실행

  btnLi.append(fightBtn, runBtn);
  battleLog.append(btnLi);

}

// 고블린 싸움 이벤트 선택과 결과
function handleGoblinEventResult(choice, battleLog) {
  const li = document.createElement('li');

  if (choice == 1) {
    // 도망 확률 적용 (성공 40%, 실패 30%, 돈흘림 30%)
    let escapeChance = Math.random() * 100; // 0~99 난수 생성

    if (escapeChance < 40) {
      li.innerText = "🏃‍♂️ 도망쳤다! 다시 이동 시작! (MP -10)";
      if (myHero.mp < 50) myHero.mp = 0;
      else myHero.mp -= 10;

    } else if (escapeChance < 70) {
      li.innerText = "😱 도망치다 잡혀서 공격당했다! (HP -50)";
      if (myHero.hp < 50) myHero.hp = 0;
      else myHero.hp -= 50;

    } else {
      li.innerText = "💰 도망치다가 돈을 흘렸다! (- 50Gold)";
      if (myHero.money < 50) myHero.money = 0;
      else myHero.money -= 50;
    }

    updateHeroStats();

  } else if (choice == 2) {
    // 싸울 확률 적용 (승리 60%, 패배 40%)
    let fightChance = Math.random() * 100;

    if (fightChance < 60) {
      li.innerText = "⚔️ 고블린과 싸워 승리했다! (+ 100Gold)";
      myHero.money += 100;
      updateHeroStats();

    } else {
      li.innerText = "💀 고블린과 싸웠지만 패배했다...(HP -100)";
      if (myHero.hp < 100) myHero.hp = 0;
      else myHero.hp -= 100;
      updateHeroStats();

    }
  }

  battleLog.append(li);

  // 버튼 제거
  const buttons = document.querySelectorAll(".log button");
  buttons.forEach(button => button.remove());

  startGame(battleLog); // 다시 게임 진행
}


let isOpenShop = false;
// 아이템 상점 로그 출력 함수

if (shopBtn) {
  shopBtn.addEventListener('click', () => {
    const shopLog = document.querySelector('.log');

    if (isOpenShop) {
      isOpenShop = false; // 나가기
      shopBtn.innerText = '상점';
      shopLog.innerHTML = "";
      return;

    } else {
      if(isSuppression) {
        alert('토벌을 완료하셔야 합니다');
        return;
      }

      isOpenShop = true; // 상점 들어옴
      shopBtn.innerText = '나가기';
      createShopItems(shopLog);
    }

  });
}

// 
function createShopItems(logList) {
  const priceSpan = document.createElement('span');

  const items = [
    { name: "💖 HP(+50) 드링크", id: "hpCount", price: 500 },
    { name: "💙 MP(+20) 드링크", id: "mpCount", price: 700 }
  ];

  items.forEach(item => {
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = `${item.name} : 💰${item.price} Gold`;

    const input = document.createElement("input");
    input.type = "number";
    input.id = item.id;
    input.min = "0";
    input.value = "0";
    input.addEventListener("input", () => {
      priceSpan.innerText = `총 가격 : ${updateTotalPrice()} Gold`;
    }); // 입력값 변경 시 가격 업데이트

    li.appendChild(span);
    li.appendChild(input);
    logList.appendChild(li);
    logList.appendChild(priceSpan);
  });

  // 구매 버튼 추가
  const buyLi = document.createElement("li");
  const buyButton = document.createElement("button");
  buyButton.classList.add('buy-btn');
  buyButton.textContent = "구매";
  buyButton.addEventListener("click", buyItems);
  buyLi.appendChild(buyButton);
  logList.appendChild(buyLi);
}

// 최종 금액 업데이트 함수
function updateTotalPrice() {
  const hpCount = parseInt(document.getElementById("hpCount").value) || 0;
  const mpCount = parseInt(document.getElementById("mpCount").value) || 0;

  const totalPrice = (hpCount * 500) + (mpCount * 700);

  return totalPrice;
}

// 아이템 구매
function buyItems() {
  const logList = document.querySelector(".log");
  const hpCount = parseInt(document.getElementById("hpCount").value);
  const mpCount = parseInt(document.getElementById("mpCount").value);

  const hpPrice = 500 * hpCount;
  const mpPrice = 700 * mpCount;
  const totalPrice = hpPrice + mpPrice;

  let logMessage = "";

  if (hpCount == 0 && mpCount == 0) {
    alert('구매 아이템 갯수가 없습니다.');
  } else {

    if (myHero.money < totalPrice) {
      logMessage += '❌ 금액 부족';

    } else {
      logMessage += `${totalPrice} Gold 결제 완료 |`;
      myHero.money -= totalPrice;

      if (hpCount > 0) {
        logMessage += ` 💖HP ${hpCount * 50} 회복`;
        myHero.hp += hpCount * 50;
      }

      if (mpCount > 0) {
        logMessage += ` 💙MP ${mpCount * 20} 회복`;
        myHero.mp += mpCount * 20;
      }

      updateHeroStats();
    }

  }



  const logEntry = document.createElement("li");
  logEntry.textContent = logMessage;
  logList.appendChild(logEntry);

  logList.scrollTop = logList.scrollHeight; // 자동 스크롤
}