import type { VPMode } from '../types';

export const GAME_RULES = {
    WIN_SCORE: 12,
    MAX_ROUNDS: 5,
    VP_MODES: [
        { name: "5分局 (5/3/1)", scores: [5, 3, 1, 0, 0, 0] },
        { name: "5分局 (5/4/3)", scores: [5, 4, 3, 0, 0, 0] },
        { name: "4分局 (4/2/1)", scores: [4, 2, 1, 0, 0, 0] },
        { name: "4分局 (4/3/2)", scores: [4, 3, 2, 0, 0, 0] },
        { name: "3分局 (3/2/1)", scores: [3, 2, 1, 0, 0, 0] },
        { name: "3分局 (3/1/0)", scores: [3, 1, 0, 0, 0, 0] },
    ] as VPMode[],
    SPECIAL_RULES: [
        "无特殊规则",
        "手牌明牌",
        "禁止携带 Skip",
        "猫牌视为 Skip",
        "至多携带1张Skip",
        "至多携带1张Defuse",
        "禁止携带Attack",
        "至多携带1张Attack",
        "1次免费See the Future",
    ],
    AVATARS: [
        '😼', '😻', '🙀', '😿', '😾', '😸', '😹', '😺', '😽',
        '🐱', '🐈', '🐈‍⬛', '🦁', '🐅', '🐆', '🐯', '🙈', '🙉', 
        '🙊', '🐵', '🦊', '🐺', '🐶', '🐕', '🦝', '🐨', '🐼',
        '🐹', '🐭', '🐰', '🐻', '🐻‍❄️', '🐸', '🐲', '🦄', '🎭'
    ],
} as const;
