"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Cat, DiceFace, Doodle } from "./_components/PaperVisuals";
import { InteractionSounds } from "./_components/InteractionSounds";

type Question = {
  prompt: string;
  answers: string[];
};

const questions: Question[] = [
  {
    prompt: "Are you really the one he intended this for?",
    answers: ["Yes", "No", "Probably", "Definitely not"],
  },
  {
    prompt: "How tall is the suspiciously adorable guest?",
    answers: ["5'20\"", "approximately three cats", "5'2\"", "one medium tree"],
  },
  {
    prompt: "Can a capybara draw?",
    answers: [
      "Only on weekends",
      "Yes, he can!",
      "no but he can judge your art",
      "absolutely not because of paws",
    ],
  },
];

const scenes = [
  {
    eyebrow: "SCENE 01 / BOOT SEQUENCE",
    title: "Initializing courage...",
    text: "Searching for something normal to say...",
    note: "ERROR 500: INTERNAL SERVER ERROR",
    button: "START GAME",
  },
  {
    eyebrow: "SCENE 02 / FLIRTING SIMULATOR",
    title: "What does he do when your name appears on his screen?",
    text: "All available options have been classified as confidential.",
    note: "The cat is watching.",
    button: "CONTINUE",
  },
  {
    eyebrow: "SCENE 03 / OLD SAVE FILE",
    title: "The save file is a little emotionally disorganized.",
    text: "Choose a memory to load. The archive is being weirdly specific.",
    note: "Not that anyone is happy about it.",
    button: "CONTINUE",
  },
  {
    eyebrow: "SCENE 04 / MUSIC + DOODLES",
    title: "A little room for a little art.",
    text: "Some people turn a blank page into something beautiful. I can turn a blank page into a blank page.",
    note: "試験、頑張ってね。応援してるよ。",
    button: "CONTINUE",
  },
  {
    eyebrow: "SCENE 05 / UNSENT MESSAGE",
    title: "There is something in the envelope.",
    text: "A message has been sealed in a very suspicious envelope.",
    note: "You didn't see anything. We were never here.",
    button: "KEEP THIS SECRET",
  },
  {
    eyebrow: "END OF TRANSMISSION",
    title: "Anyway, pretend you didn't see any of this.",
    text: "— UNSENT.EXE",
    note: "The cat has left the chat.",
    button: "PLAY AGAIN",
  },
];

const tracks = [
  { label: "Still With You", src: "/assets/audio/still-with-you.mp3" },
  { label: "Make It Right", src: "/assets/audio/Make It Right.mp3" },
  { label: "Glue Song", src: "/assets/audio/Glue Song.mp3" },
  { label: "Daisy Crown", src: "/assets/audio/Daisy Crown.mp3" },
  { label: "Boy With Luv", src: "/assets/audio/Boy With Luv.mp3" },
  { label: "A Small Miracle", src: "/assets/audio/A Small Miracle.m4a" },
  { label: "EUPHORIA", src: "/assets/audio/EUPHORIA.mp3" },
  {
    label: "Eyes, Nose, Lips",
    src: "/assets/audio/Eyes, nose, lips - Taeyang - KPop.m4a",
  },
];

const STORAGE_KEY = "unsent-exe-playthrough";
const level07Words = [
  "You were",
  "like a",
  "distant star,",
  "too far",
  "away for",
  "me to reach,",
  "no matter",
  "how hard I tried,",
  "so I never did.",
];

export default function Home() {
  const [mode, setMode] = useState<
    "boot" | "check" | "confirmation" | "nickname" | "game"
  >("boot");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [answerWasWrong, setAnswerWasWrong] = useState(false);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [answerCorrect, setAnswerCorrect] = useState<boolean | null>(null);
  const [nickname, setNickname] = useState("");
  const [sceneIndex, setSceneIndex] = useState(0);
  const [envelopeOpened, setEnvelopeOpened] = useState(false);
  const [envelopeSkipped, setEnvelopeSkipped] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const [audioLoading, setAudioLoading] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioStarted, setAudioStarted] = useState(false);
  const [audioMuted, setAudioMuted] = useState(false);
  const [simulatorChoice, setSimulatorChoice] = useState("");
  const [simulatorFeedbackVisible, setSimulatorFeedbackVisible] =
    useState(false);
  const [currentSaveLevel, setCurrentSaveLevel] = useState<number | null>(2);
  const [openSaveLevel, setOpenSaveLevel] = useState<number | null>(null);
  const [loadingSaveLevel, setLoadingSaveLevel] = useState<number | null>(null);
  const [completedSaveLevels, setCompletedSaveLevels] = useState<number[]>([]);
  const [saveGameLevel, setSaveGameLevel] = useState<number | null>(null);
  const [wordSequence, setWordSequence] = useState<number[]>([]);
  const [wordTileOrder, setWordTileOrder] = useState([
    6, 2, 8, 0, 5, 1, 7, 3, 4,
  ]);
  const [handProgress, setHandProgress] = useState(0);
  const [handRubbing, setHandRubbing] = useState(false);
  const [secretWaitProgress, setSecretWaitProgress] = useState(0);
  const [completionReveal, setCompletionReveal] = useState<{
    title: string;
    message: string;
  } | null>(null);
  const [answerHistory, setAnswerHistory] = useState<number[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);
  const drawingHistoryRef = useRef<string[]>([]);
  const drawingHistoryIndexRef = useRef(-1);
  const [sketchbookOpen, setSketchbookOpen] = useState(false);
  const [luckyNoteOpen, setLuckyNoteOpen] = useState(false);
  const [drawingColor, setDrawingColor] = useState("#263347");
  const [drawingSize, setDrawingSize] = useState(2);
  const [drawingEraser, setDrawingEraser] = useState(false);
  const [drawingRevision, setDrawingRevision] = useState(0);
  const [nicknameWasEdited, setNicknameWasEdited] = useState(false);
  const [nicknameRolling, setNicknameRolling] = useState(false);
  const [diceRolling, setDiceRolling] = useState(false);
  const [nicknameInvalid, setNicknameInvalid] = useState(false);
  const [nicknameShake, setNicknameShake] = useState(false);
  const [nicknamePlaceholderVisible, setNicknamePlaceholderVisible] =
    useState(false);
  const [diceFace, setDiceFace] = useState(1);
  const [hydrated, setHydrated] = useState(false);
  const [replayLoading, setReplayLoading] = useState(false);
  const [replayUnlocked, setReplayUnlocked] = useState(false);
  const [replayMessage, setReplayMessage] = useState("");
  const [storageReady, setStorageReady] = useState(false);
  const nicknameTimerRef = useRef<number | null>(null);
  const nicknameFinishTimerRef = useRef<number | null>(null);
  const diceStopTimerRef = useRef<number | null>(null);
  const nicknamePlaceholderTimerRef = useRef<number | null>(null);
  const saveLoadTimerRef = useRef<number | null>(null);
  const replayLoadTimerRef = useRef<number | null>(null);
  const handMotionRef = useRef(0);

  const envelopeCopy = useMemo(
    () =>
      [
        `Hey, ${nickname || "you"}.`,
        "This is everything I wrote but never managed to send.",
        `If you are wondering, "Why now? Where have you been all this time?", it is because every time I wanted to send you a text, I kept feeling like I wasn't good enough for you and that I might never be. So I just stopped trying altogether.`,
        "But I'm really glad I texted you that day because it has been really nice talking to you again. It made me realize that I want to know everything I have missed about you all these years. I wish I had been there for you when you needed someone. And I regret everything I did. I really wish I had texted you sooner.",
        "I don't expect anything from you. I just want you to know that every days and nights, you were always there in my daydreams. I've missed you so much.",
      ].join("\n\n"),
    [nickname],
  );

  const question = questions[questionIndex];
  const scene = scenes[sceneIndex];
  const sceneContinueLocked =
    sceneIndex === 2 && completedSaveLevels.length < 3;
  const progress = useMemo(
    () => `${questionIndex + 1} / ${questions.length}`,
    [questionIndex],
  );

  async function chooseAnswer(index: number) {
    setChosen(index);
    setAnswerWasWrong(false);
    setFeedbackVisible(false);
    setAnswerCorrect(null);
    setAnswerHistory((history) => {
      const next = [...history];
      next[questionIndex] = index;
      return next;
    });
    try {
      const response = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionIndex, answerIndex: index }),
      });
      const result = (await response.json()) as { correct?: boolean };
      setAnswerCorrect(Boolean(result.correct));
      setAnswerWasWrong(!result.correct);
    } catch {
      setMessage("The cat lost the signal. You may continue anyway.");
    }
  }

  function nextQuestion() {
    if (!feedbackVisible) {
      setFeedbackVisible(true);
      setMessage(
        answerCorrect
          ? "Hmm. Suspiciously correct."
          : "NICE TRY — the cat has recorded your suspicious behavior. You may continue anyway.",
      );
      return;
    }
    if (questionIndex < questions.length - 1) {
      setQuestionIndex((value) => value + 1);
      setChosen(null);
      setMessage("");
      setAnswerWasWrong(false);
      setFeedbackVisible(false);
      setAnswerCorrect(null);
    } else {
      void fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: answerHistory, nickname }),
      });
      setMode("confirmation");
    }
  }

  function startGame() {
    if (nicknameRolling) return;
    const cleanNickname = nickname.trim();
    if (!cleanNickname) {
      setNicknameInvalid(true);
      setNicknameShake(false);
      window.requestAnimationFrame(() => setNicknameShake(true));
      return;
    }
    setNicknameInvalid(false);
    void fetch("/api/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers: answerHistory, nickname }),
    });
    setMode("game");
    setSceneIndex(0);
  }

  function beginCheck() {
    setMode("check");
  }

  function nextScene() {
    if (sceneContinueLocked) return;
    if (sceneIndex === 4 && !envelopeOpened && !envelopeSkipped) {
      setEnvelopeSkipped(true);
      return;
    }
    if (sceneIndex === scenes.length - 1) {
      if (!replayUnlocked) {
        setReplayMessage(
          "Nuh uh, nothing comes for free, you have to keep talking to the person who made this every day if you want to play again :3",
        );
        return;
      }
      window.localStorage.removeItem(STORAGE_KEY);
      setStorageReady(false);
      setReplayLoading(true);
      if (replayLoadTimerRef.current !== null)
        window.clearTimeout(replayLoadTimerRef.current);
      replayLoadTimerRef.current = window.setTimeout(() => {
        setMode("boot");
        setQuestionIndex(0);
        setChosen(null);
        setMessage("");
        setAnswerWasWrong(false);
        setFeedbackVisible(false);
        setAnswerCorrect(null);
        setAnswerHistory([]);
        setNickname("");
        setNicknameWasEdited(false);
        setNicknameRolling(false);
        setDiceRolling(false);
        setNicknameInvalid(false);
        setNicknameShake(false);
        setSceneIndex(0);
        setEnvelopeOpened(false);
      setEnvelopeSkipped(false);
        setSimulatorChoice("");
        setSimulatorFeedbackVisible(false);
        setTrackIndex(0);
        setAudioProgress(0);
        setCurrentSaveLevel(2);
        setOpenSaveLevel(null);
        setCompletedSaveLevels([]);
        setSaveGameLevel(null);
        setCompletionReveal(null);
        setReplayMessage("");
        setReplayLoading(false);
        setStorageReady(true);
      }, 1800);
      return;
    }
    if (sceneIndex === 1 && simulatorChoice && !simulatorFeedbackVisible) {
      setSimulatorFeedbackVisible(true);
      return;
    }
    setSceneIndex(sceneIndex === scenes.length - 1 ? 0 : sceneIndex + 1);
    setEnvelopeOpened(false);
    setEnvelopeSkipped(false);
    setSimulatorChoice("");
    setSimulatorFeedbackVisible(false);
  }

  function chooseSimulatorChoice(choice: string) {
    setSimulatorChoice(choice);
    setSimulatorFeedbackVisible(false);
  }

  async function startAudio() {
    const audio = audioRef.current;
    if (!audio) return;
    setAudioError(false);
    setAudioLoading(true);
    try {
      await audio.play();
      setAudioStarted(true);
      setMusicPlaying(true);
    } catch {
      setAudioLoading(false);
      setAudioStarted(false);
    }
  }

  useEffect(() => {
    if (window.location.pathname === "/game") setMode("game");
    try {
      const saved = JSON.parse(
        window.localStorage.getItem(STORAGE_KEY) || "null",
      ) as Partial<Record<string, unknown>> | null;
      if (saved) {
        if (
          window.location.pathname !== "/game" &&
          typeof saved.mode === "string"
        )
          setMode(
            saved.mode as
              | "boot"
              | "check"
              | "confirmation"
              | "nickname"
              | "game",
          );
        if (typeof saved.questionIndex === "number")
          setQuestionIndex(saved.questionIndex);
        if (saved.chosen !== undefined)
          setChosen(saved.chosen as number | null);
        if (typeof saved.message === "string") setMessage(saved.message);
        if (typeof saved.answerWasWrong === "boolean")
          setAnswerWasWrong(saved.answerWasWrong);
        if (typeof saved.feedbackVisible === "boolean")
          setFeedbackVisible(saved.feedbackVisible);
        if (saved.answerCorrect !== undefined)
          setAnswerCorrect(saved.answerCorrect as boolean | null);
        if (typeof saved.nickname === "string") {
          setNickname(saved.nickname);
          setNicknameWasEdited(
            Boolean(saved.nickname.trim()) && saved.nickname !== "Nway Nway?",
          );
        }
        if (typeof saved.sceneIndex === "number")
          setSceneIndex(saved.sceneIndex);
        if (typeof saved.envelopeOpened === "boolean")
          setEnvelopeOpened(saved.envelopeOpened);
        if (typeof saved.envelopeSkipped === "boolean")
          setEnvelopeSkipped(saved.envelopeSkipped);
        if (typeof saved.trackIndex === "number")
          setTrackIndex(saved.trackIndex);
        if (typeof saved.audioMuted === "boolean")
          setAudioMuted(saved.audioMuted);
        if (typeof saved.simulatorChoice === "string")
          setSimulatorChoice(saved.simulatorChoice);
        if (Array.isArray(saved.completedSaveLevels))
          setCompletedSaveLevels(
            saved.completedSaveLevels.filter(
              (level): level is number =>
                typeof level === "number" && level >= 0 && level <= 2,
            ),
          );
        if (
          saved.currentSaveLevel === null ||
          (typeof saved.currentSaveLevel === "number" &&
            saved.currentSaveLevel >= 0 &&
            saved.currentSaveLevel <= 2)
        )
          setCurrentSaveLevel(saved.currentSaveLevel as number | null);
        if (Array.isArray(saved.answerHistory))
          setAnswerHistory(saved.answerHistory as number[]);
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    const readyTimer = window.setTimeout(() => {
      setStorageReady(true);
      setHydrated(true);
    }, 1800);
    void fetch("/api/replay")
      .then((response) => response.json())
      .then((data: { unlocked?: boolean }) =>
        setReplayUnlocked(Boolean(data.unlocked)),
      )
      .catch(() => setReplayUnlocked(false));
    void startAudio();
    const resumeAudio = () => void startAudio();
    window.addEventListener("pointerdown", resumeAudio, { once: true });
    window.addEventListener("keydown", resumeAudio, { once: true });
    return () => {
      window.clearTimeout(readyTimer);
      window.removeEventListener("pointerdown", resumeAudio);
      window.removeEventListener("keydown", resumeAudio);
    };
  }, []);

  useEffect(() => {
    if (!storageReady) return;
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        mode,
        questionIndex,
        chosen,
        message,
        answerWasWrong,
        feedbackVisible,
        answerCorrect,
        answerHistory,
        nickname,
        sceneIndex,
        envelopeOpened,
        envelopeSkipped,
        trackIndex,
        audioMuted,
        simulatorChoice,
        currentSaveLevel,
        completedSaveLevels,
      }),
    );
  }, [
    storageReady,
    mode,
    questionIndex,
    chosen,
    message,
    answerWasWrong,
    feedbackVisible,
    answerCorrect,
    answerHistory,
    nickname,
    sceneIndex,
    envelopeOpened,
    envelopeSkipped,
    trackIndex,
    audioMuted,
    simulatorChoice,
    currentSaveLevel,
    completedSaveLevels,
  ]);

  useEffect(() => {
    if (mode !== "nickname" || nickname) return;
    if (nicknamePlaceholderTimerRef.current !== null)
      window.clearTimeout(nicknamePlaceholderTimerRef.current);
    setNicknamePlaceholderVisible(false);
    nicknamePlaceholderTimerRef.current = window.setTimeout(
      () => setNicknamePlaceholderVisible(true),
      700,
    );
    return () => {
      if (nicknamePlaceholderTimerRef.current !== null)
        window.clearTimeout(nicknamePlaceholderTimerRef.current);
    };
  }, [mode]);

  function delayNicknamePlaceholder() {
    if (nicknamePlaceholderTimerRef.current !== null)
      window.clearTimeout(nicknamePlaceholderTimerRef.current);
    setNicknamePlaceholderVisible(false);
    nicknamePlaceholderTimerRef.current = window.setTimeout(
      () => setNicknamePlaceholderVisible(true),
      700,
    );
  }

  function randomizeNickname() {
    if (nicknameTimerRef.current !== null)
      window.clearInterval(nicknameTimerRef.current);
    if (nicknameFinishTimerRef.current !== null)
      window.clearTimeout(nicknameFinishTimerRef.current);
    if (diceStopTimerRef.current !== null)
      window.clearTimeout(diceStopTimerRef.current);
    setNicknameWasEdited(false);
    setNicknameInvalid(false);
    setNicknameShake(false);
    setNicknamePlaceholderVisible(false);
    setDiceRolling(true);
    if (nicknamePlaceholderTimerRef.current !== null)
      window.clearTimeout(nicknamePlaceholderTimerRef.current);
    setNicknameRolling(true);
    const namesByFace = [
      "Nway Nway",
      "Nway Nway",
      "Julia",
      "Julia",
      "Capi",
      "Capi",
    ];
    const finalFace = 1 + Math.floor(Math.random() * 6);
    const text = namesByFace[finalFace - 1];
    setDiceFace(1 + Math.floor(Math.random() * 6));
    const existingText = nickname;
    let deleteIndex = existingText.length;
    let typeIndex = 0;
    diceStopTimerRef.current = window.setTimeout(() => {
      setDiceFace(finalFace);
      setDiceRolling(false);
      setNicknameRolling(false);
    }, 1000);
    const timer = window.setInterval(() => {
      if (deleteIndex > 0) {
        deleteIndex -= 1;
        setNickname(existingText.slice(0, deleteIndex));
        return;
      }
      if (typeIndex < text.length) {
        typeIndex += 1;
        setNickname(text.slice(0, typeIndex));
        return;
      }
      if (typeIndex === text.length) {
        window.clearInterval(timer);
        nicknameFinishTimerRef.current = window.setTimeout(() => {
          setDiceFace(finalFace);
          setNicknameWasEdited(true);
        }, 250);
      }
    }, 85);
    nicknameTimerRef.current = timer;
  }

  function changeTrack(index: number) {
    const audio = audioRef.current;
    setTrackIndex(index);
    setAudioProgress(0);
    setAudioError(false);
    setAudioLoading(true);
    setMusicPlaying(false);
    if (audio) {
      audio.pause();
      audio.src = tracks[index].src;
      audio.load();
      void audio
        .play()
        .then(() => {
          setAudioStarted(true);
          setMusicPlaying(true);
        })
        .catch(() => setAudioStarted(false));
    }
  }

  function loadSaveLevel(level: number) {
    if (loadingSaveLevel !== null) return;
    setLoadingSaveLevel(level);
    if (saveLoadTimerRef.current !== null)
      window.clearTimeout(saveLoadTimerRef.current);
    saveLoadTimerRef.current = window.setTimeout(() => {
      setCurrentSaveLevel(level);
      setLoadingSaveLevel(null);
      setSaveGameLevel(completedSaveLevels.includes(level) ? null : level);
      setWordSequence([]);
      setWordTileOrder(
        Array.from({ length: level07Words.length }, (_, index) => index).sort(
          () => Math.random() - 0.5,
        ),
      );
      setHandProgress(0);
      setHandRubbing(false);
      setSecretWaitProgress(0);
      setCompletionReveal(null);
    }, 1250);
  }

  function closeSaveModal() {
    if (loadingSaveLevel !== null) return;
    setOpenSaveLevel(null);
    setSaveGameLevel(null);
    setCompletionReveal(null);
  }

  function completeSaveGame(level: number, title: string, message: string) {
    setCompletedSaveLevels((levels) =>
      levels.includes(level) ? levels : [...levels, level],
    );
    setCurrentSaveLevel(null);
    setSaveGameLevel(null);
    setCompletionReveal({ title, message });
  }

  function swapWord(index: number) {
    setWordSequence((sequence) => {
      const selectedAt = sequence.indexOf(index);
      if (selectedAt >= 0)
        return sequence.filter((wordIndex) => wordIndex !== index);
      if (sequence.length >= level07Words.length) return sequence;
      return [...sequence, index];
    });
  }

  function finishLevel07() {
    completeSaveGame(
      0,
      "A thought kept at a distance",
      "You were like a distant star, too far away for me to reach, no matter how hard I tried, so I never did.",
    );
  }

  function markHandMovement() {
    handMotionRef.current = Date.now();
    setHandRubbing(true);
  }

  useEffect(() => {
    if (saveGameLevel !== 1) return;
    const timer = window.setInterval(() => {
      const moving = Date.now() - handMotionRef.current < 180;
      setHandProgress((value) => {
        const next = Math.max(0, Math.min(100, value + (moving ? 1.2 : -0.8)));
        if (next >= 100)
          completeSaveGame(
            1,
            "A feeling that stayed",
            "I've missed your soft hands all these years.",
          );
        return next;
      });
    }, 100);
    return () => window.clearInterval(timer);
  }, [saveGameLevel]);

  useEffect(() => {
    if (
      saveGameLevel !== 0 ||
      wordSequence.length !== level07Words.length ||
      !wordSequence.every((word, index) => word === index)
    )
      return;
    finishLevel07();
  }, [saveGameLevel, wordSequence]);

  useEffect(() => {
    if (saveGameLevel !== 2) return;
    const timer = window.setInterval(() => {
      setSecretWaitProgress((value) =>
        Math.min(100, value + (value >= 60 && value < 80 ? 0.4 : 0.8)),
      );
    }, 100);
    return () => window.clearInterval(timer);
  }, [saveGameLevel]);

  function finishSecretWait() {
    if (secretWaitProgress < 100) {
      closeSaveModal();
      return;
    }
    completeSaveGame(
      2,
      "Just for you",
      "I've prepared a special room for you. I hope you like it.",
    );
  }

  function paintCanvasBackground() {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    context.fillStyle = "#eee4c9";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = "rgba(38,51,71,.18)";
    context.lineWidth = 1;
    context.strokeRect(10.5, 10.5, canvas.width - 21, canvas.height - 21);
    recordDrawingHistory();
  }

  useEffect(() => {
    if (!sketchbookOpen) return;
    requestAnimationFrame(() => {
      const snapshot =
        drawingHistoryRef.current[drawingHistoryIndexRef.current];
      if (snapshot) restoreDrawingSnapshot(snapshot);
      else paintCanvasBackground();
    });
  }, [sketchbookOpen]);

  function recordDrawingHistory() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const snapshot = canvas.toDataURL("image/png");
    const nextHistory = drawingHistoryRef.current.slice(
      0,
      drawingHistoryIndexRef.current + 1,
    );
    nextHistory.push(snapshot);
    drawingHistoryRef.current = nextHistory.slice(-30);
    drawingHistoryIndexRef.current = drawingHistoryRef.current.length - 1;
    setDrawingRevision((value) => value + 1);
  }

  function restoreDrawingSnapshot(snapshot: string) {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    const image = new Image();
    image.onload = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0);
    };
    image.src = snapshot;
  }

  function undoDrawing() {
    if (drawingHistoryIndexRef.current <= 0) return;
    drawingHistoryIndexRef.current -= 1;
    setDrawingRevision((value) => value + 1);
    restoreDrawingSnapshot(
      drawingHistoryRef.current[drawingHistoryIndexRef.current],
    );
  }

  function redoDrawing() {
    if (drawingHistoryIndexRef.current >= drawingHistoryRef.current.length - 1)
      return;
    drawingHistoryIndexRef.current += 1;
    setDrawingRevision((value) => value + 1);
    restoreDrawingSnapshot(
      drawingHistoryRef.current[drawingHistoryIndexRef.current],
    );
  }

  function canvasPoint(event: React.PointerEvent<HTMLCanvasElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * event.currentTarget.width,
      y:
        ((event.clientY - rect.top) / rect.height) * event.currentTarget.height,
    };
  }

  function beginDrawing(event: React.PointerEvent<HTMLCanvasElement>) {
    const context = event.currentTarget.getContext("2d");
    if (!context) return;
    const point = canvasPoint(event);
    drawingRef.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    context.beginPath();
    context.moveTo(point.x, point.y);
  }

  function draw(event: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawingRef.current) return;
    const context = event.currentTarget.getContext("2d");
    if (!context) return;
    const point = canvasPoint(event);
    context.strokeStyle = drawingEraser ? "#eee4c9" : drawingColor;
    context.lineWidth = drawingSize;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.lineTo(point.x, point.y);
    context.stroke();
  }

  function endDrawing() {
    if (drawingRef.current) recordDrawingHistory();
    drawingRef.current = false;
  }

  function downloadCanvas() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "unsent-sketch.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  function downloadLuckyNote() {
    const canvas = document.createElement("canvas");
    canvas.width = 720;
    canvas.height = 430;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.save();
    context.translate(canvas.width / 2, canvas.height / 2);
    context.rotate(-0.018);
    context.translate(-canvas.width / 2, -canvas.height / 2);
    context.fillStyle = "#e8cf91";
    context.fillRect(105, 105, 510, 220);
    context.fillStyle = "#263347";
    context.font = "500 22px monospace";
    context.fillText("LUCKY NOTE", 145, 158);
    context.font = "24px sans-serif";
    context.fillText("試験、頑張ってね。応援してるよ。", 145, 214);
    context.font = "18px monospace";
    context.fillStyle = "#657084";
    context.fillText("a small note for your inventory", 145, 270);
    context.restore();
    const link = document.createElement("a");
    link.download = "unsent-lucky-note.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  if (!hydrated || replayLoading) {
    return (
      <main className="page-shell loading-shell">
        <section className="loading-card">
          <Cat />
          <p className="eyebrow">UNSENT.EXE / RESTORING SAVE FILE</p>
          <p className="loading-copy">Checking where we left off...</p>
          <div className="boot-loader">
            <i />
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <InteractionSounds muted={audioMuted} />
      <div className="paper-card">
        <header className="topbar">
          <span className="brand-mark">UNSENT.EXE</span>
          <span className="topbar-status">
            <span className="status-dot" /> private-ish transmission
          </span>
        </header>

        <div className="artboard">
          <Doodle />
          <div className="stamp">
            FOR YOUR EYES
            <br />
            MAYBE
          </div>

          {mode === "boot" && (
            <section className="content-panel boot-panel" aria-live="polite">
              <div className="eyebrow">UNSENT.EXE / STARTUP LOG</div>
              <Cat />
              <div className="terminal-lines" aria-label="Startup messages">
                <p className="terminal-line terminal-line-one">
                  Initializing courage
                  <span className="log-dots" aria-hidden="true">
                    <i>.</i>
                    <i>.</i>
                    <i>.</i>
                  </span>
                </p>
                <p className="terminal-line terminal-line-two">
                  Loading conversation skills
                  <span className="log-dots" aria-hidden="true">
                    <i>.</i>
                    <i>.</i>
                    <i>.</i>
                  </span>
                </p>
                <p className="terminal-line terminal-line-three">
                  Searching for something normal to say
                  <span className="log-dots" aria-hidden="true">
                    <i>.</i>
                    <i>.</i>
                    <i>.</i>
                  </span>
                </p>
                <p className="terminal-error">ERROR 500: INTERNAL SERVER ERROR</p>
              </div>
              <h1>Oh. You&apos;re here.</h1>
              <p className="lede">
                You&apos;re the one he&apos;s been acting weird about.
              </p>
              <button className="ink-button" onClick={beginCheck}>
                START GAME <span>↗</span>
              </button>
            </section>
          )}

          {mode === "check" && (
            <section className="content-panel" aria-live="polite">
              <div className="eyebrow">
                UNOFFICIAL IDENTITY CHECK / {progress}
              </div>
              <Cat mood={answerWasWrong ? "surprised" : "idle"} />
              <h1>Are you the intended guest?</h1>
              <p className="lede">
                A tiny verification ritual before the tiny game. No pressure.
                The cat is bad at security.
              </p>
              <div className="question-card">
                <p className="question-number">QUESTION {questionIndex + 1}</p>
                <h2>{question.prompt}</h2>
                <div className="answer-grid">
                  {question.answers.map((answer, index) => (
                    <button
                      className={
                        chosen === index ? "answer selected" : "answer"
                      }
                      key={`${answer}-${index}`}
                      onClick={() => chooseAnswer(index)}
                    >
                      <span className="answer-key">
                        {String.fromCharCode(65 + index)}
                      </span>
                      {answer}
                    </button>
                  ))}
                </div>
                {chosen !== null && feedbackVisible && (
                  <p className="reaction">{message}</p>
                )}
              </div>
              {chosen !== null && (
                <button className="ink-button" onClick={nextQuestion}>
                  {feedbackVisible
                    ? questionIndex === questions.length - 1
                      ? "CONTINUE ANYWAY"
                      : "NEXT QUESTION"
                    : "CONTINUE"}
                  <span>↗</span>
                </button>
              )}
            </section>
          )}

          {mode === "nickname" && (
            <section
              className="content-panel nickname-panel"
              aria-live="polite"
            >
              <div className="eyebrow">IDENTITY CHECK / COMPLETE</div>
              <Cat mood="shy" />
              <h1>Okay, you can come in.</h1>
              <p className="lede">
                Before we continue, what should we call you in this very
                official transmission?
              </p>
              <label className="field-label" htmlFor="nickname">
                YOUR CHOSEN NICKNAME
              </label>
              <div className="nickname-input-wrap">
                <input
                  className={`${nicknameInvalid ? "nickname-invalid" : ""} ${nicknameShake ? "nickname-shake" : ""} ${nicknameRolling ? "nickname-rolling" : ""} ${nicknamePlaceholderVisible ? "nickname-placeholder-visible" : "nickname-placeholder-hidden"}`}
                  id="nickname"
                  value={nickname}
                  onChange={(event) => {
                    setNickname(event.target.value);
                    setNicknameWasEdited(true);
                    setNicknameInvalid(false);
                    setNicknameShake(false);
                    if (event.target.value)
                      setNicknamePlaceholderVisible(false);
                    else delayNicknamePlaceholder();
                  }}
                  placeholder="something only you would pick"
                  autoComplete="off"
                  disabled={nicknameRolling}
                />
                <button
                  type="button"
                  className="dice-button"
                  onClick={randomizeNickname}
                  disabled={nicknameRolling}
                  aria-label="Randomize nickname"
                >
                  <span
                    className={
                      diceRolling ? "dice-glyph dice-rolling" : "dice-glyph"
                    }
                  >
                    <DiceFace face={diceFace} position="front" />
                    <DiceFace face={5} position="back" />
                    <DiceFace face={4} position="right" />
                    <DiceFace face={2} position="left" />
                    <DiceFace face={6} position="top" />
                    <DiceFace face={3} position="bottom" />
                  </span>
                </button>
              </div>
              <button
                className="ink-button"
                onClick={startGame}
                disabled={nicknameRolling}
              >
                OPEN THE FILE <span>↗</span>
              </button>
            </section>
          )}

          {mode === "confirmation" && (
            <section
              className="content-panel confirmation-panel"
              aria-live="polite"
            >
              <div className="eyebrow">IDENTITY CHECK / COMPLETE</div>
              <Cat mood="shy" />
              <h1>IDENTITY CONFIRMED</h1>
              <p className="lede">
                {answerHistory[0] === 0 ? (
                  <>
                    You are, statistically and emotionally, the intended person
                    for this game.
                    <br />
                    Welcome back.
                  </>
                ) : (
                  <>
                    If you are a self-identified capybara, you are the one he
                    intended this for. So don’t worry.
                  </>
                )}
              </p>
              <button
                className="ink-button"
                onClick={() => setMode("nickname")}
              >
                CONTINUE <span>↗</span>
              </button>
            </section>
          )}

          {mode === "game" && (
            <section
              className={
                sceneIndex === scenes.length - 1
                  ? "content-panel game-panel final-panel"
                  : "content-panel game-panel"
              }
              aria-live="polite"
            >
              <div className="eyebrow">{scene.eyebrow}</div>
              <Cat mood={sceneIndex === 4 ? "shy" : "idle"} />
              <p className="scene-counter">
                TRANSMISSION {String(sceneIndex + 1).padStart(2, "0")} / 06
              </p>
              <h1>
                {scene.title.replace("[your nickname]", nickname || "you")}
              </h1>
              <p className="lede">{scene.text}</p>
              {sceneIndex === 1 && (
                <div className="mini-options">
                  {[
                    "Say something smooth",
                    "Type, delete, repeat",
                    "Close laptop and move to another country",
                  ].map((choice) => (
                    <button
                      key={choice}
                      className={
                        simulatorChoice === choice
                          ? "mini-option active"
                          : "mini-option"
                      }
                      onClick={() => chooseSimulatorChoice(choice)}
                    >
                      {choice}
                    </button>
                  ))}
                  {simulatorChoice && simulatorFeedbackVisible && (
                    <p className="reaction">
                      {simulatorChoice === "Say something smooth"
                        ? "The cat says: suspiciously smooth. It may have worked."
                        : simulatorChoice === "Type, delete, repeat"
                          ? "The cat says: a classic strategy. You know way too much."
                          : "The cat says: the only correct answer."}
                    </p>
                  )}
                </div>
              )}
              {sceneIndex === 2 && (
                <>
                  <div className="save-file">
                    {[
                      {
                        label: "LEVEL 07",
                        text: "The story goes back a little further than you thought.",
                        detail:
                          "Somewhere in the background, before either of us said anything meaningful, you had already become someone I noticed a little more than I meant to.",
                      },
                      {
                        label: "LEVEL 10",
                        text: "Some moments stay with you longer than you'd expect.",
                        detail:
                          "Maybe the moment I knew for sure was the day you held my hands and comforted me. It was a small thing, but somehow it made everything feel very real.",
                      },
                      {
                        label: "SECRET LEVEL",
                        text: "Somehow, we're talking again.",
                        detail:
                          "A save file approximately six years in the making. The loading screen was longer than expected, but look at us now.",
                      },
                    ].map((level, index) =>
                      completedSaveLevels.includes(index) ? (
                        <div
                          className="save-entry cleared"
                          key={level.label}
                          aria-label={`${level.label} completed`}
                        >
                          <span>LEVEL CLEARED</span>
                          <strong>{level.text}</strong>
                        </div>
                      ) : (
                        <button
                          className={
                            currentSaveLevel === index
                              ? "save-entry selected"
                              : "save-entry"
                          }
                          key={level.label}
                          onClick={() => setOpenSaveLevel(index)}
                          aria-label={`Open ${level.label} save file`}
                          aria-pressed={currentSaveLevel === index}
                        >
                          <span>
                            {currentSaveLevel === index
                              ? "CURRENT SAVE FILE"
                              : level.label}
                          </span>
                          <strong>{level.text}</strong>
                        </button>
                      ),
                    )}
                  </div>
                </>
              )}
              {sceneIndex === 3 && (
                <div className="room-items">
                  <button
                    className="room-item room-item-button"
                    onClick={() => setSketchbookOpen(true)}
                  >
                    <span className="item-icon">✎</span>
                    <strong>SKETCHBOOK</strong>
                    <small>
                      Some people can turn a blank page into something
                      beautiful.
                    </small>
                  </button>
                  <div className="room-item music-item">
                    <span className="item-icon">◌</span>
                    <strong>MUSIC PLAYER</strong>
                    <small>
                      {tracks[trackIndex].label} — ambient transmission
                    </small>
                    <select
                      className="music-select"
                      value={trackIndex}
                      onChange={(event) =>
                        changeTrack(Number(event.target.value))
                      }
                      aria-label="Choose a song"
                    >
                      {tracks.map((track, index) => (
                        <option value={index} key={track.src}>
                          {track.label}
                        </option>
                      ))}
                    </select>
                    <button
                      className="tiny-button"
                      onClick={() => {
                        setAudioMuted((value) => !value);
                        if (audioRef.current)
                          audioRef.current.muted = !audioMuted;
                      }}
                    >
                      {audioMuted ? "UNMUTE" : "MUTE"}
                    </button>
                    {(audioStarted || audioLoading) && (
                      <div className="loading-track">
                        <span className="running-cat">◆</span>
                        <span className="loading-line">
                          <i
                            style={{ width: `${Math.max(audioProgress, 3)}%` }}
                          />
                        </span>
                      </div>
                    )}
                    <small className="audio-status">
                      {audioStarted
                        ? musicPlaying
                          ? "playing softly"
                          : "ready"
                        : "tap anywhere to wake the soundtrack"}
                    </small>
                    {audioError && (
                      <small className="audio-error">
                        This track got shy. Try again.
                      </small>
                    )}
                  </div>
                  <button
                    className="room-item room-item-button"
                    onClick={() => setLuckyNoteOpen(true)}
                  >
                    <span className="item-icon">文</span>
                    <strong>LUCKY NOTE</strong>
                    <small>試験、頑張ってね。応援してるよ。</small>
                  </button>
                </div>
              )}
              {sceneIndex === 4 && (
                <div
                  className={
                    envelopeOpened ? "letter opened" : "letter envelope-card"
                  }
                  role="button"
                  tabIndex={0}
                  onClick={() => setEnvelopeOpened(true)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ")
                      setEnvelopeOpened(true);
                  }}
                  aria-label={
                    envelopeOpened
                      ? "Unsent message opened"
                      : "Open unsent message"
                  }
                >
                  {!envelopeOpened ? (
                    <>
                      <span className="envelope-mark">✉</span>
                      <strong>ONE UNSENT MESSAGE</strong>
                      <small>click to reveal</small>
                    </>
                  ) : (
                    <p>{envelopeCopy}</p>
                  )}
                </div>
              )}
              {sceneIndex !== 3 && (
                <div className="scene-note">{scene.note}</div>
              )}
              <button
                className={`ink-button${sceneContinueLocked ? " scene-continue-locked" : ""}`}
                onClick={nextScene}
                disabled={sceneContinueLocked}
                aria-disabled={sceneContinueLocked}
                title={
                  sceneContinueLocked
                    ? "Complete all three levels first"
                    : undefined
                }
              >
                {sceneIndex === 4 && !envelopeOpened && !envelopeSkipped
                  ? "SKIP FOR YOUR SANITY"
                  : scene.button}{" "}
                <span>↗</span>
              </button>
              {sceneIndex === scenes.length - 1 && replayMessage && (
                <p className="reaction replay-message">{replayMessage}</p>
              )}
              {sceneIndex === 3 && sketchbookOpen && (
                <div
                  className="modal-backdrop"
                  role="presentation"
                  onClick={() => setSketchbookOpen(false)}
                >
                  <section
                    className="art-modal sketchbook-modal"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="sketchbook-title"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <button
                      className="modal-close"
                      onClick={() => setSketchbookOpen(false)}
                      aria-label="Close sketchbook"
                    >
                      ×
                    </button>
                    <p className="question-number">SPECIAL OBJECT / 01</p>
                    <h2 id="sketchbook-title">SKETCHBOOK</h2>
                    <p>
                      Draw something tiny. Or enormous. The cat will pretend to
                      understand.
                    </p>
                    <canvas
                      ref={canvasRef}
                      className="drawing-canvas"
                      width={640}
                      height={360}
                      onPointerDown={beginDrawing}
                      onPointerMove={draw}
                      onPointerUp={endDrawing}
                      onPointerCancel={endDrawing}
                      onPointerLeave={endDrawing}
                      aria-label="Drawing canvas"
                    />
                    <div
                      className="drawing-history"
                      data-revision={drawingRevision}
                      aria-label="Drawing history controls"
                    >
                      <button
                        className="tiny-button"
                        onClick={undoDrawing}
                        disabled={drawingHistoryIndexRef.current <= 0}
                      >
                        UNDO
                      </button>
                      <button
                        className="tiny-button"
                        onClick={redoDrawing}
                        disabled={
                          drawingHistoryIndexRef.current >=
                          drawingHistoryRef.current.length - 1
                        }
                      >
                        REDO
                      </button>
                    </div>
                    <div className="drawing-tools">
                      <button
                        className={
                          drawingEraser ? "tool-button active" : "tool-button"
                        }
                        onClick={() => setDrawingEraser((value) => !value)}
                      >
                        ERASER
                      </button>
                      <span className="color-tools">
                        <span className="tool-label">INK</span>
                        <span className="color-palette">
                          {[
                            "#263347",
                            "#8a6048",
                            "#7f9274",
                            "#ffffff",
                            "#c88d7c",
                            "#a9bfd0",
                            "#e8cf91",
                            "#c06c84",
                            "#b7a6d9",
                            "#6f7f8b",
                            "#d4a72c",
                            "#1f252b",
                          ].map((color) => (
                            <button
                              key={color}
                              className={
                                drawingColor === color && !drawingEraser
                                  ? "color-button active"
                                  : "color-button"
                              }
                              style={{ background: color }}
                              onClick={() => {
                                setDrawingColor(color);
                                setDrawingEraser(false);
                              }}
                              aria-label={`Use ${color} ink`}
                            />
                          ))}
                        </span>
                      </span>
                      <span className="size-tools">
                        <span className="tool-label">SIZE</span>
                        {[2, 4, 7].map((size) => (
                          <button
                            key={size}
                            className={
                              drawingSize === size
                                ? "size-button active"
                                : "size-button"
                            }
                            onClick={() => setDrawingSize(size)}
                          >
                            {size}
                          </button>
                        ))}
                      </span>
                    </div>
                    <div className="modal-actions">
                      <button
                        className="tiny-button"
                        onClick={paintCanvasBackground}
                      >
                        CLEAR PAGE
                      </button>
                      <button className="ink-button" onClick={downloadCanvas}>
                        SAVE DRAWING <span>↗</span>
                      </button>
                    </div>
                  </section>
                </div>
              )}
              {sceneIndex === 3 && luckyNoteOpen && (
                <div
                  className="modal-backdrop"
                  role="presentation"
                  onClick={() => setLuckyNoteOpen(false)}
                >
                  <section
                    className="art-modal lucky-modal"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="lucky-note-title"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <button
                      className="modal-close"
                      onClick={() => setLuckyNoteOpen(false)}
                      aria-label="Close lucky note"
                    >
                      ×
                    </button>
                    <p className="question-number">SPECIAL OBJECT / 03</p>
                    <h2 id="lucky-note-title">LUCKY NOTE</h2>
                    <div className="lucky-preview">
                      試験、頑張ってね。
                      <br />
                      応援してるよ。
                    </div>
                    <button className="ink-button" onClick={downloadLuckyNote}>
                      KEEP IT <span>↗</span>
                    </button>
                  </section>
                </div>
              )}
              {sceneIndex === 2 && openSaveLevel !== null && (
                <div
                  className="modal-backdrop"
                  role="presentation"
                  onClick={closeSaveModal}
                >
                  <section
                    className="save-modal"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="save-modal-title"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <button
                      className="modal-close"
                      onClick={closeSaveModal}
                      disabled={loadingSaveLevel !== null}
                      aria-label="Close save file"
                    >
                      ×
                    </button>
                    <p className="question-number">
                      {loadingSaveLevel === openSaveLevel
                        ? "OPENING MEMORY /"
                        : "ARCHIVED MEMORY /"}{" "}
                      {String(openSaveLevel + 1).padStart(2, "0")}
                    </p>
                    <h2 id="save-modal-title">
                      {["LEVEL 07", "LEVEL 10", "SECRET LEVEL"][openSaveLevel]}
                    </h2>
                    {completionReveal ? (
                      <div
                        className="level-reveal"
                        role="status"
                        aria-live="polite"
                      >
                        <p className="level-reveal-label">
                          {completionReveal.title}
                        </p>
                        <p className="level-reveal-message">
                          {completionReveal.message}
                        </p>
                        <button className="ink-button" onClick={closeSaveModal}>
                          CLOSE MEMORY <span>↗</span>
                        </button>
                      </div>
                    ) : saveGameLevel === 0 ? (
                      <div className="save-mini-game word-game">
                        <p className="game-instruction">
                          <strong>ORDER THE WORDS</strong>
                          <br />
                          Tap the blocks in the right order to rebuild the sentence.
                        </p>
                        <div className="word-blocks">
                          {wordTileOrder.map((wordIndex) => {
                            const word = level07Words[wordIndex];
                            const sequenceNumber =
                              wordSequence.indexOf(wordIndex);
                            return (
                              <button
                                key={wordIndex}
                                className={
                                  sequenceNumber >= 0
                                    ? "word-block selected"
                                    : "word-block"
                                }
                                onClick={() => swapWord(wordIndex)}
                              >
                                {sequenceNumber >= 0 && (
                                  <i className="word-order-label">
                                    {sequenceNumber + 1}
                                  </i>
                                )}
                                {word}
                              </button>
                            );
                          })}
                        </div>
                        <button
                          className="tiny-button give-up-button"
                          onClick={finishLevel07}
                        >
                          GIVE UP — SHOW ME
                        </button>
                      </div>
                    ) : saveGameLevel === 1 ? (
                      <div className="save-mini-game hand-game">
                        <p className="game-instruction">
                          <strong>RUB THE CAT / GENTLY</strong>
                          <br />
                          Keep the little signal going until the progress
                          reaches the end.
                        </p>
                        <div
                          className={
                            handRubbing ? "hand-rub active" : "hand-rub"
                          }
                          role="button"
                          tabIndex={0}
                          onPointerDown={(event) => {
                            markHandMovement();
                            event.currentTarget.setPointerCapture(
                              event.pointerId,
                            );
                          }}
                          onPointerMove={markHandMovement}
                          onPointerUp={() => setHandRubbing(false)}
                          onPointerCancel={() => setHandRubbing(false)}
                          onPointerLeave={() => setHandRubbing(false)}
                          aria-label="Rub the cat to continue"
                        >
                          {handRubbing && (
                            <span className="heart-trail" aria-hidden="true">
                              <i>♥</i>
                              <i>♥</i>
                              <i>♥</i>
                              <i>♥</i>
                            </span>
                          )}
                          <Cat mood="idle" />
                        </div>
                        <div
                          className="hand-progress"
                          aria-label={`${Math.round(handProgress)} percent complete`}
                        >
                          <i style={{ width: `${handProgress}%` }} />
                        </div>
                        <small>
                          {Math.round(handProgress)}% — keep going gently
                        </small>
                      </div>
                    ) : saveGameLevel === 2 ? (
                      <div className="save-mini-game room-game">
                        <p className="wait-question">
                          Can you wait here for a little while?
                        </p>
                        <div
                          className="wait-progress"
                          aria-label={`${Math.round(secretWaitProgress)} percent waited`}
                        >
                          <i style={{ width: `${secretWaitProgress}%` }} />
                        </div>
                        <small>
                          {secretWaitProgress >= 60 && secretWaitProgress < 80
                            ? "There is some trouble preparing the room..."
                            : secretWaitProgress < 100
                              ? secretWaitProgress >= 80
                                ? "Thank you for waiting..."
                                : "The room is still being prepared..."
                              : "It is ready now."}
                        </small>
                        <button
                          className="ink-button wait-button"
                          onClick={finishSecretWait}
                        >
                          I'VE WAITED ENOUGH <span>↗</span>
                        </button>
                      </div>
                    ) : completedSaveLevels.includes(openSaveLevel) ? (
                      <p className="level-already-cleared">
                        This memory has already been kept.
                      </p>
                    ) : loadingSaveLevel === openSaveLevel ? (
                      <div
                        className="save-loading"
                        role="status"
                        aria-live="polite"
                      >
                        <p>Taking a careful look back...</p>
                        <div className="save-loading-track" aria-hidden="true">
                          <i />
                        </div>
                      </div>
                    ) : (
                      <p>
                        {
                          [
                            "Somewhere in the background, before either of us said anything meaningful, you had already become someone I noticed a little more than I meant to.",
                            "Maybe the moment I knew for sure was the day you held my hand and comforted me. It was a small thing, but somehow it made everything feel very real.",
                            "A save file approximately six years in the making. The loading screen was longer than expected, but look at us now.",
                          ][openSaveLevel]
                        }
                      </p>
                    )}
                    {!completedSaveLevels.includes(openSaveLevel) &&
                      saveGameLevel === null && (
                        <button
                          className="ink-button"
                          onClick={() => loadSaveLevel(openSaveLevel)}
                          disabled={loadingSaveLevel !== null}
                        >
                          {loadingSaveLevel === openSaveLevel
                            ? "OPENING..."
                            : "LOAD THIS LEVEL"}{" "}
                          <span>↗</span>
                        </button>
                      )}
                  </section>
                </div>
              )}
            </section>
          )}

          <audio
            ref={audioRef}
            preload="auto"
            autoPlay
            loop
            muted={audioMuted}
            src={tracks[trackIndex].src}
            onCanPlay={() => setAudioLoading(false)}
            onWaiting={() => setAudioLoading(true)}
            onPlaying={() => {
              setAudioLoading(false);
              setAudioStarted(true);
              setMusicPlaying(true);
            }}
            onPause={() => setMusicPlaying(false)}
            onError={() => {
              setAudioLoading(false);
              setAudioError(true);
            }}
            onTimeUpdate={(event) => {
              const audio = event.currentTarget;
              setAudioProgress(
                audio.duration ? (audio.currentTime / audio.duration) * 100 : 0,
              );
            }}
          />
        </div>

        <footer className="footer-note">
          <span>made with questionable courage</span>
          <span>v. 0.1 / not a confession</span>
        </footer>
      </div>
    </main>
  );
}
