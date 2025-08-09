import { GAME_RULES } from '../constants/gameRules';

// 选择特殊规则的函数
export function selectSpecialRules(availableRules: string[]): string[] {
    // 如果只有"无特殊规则"可选，直接返回
    if (availableRules.length === 1 && availableRules[0] === "无特殊规则") {
        return ["无特殊规则"];
    }

    // 过滤掉"无特殊规则"，因为它和其他规则互斥
    const nonNullRules = availableRules.filter(rule => rule !== "无特殊规则");
    
    // 如果没有其他规则可选，返回"无特殊规则"
    if (nonNullRules.length === 0) {
        return ["无特殊规则"];
    }

    // 决定规则数量：60%概率1条，40%概率2条
    const ruleCount = Math.random() < 0.6 ? 1 : 2;
    
    if (ruleCount === 1 || nonNullRules.length === 1) {
        // 选择1条规则
        const randomIndex = Math.floor(Math.random() * nonNullRules.length);
        return [nonNullRules[randomIndex]];
    } else {
        // 选择2条不互斥的规则
        return selectTwoNonConflictingRules(nonNullRules);
    }
}

// 选择两条不互斥的规则
function selectTwoNonConflictingRules(availableRules: string[]): string[] {
    const maxAttempts = 50; // 防止无限循环
    let attempts = 0;
    
    while (attempts < maxAttempts) {
        // 随机选择第一条规则
        const firstRuleIndex = Math.floor(Math.random() * availableRules.length);
        const firstRule = availableRules[firstRuleIndex];
        
        // 获取与第一条规则不冲突的规则
        const compatibleRules = availableRules.filter(rule => 
            rule !== firstRule && !areRulesConflicting(firstRule, rule)
        );
        
        if (compatibleRules.length > 0) {
            // 随机选择第二条规则
            const secondRuleIndex = Math.floor(Math.random() * compatibleRules.length);
            const secondRule = compatibleRules[secondRuleIndex];
            return [firstRule, secondRule];
        }
        
        attempts++;
    }
    
    // 如果找不到兼容的规则组合，返回第一条规则
    const fallbackIndex = Math.floor(Math.random() * availableRules.length);
    return [availableRules[fallbackIndex]];
}

// 检查两条规则是否冲突
function areRulesConflicting(rule1: string, rule2: string): boolean {
    const conflicts = GAME_RULES.RULE_CONFLICTS;
    
    // 检查rule1是否与rule2冲突
    if (conflicts[rule1 as keyof typeof conflicts]?.includes(rule2)) {
        return true;
    }
    
    // 检查rule2是否与rule1冲突
    if (conflicts[rule2 as keyof typeof conflicts]?.includes(rule1)) {
        return true;
    }
    
    return false;
}

// 格式化特殊规则显示文本
export function formatSpecialRules(rules: string[]): string {
    if (rules.length === 0) {
        return "无特殊规则";
    }
    
    if (rules.length === 1) {
        return rules[0];
    }
    
    return rules.join(" + ");
}

// 验证规则组合是否有效（用于测试）
export function validateRulesCombination(rules: string[]): boolean {
    if (rules.length <= 1) {
        return true;
    }
    
    // 检查是否包含"无特殊规则"
    if (rules.includes("无特殊规则")) {
        return rules.length === 1;
    }
    
    // 检查任意两条规则之间是否有冲突
    for (let i = 0; i < rules.length; i++) {
        for (let j = i + 1; j < rules.length; j++) {
            if (areRulesConflicting(rules[i], rules[j])) {
                return false;
            }
        }
    }
    
    return true;
}
