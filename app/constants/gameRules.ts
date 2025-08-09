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
        "所有猫牌视为 Skip",
        "至多携带1张Skip",
        "至多携带1张Defuse",
        "禁止携带Attack",
        "至多携带1张Attack",
        "1次免费See the Future (x3)",
        "3-of-a-kind：如果你打出三张同名卡片（并非必须是猫卡），你可以指定你想要的卡片名称并从目标玩家手牌那里拿走那张卡；若其手中没有则无效",
        "任意2张相同的牌都可以打出steal一名玩家的手牌",
        "所有猫牌视为Nope",
        "Tacocat=Reverse",
        "Ralphing Rainbow Cat=Attack (2x)",
        "Beard Cat=Alter the Future×3",
        "Zombie Cat=Defuse",
        "增强Mark：如果被Mark的牌不在下回合打出，则自动被你偷走",
    ],
    
    // 特殊规则互斥关系
    RULE_CONFLICTS: {
        "无特殊规则": ["手牌明牌", "禁止携带 Skip", "所有猫牌视为 Skip", "至多携带1张Skip", "至多携带1张Defuse", "禁止携带Attack", "至多携带1张Attack", "1次免费See the Future (x3)", "3-of-a-kind：如果你打出三张同名卡片（并非必须是猫卡），你可以指定你想要的卡片名称并从目标玩家手牌那里拿走那张卡；若其手中没有则无效", "任意2张相同的牌都可以打出steal一名玩家的手牌", "所有猫牌视为Nope", "Tacocat=Reverse", "Ralphing Rainbow Cat=Attack (2x)", "Beard Cat=Alter the Future×3", "Zombie Cat=Defuse", "增强Mark：如果被Mark的牌不在下回合打出，则自动被你偷走"],
        "禁止携带 Skip": ["所有猫牌视为 Skip", "至多携带1张Skip"],
        "所有猫牌视为 Skip": ["禁止携带 Skip", "至多携带1张Skip"],
        "至多携带1张Skip": ["禁止携带 Skip", "所有猫牌视为 Skip"],
        "禁止携带Attack": ["至多携带1张Attack", "Ralphing Rainbow Cat=Attack (2x)"],
        "至多携带1张Attack": ["禁止携带Attack"],
        "Ralphing Rainbow Cat=Attack (2x)": ["禁止携带Attack"],
        "至多携带1张Defuse": ["Zombie Cat=Defuse"],
        "Zombie Cat=Defuse": ["至多携带1张Defuse"],
    } as Record<string, string[]>,
    AVATARS: [
        '😼', '😻', '🙀', '😿', '😾', '😸', '😹', '😺', '😽',
        '🐱', '🐈', '🐈‍⬛', '🦁', '🐅', '🐆', '🐯', '🙈', '🙉', 
        '🙊', '🐵', '🦊', '🐺', '🐶', '🐕', '🦝', '🐨', '🐼',
        '🐹', '🐭', '🐰', '🐻', '🐻‍❄️', '🐸', '🐲', '🦄', '🎭'
    ],
} as const;
