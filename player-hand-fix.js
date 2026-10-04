(()=>{

  /*
    v15.0 선수 투타 방향 보정
    - 현재 선수 데이터에는 투타 필드가 없는 카드가 많아서
      카드의 실제 선수/임팩트 계열 정보 + 확인된 선수별 예외를 사용한다.
    - 사용자가 육성창에서 직접 고른 타격 방향(battingHand)은 유지한다.
    - 명백히 잘못 저장된 정대현B 방향은 우타/우투로 강제 보정한다.
  */

  const HAND_OVERRIDES = {
    // 1978년생 정대현(우언우타) 카드군
    "정대현B": { batting: "우", throwing: "우", force: true },

    // 이름만 정대현으로 들어온 1978 카드(현재 데이터에서는 2007 국가대표 카드)
    "정대현|SSG": { batting: "우", throwing: "우", force: true },
    "정대현|롯데": { batting: "우", throwing: "우", force: true },

    // 1991년생 정대현은 좌투좌타. 두산·KT·키움 계열 카드가 들어오는 경우 적용.
    "정대현|두산": { batting: "좌", throwing: "좌", force: true },
    "정대현|KT": { batting: "좌", throwing: "좌", force: true },
    "정대현|키움": { batting: "좌", throwing: "좌", force: true },
    "정대현|넥센": { batting: "좌", throwing: "좌", force: true }
  };

  function seriesHand(player) {
    const text = `${player?.series || ""} ${player?.impactSeries || ""}`;
    if (/스위치\s*히터/.test(text)) return { batting: "양" };
    if (/좌타\s*해결사/.test(text)) return { batting: "좌" };
    if (/우타\s*해결사/.test(text)) return { batting: "우" };
    return {};
  }

  function handOverride(player) {
    const exact = HAND_OVERRIDES[`${player?.name || ""}|${player?.team || ""}`];
    const byName = HAND_OVERRIDES[player?.name || ""];
    return exact || byName || {};
  }

  function resolveHand(player) {
    const override = handOverride(player);
    if (override.batting || override.throwing) return override;

    const inferred = seriesHand(player);
    return inferred;
  }

  function applyOne(player) {
    if (!player || !player.name) return false;

    const hand = resolveHand(player);
    let changed = false;

    try {
      const g = typeof getGrowth === "function" ? getGrowth(player) : null;
      const force = !!handOverride(player).force;

      if (hand.batting) {
        // 사용자에게 별도 육성값이 없거나, 명백한 보정 대상이면 데이터값을 교정한다.
        if (g && (force || !g.battingHand)) {
          if (g.battingHand !== hand.batting) {
            g.battingHand = hand.batting;
            changed = true;
          }
        }
        if (force || !player.bats) {
          if (player.bats !== hand.batting) {
            player.bats = hand.batting;
            changed = true;
          }
        }
        if (force || !player.battingHand) {
          if (player.battingHand !== hand.batting) {
            player.battingHand = hand.batting;
            changed = true;
          }
        }
      }

      if (hand.throwing) {
        if (force || !player.throws) {
          if (player.throws !== hand.throwing) {
            player.throws = hand.throwing;
            changed = true;
          }
        }
        if (force || !player.throwingHand) {
          if (player.throwingHand !== hand.throwing) {
            player.throwingHand = hand.throwing;
            changed = true;
          }
        }
      }
    } catch (_) {}

    return changed;
  }

  function applyAll() {
    try {
      if (!Array.isArray(players) || !players.length) return false;

      let changed = false;
      for (const p of players) {
        if (applyOne(p)) changed = true;
      }

      // 현재 화면의 스킬/선수 정보도 즉시 새 투타 방향을 사용하도록 갱신.
      if (changed) {
        try { window.dispatchEvent(new CustomEvent("kboHandCorrectionsApplied")); } catch (_) {}
        try { renderAll(); } catch (_) {}
        try { if (typeof renderGrow === "function") renderGrow(); } catch (_) {}
      }
      return true;
    } catch (_) {
      return false;
    }
  }

  // bootstrap/app.js가 늦게 올라오는 경우를 대비해서 잠깐 재확인한다.
  let tries = 0;
  const timer = setInterval(() => {
    tries += 1;
    if (applyAll() || tries >= 120) clearInterval(timer);
  }, 100);

  applyAll();

  window.__KBO_HAND_OVERRIDES__ = HAND_OVERRIDES;
  window.__KBO_APPLY_HAND_CORRECTIONS__ = applyAll;

})();
