class AlarmManager {
  constructor() {
    this.startButton = document.getElementById("startButton");
    this.stopButton = document.getElementById("stopButton");
    this.nextAlarmElement = document.getElementById("nextAlarm");
    this.alarmCountElement = document.getElementById("alarmCount");
    this.startTimeElement = document.getElementById("startTime");
    this.intervalHoursInput = document.getElementById("intervalHours");
    this.intervalMinutesInput = document.getElementById("intervalMinutes");
    this.breakMinutesInput = document.getElementById("breakMinutes");
    this.alarm1 = document.getElementById("alarm1");
    this.alarm2 = document.getElementById("alarm2");

    // 사용자 정의 알람 파일 요소
    this.startAlarmFileInput = document.getElementById("startAlarmFile");
    this.endAlarmFileInput = document.getElementById("endAlarmFile");
    this.startAlarmDurationInput =
      document.getElementById("startAlarmDuration");
    this.endAlarmDurationInput = document.getElementById("endAlarmDuration");
    this.testStartAlarmButton = document.getElementById("testStartAlarm");
    this.testEndAlarmButton = document.getElementById("testEndAlarm");
    this.soundContainer = document.querySelector(".sound-container");

    this.alarmCount = 0;
    this.isRunning = false;
    this.alarmInterval = null;
    this.secondAlarmTimeout = null;
    this.alarm1Timeout = null;
    this.alarm2Timeout = null;
    this.nextAlarmTimeout = null;
    this.intervalHours = 2; // 기본값 2시간
    this.intervalMinutes = 0; // 기본값 0분
    this.breakMinutes = 10; // 기본값 10분
    this.startAlarmDuration = 4; // 기본값 4초
    this.endAlarmDuration = 7; // 기본값 7초

    this.initializeEventListeners();
  }

  initializeEventListeners() {
    this.startButton.addEventListener("click", () => this.startAlarm());
    this.stopButton.addEventListener("click", () => this.stopAlarm());
    this.intervalHoursInput.addEventListener("change", () =>
      this.updateInterval()
    );
    this.intervalMinutesInput.addEventListener("change", () =>
      this.updateInterval()
    );
    this.breakMinutesInput.addEventListener("change", () =>
      this.updateBreakTime()
    );
    this.startAlarmDurationInput.addEventListener("change", () =>
      this.updateAlarmDurations()
    );
    this.endAlarmDurationInput.addEventListener("change", () =>
      this.updateAlarmDurations()
    );

    // 사용자 정의 알람 파일 이벤트 리스너
    this.startAlarmFileInput.addEventListener("change", () =>
      this.updateStartAlarmSound()
    );
    this.endAlarmFileInput.addEventListener("change", () =>
      this.updateEndAlarmSound()
    );
    this.testStartAlarmButton.addEventListener("click", () =>
      this.testStartAlarm()
    );
    this.testEndAlarmButton.addEventListener("click", () =>
      this.testEndAlarm()
    );
  }

  // 휴식 시간 업데이트
  updateBreakTime() {
    const minutes = parseInt(this.breakMinutesInput.value);

    if (!isNaN(minutes) && minutes >= 1 && minutes <= 60) {
      this.breakMinutes = minutes;
    } else {
      this.breakMinutesInput.value = "10";
      this.breakMinutes = 10;
    }
  }

  // 알람 재생 시간 업데이트
  updateAlarmDurations() {
    const startDuration = parseInt(this.startAlarmDurationInput.value);
    const endDuration = parseInt(this.endAlarmDurationInput.value);

    if (!isNaN(startDuration) && startDuration >= 1 && startDuration <= 30) {
      this.startAlarmDuration = startDuration;
    } else {
      this.startAlarmDurationInput.value = "4";
      this.startAlarmDuration = 4;
    }

    if (!isNaN(endDuration) && endDuration >= 1 && endDuration <= 30) {
      this.endAlarmDuration = endDuration;
    } else {
      this.endAlarmDurationInput.value = "7";
      this.endAlarmDuration = 7;
    }
  }

  // 알람 소리 설정이 유효한지 확인
  hasAlarmSounds() {
    return (
      this.alarm1.src &&
      this.alarm1.src.trim() !== "" &&
      this.alarm2.src &&
      this.alarm2.src.trim() !== ""
    );
  }

  updateStartAlarmSound() {
    const file = this.startAlarmFileInput.files[0];
    if (file) {
      const objectURL = URL.createObjectURL(file);
      this.alarm1.src = objectURL;
    }
  }

  updateEndAlarmSound() {
    const file = this.endAlarmFileInput.files[0];
    if (file) {
      const objectURL = URL.createObjectURL(file);
      this.alarm2.src = objectURL;
    }
  }

  testStartAlarm() {
    // 먼저 현재 재생중인 알람을 중지
    this.alarm1.pause();
    this.alarm1.currentTime = 0;
    this.alarm2.pause();
    this.alarm2.currentTime = 0;

    // 사용자가 설정한 시간 가져오기
    this.updateAlarmDurations();

    // 시작 알람 테스트 재생
    this.alarm1.play();
    setTimeout(() => {
      this.alarm1.pause();
      this.alarm1.currentTime = 0;
    }, this.startAlarmDuration * 1000); // 사용자가 설정한 시간만큼 재생
  }

  testEndAlarm() {
    // 먼저 현재 재생중인 알람을 중지
    this.alarm1.pause();
    this.alarm1.currentTime = 0;
    this.alarm2.pause();
    this.alarm2.currentTime = 0;

    // 사용자가 설정한 시간 가져오기
    this.updateAlarmDurations();

    // 종료 알람 테스트 재생
    this.alarm2.play();
    setTimeout(() => {
      this.alarm2.pause();
      this.alarm2.currentTime = 0;
    }, this.endAlarmDuration * 1000); // 사용자가 설정한 시간만큼 재생
  }

  updateInterval() {
    const hours = parseInt(this.intervalHoursInput.value);
    const minutes = parseInt(this.intervalMinutesInput.value);

    if (!isNaN(hours) && hours >= 0) {
      this.intervalHours = hours;
    } else {
      this.intervalHoursInput.value = "2";
      this.intervalHours = 2;
    }

    if (!isNaN(minutes) && minutes >= 0 && minutes < 60) {
      this.intervalMinutes = minutes;
    } else {
      this.intervalMinutesInput.value = "0";
      this.intervalMinutes = 0;
    }

    // 시간과 분이 모두 0인 경우 최소 10분으로 설정
    if (this.intervalHours === 0 && this.intervalMinutes === 0) {
      this.intervalMinutesInput.value = "10";
      this.intervalMinutes = 10;
    }
  }

  startAlarm() {
    if (this.isRunning) return;

    // 입력된 시간 값 업데이트
    this.updateInterval();
    this.updateBreakTime();
    this.updateAlarmDurations();

    // 입력 필드 비활성화
    this.intervalHoursInput.disabled = true;
    this.intervalMinutesInput.disabled = true;
    this.breakMinutesInput.disabled = true;

    // 알람 소리 설정 비활성화
    this.startAlarmFileInput.disabled = true;
    this.endAlarmFileInput.disabled = true;
    this.startAlarmDurationInput.disabled = true;
    this.endAlarmDurationInput.disabled = true;
    this.testStartAlarmButton.disabled = true;
    this.testEndAlarmButton.disabled = true;

    // 사운드 컨테이너의 스타일 변경
    this.soundContainer.classList.add("disabled-section");

    this.isRunning = true;
    this.startButton.disabled = true;
    this.stopButton.disabled = false;

    // 시작 시간 표시
    const startTime = new Date();
    this.startTimeElement.textContent = `시작 시간: ${this.formatTime(
      startTime
    )}`;

    this.scheduleNextAlarm();
  }

  stopAlarm() {
    if (!this.isRunning) return;

    this.isRunning = false;
    this.startButton.disabled = false;
    this.stopButton.disabled = true;

    // 입력 필드 활성화
    this.intervalHoursInput.disabled = false;
    this.intervalMinutesInput.disabled = false;
    this.breakMinutesInput.disabled = false;

    // 알람 소리 설정 활성화
    this.startAlarmFileInput.disabled = false;
    this.endAlarmFileInput.disabled = false;
    this.startAlarmDurationInput.disabled = false;
    this.endAlarmDurationInput.disabled = false;
    this.testStartAlarmButton.disabled = false;
    this.testEndAlarmButton.disabled = false;

    // 사운드 컨테이너의 스타일 복원
    this.soundContainer.classList.remove("disabled-section");

    clearTimeout(this.alarmInterval);
    clearTimeout(this.secondAlarmTimeout);
    clearTimeout(this.alarm1Timeout);
    clearTimeout(this.alarm2Timeout);
    clearTimeout(this.nextAlarmTimeout);
    this.alarm1.pause();
    this.alarm2.pause();
    this.nextAlarmElement.textContent = "다음 알람: --:--";
    this.startTimeElement.textContent = "시작 시간: --:--";
  }

  scheduleNextAlarm() {
    const now = new Date();
    // 사용자가 설정한 시간 값을 사용하여 다음 알람 시간 계산
    const intervalMs =
      (this.intervalHours * 60 + this.intervalMinutes) * 60 * 1000;
    const nextAlarmTime = new Date(now.getTime() + intervalMs);

    this.nextAlarmElement.textContent = `다음 알람: ${this.formatTime(
      nextAlarmTime
    )}`;

    const timeUntilAlarm = nextAlarmTime.getTime() - now.getTime();

    this.alarmInterval = setTimeout(() => {
      this.playFirstAlarm();
    }, timeUntilAlarm);
  }

  playFirstAlarm() {
    if (!this.isRunning) return;

    this.alarmCount++;
    this.alarmCountElement.textContent = `알람 횟수: ${this.alarmCount}`;

    // 휴식 시간 표시
    this.nextAlarmElement.textContent = "휴식 시간";

    this.alarm1.play();
    // 사용자가 설정한 시간 후 첫 번째 알람 중지
    this.alarm1Timeout = setTimeout(() => {
      this.alarm1.pause();
      this.alarm1.currentTime = 0;
    }, this.startAlarmDuration * 1000);

    // 사용자가 설정한 휴식 시간 후 두 번째 알람
    const breakTimeMs = this.breakMinutes * 60 * 1000;
    this.secondAlarmTimeout = setTimeout(() => {
      if (this.isRunning) {
        this.alarm2.play();
        // 사용자가 설정한 시간 후 두 번째 알람 중지
        this.alarm2Timeout = setTimeout(() => {
          this.alarm2.pause();
          this.alarm2.currentTime = 0;

          // 두 번째 알람이 끝난 후 다음 알람 스케줄링
          this.scheduleNextAlarmAfterBreak();
        }, this.endAlarmDuration * 1000);
      }
    }, breakTimeMs);
  }

  scheduleNextAlarmAfterBreak() {
    if (!this.isRunning) return;

    const now = new Date();
    // 사용자가 설정한 시간 값을 사용하여 다음 알람 시간 계산
    const intervalMs =
      (this.intervalHours * 60 + this.intervalMinutes) * 60 * 1000;
    const nextAlarmTime = new Date(now.getTime() + intervalMs);

    this.nextAlarmElement.textContent = `다음 알람: ${this.formatTime(
      nextAlarmTime
    )}`;

    const timeUntilAlarm = nextAlarmTime.getTime() - now.getTime();

    this.alarmInterval = setTimeout(() => {
      this.playFirstAlarm();
    }, timeUntilAlarm);
  }

  formatTime(date) {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  }
}

// 알람 매니저 초기화
const alarmManager = new AlarmManager();
